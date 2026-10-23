import { Server } from "socket.io";
import { prisma } from "@/lib/prisma";
import { redisClient } from "@/lib/redis";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
    res.end();
    return;
  }

  console.log("Socket is initializing");
  const io = new Server(res.socket.server, {
    path: "/api/socket",
    addTrailingSlash: false,
    cors: {
      origin: "*",
    },
  });

  // Setup Redis Adapter for multi-instance sync (e.g. Vercel)
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    try {
      const { createAdapter } = await import("@socket.io/redis-adapter");
      const { createClient } = await import("redis");

      const pubClient = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries >= 3) return false;
            return 1000; // Retry after 1 second
          }
        }
      });
      const subClient = pubClient.duplicate();

      pubClient.on("error", (err) => console.warn("Socket.io Redis PubClient error:", err.message));
      subClient.on("error", (err) => console.warn("Socket.io Redis SubClient error:", err.message));

      await Promise.all([pubClient.connect(), subClient.connect()]);
      io.adapter(createAdapter(pubClient, subClient));
      console.log("Socket.io Redis adapter connected successfully");
    } catch (adapterErr) {
      console.warn("Failed to initialize Socket.io Redis adapter. Falling back to local adapter:", adapterErr.message);
    }
  }

  res.socket.server.io = io;

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

        // Parse JSON strings back to objects for emissions
        const formatted = {
          ...newMessage,
          reactions: {},
          replyTo: replyTo || null,
        };

        // Invalidate Redis cache
        try {
          await redisClient.del(`channel:${channelId}:messages`);
        } catch (cacheErr) {
          console.warn("Redis error on send-message del:", cacheErr.message);
        }

        // Emit to the room (channel_${channelId})
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

        // Invalidate Redis cache
        try {
          await redisClient.del(`channel:${message.channelId}:messages`);
        } catch (cacheErr) {
          console.warn("Redis error on add-reaction del:", cacheErr.message);
        }

        // Broadcast updated message to room
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

        // Invalidate Redis cache
        try {
          await redisClient.del(`channel:${updatedMessage.channelId}:messages`);
        } catch (cacheErr) {
          console.warn("Redis error on update-message-flags del:", cacheErr.message);
        }

        // Broadcast updated message to room
        io.to(`channel_${updatedMessage.channelId}`).emit("update-message", formatted);
      } catch (err) {
        console.error("Error updating message flags:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  res.end();
}
