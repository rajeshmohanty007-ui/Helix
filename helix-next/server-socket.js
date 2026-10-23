const { createServer } = require("http");
const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");
require("dotenv").config();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Create HTTP server for health checking and WebSocket upgrade bindings
const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Helix Socket Server is running\n");
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Setup Redis Client & Adapter for horizontal scaling/sync
const redisUrl = process.env.REDIS_URL;
let cacheClient = null;

if (redisUrl) {
  const pubClient = createClient({
    url: redisUrl,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries >= 5) return false;
        return 1000; // Retry connection after 1s
      }
    }
  });
  const subClient = pubClient.duplicate();
  cacheClient = createClient({ url: redisUrl });

  pubClient.on("error", (err) => console.error("Redis PubClient Error:", err));
  subClient.on("error", (err) => console.error("Redis SubClient Error:", err));
  cacheClient.on("error", (err) => console.error("Redis CacheClient Error:", err));

  Promise.all([
    pubClient.connect(),
    subClient.connect(),
    cacheClient.connect()
  ])
    .then(() => {
      io.adapter(createAdapter(pubClient, subClient));
      console.log("Socket.io Redis adapter connected successfully");
    })
    .catch((err) => {
      console.error("Failed to connect Redis clients for Socket.io adapter:", err);
    });
} else {
  console.warn("REDIS_URL not set. Running Socket.io without Redis adapter.");
}

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left room ${roomId}`);
  });

  // 1. Sending messages
  socket.on("send-message", async (data) => {
    const { channelId, senderId, text, replyTo, system = false, progress = null } = data;
    try {
      const newMessage = await prisma.message.create({
        data: {
          text,
          senderId,
          channelId,
          system,
          progress,
          replyTo: replyTo ? JSON.stringify(replyTo) : null,
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      // Parse JSON strings back to objects for emission
      const formatted = {
        ...newMessage,
        reactions: {},
        replyTo: replyTo || null,
      };

      // Invalidate Redis messages cache for this channel
      if (cacheClient) {
        try {
          await cacheClient.del(`channel:${channelId}:messages`);
        } catch (cacheErr) {
          console.warn("Redis error on send-message del:", cacheErr.message);
        }
      }

      // Emit to room
      io.to(`channel_${channelId}`).emit("receive-message", formatted);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  // 2. Typing indicator
  socket.on("typing", (data) => {
    const { channelId, username, typing } = data;
    socket.to(`channel_${channelId}`).emit("typing", { username, typing });
  });

  // 3. Toggle emoji reactions
  socket.on("add-reaction", async (data) => {
    const { messageId, emoji, userId } = data;
    try {
      const message = await prisma.message.findUnique({
        where: { id: messageId },
      });

      if (!message) return;

      let reactions = {};
      if (message.reactions) {
        try {
          reactions = JSON.parse(message.reactions);
        } catch (e) {
          reactions = {};
        }
      }

      const users = reactions[emoji] || [];
      if (users.includes(userId)) {
        // Remove user reaction
        const idx = users.indexOf(userId);
        users.splice(idx, 1);
        if (users.length === 0) {
          delete reactions[emoji];
        } else {
          reactions[emoji] = users;
        }
      } else {
        // Add user reaction
        users.push(userId);
        reactions[emoji] = users;
      }

      // Save updated reactions back to DB
      const updatedMessage = await prisma.message.update({
        where: { id: messageId },
        data: {
          reactions: JSON.stringify(reactions),
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      const formatted = {
        ...updatedMessage,
        reactions,
        replyTo: updatedMessage.replyTo ? JSON.parse(updatedMessage.replyTo) : null,
      };

      // Invalidate cache
      if (cacheClient) {
        try {
          await cacheClient.del(`channel:${message.channelId}:messages`);
        } catch (cacheErr) {
          console.warn("Redis error on add-reaction del:", cacheErr.message);
        }
      }

      // Broadcast to room
      io.to(`channel_${message.channelId}`).emit("update-message", formatted);
    } catch (err) {
      console.error("Error adding reaction:", err);
    }
  });

  // 4. Update Pin, Important, or Decision flags
  socket.on("update-message-flags", async (data) => {
    const { messageId, field, value } = data; // field is 'pinned', 'important', or 'decision'
    try {
      if (!["pinned", "important", "decision"].includes(field)) return;

      const updatedMessage = await prisma.message.update({
        where: { id: messageId },
        data: {
          [field]: value,
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      const formatted = {
        ...updatedMessage,
        reactions: updatedMessage.reactions ? JSON.parse(updatedMessage.reactions) : {},
        replyTo: updatedMessage.replyTo ? JSON.parse(updatedMessage.replyTo) : null,
      };

      // Invalidate cache
      if (cacheClient) {
        try {
          await cacheClient.del(`channel:${updatedMessage.channelId}:messages`);
        } catch (cacheErr) {
          console.warn("Redis error on update-message-flags del:", cacheErr.message);
        }
      }

      // Broadcast to room
      io.to(`channel_${updatedMessage.channelId}`).emit("update-message", formatted);
    } catch (err) {
      console.error("Error updating message flags:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Helix Socket Server is running on port ${PORT}`);
});
