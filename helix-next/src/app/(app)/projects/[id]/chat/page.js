"use client";
import { useState, useEffect, use, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import TopicsSidebar from "@/components/chatRoom/TopicsSidebar";
import ChatArea from "@/components/chatRoom/ChatArea";
import WorkspaceContextSidebar from "@/components/chatRoom/WorkspaceContextSidebar";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function ChatPage({ params }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const currentUser = session?.user;

  // State Management
  const [project, setProject] = useState(null);
  const [topics, setTopics] = useState([]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Drawer states
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  // Online members listing
  const [onlineMembers, setOnlineMembers] = useState([]);

  const socketRef = useRef(null);

  // Close drawers when topic shifts
  useEffect(() => {
    setLeftSidebarOpen(false);
    setRightSidebarOpen(false);
  }, [activeTopic?.id]);

  // 1. Fetch Project Details & Channels (Topics)
  useEffect(() => {
    if (status !== "authenticated" || !projectId) return;

    const fetchInitialData = async () => {
      try {
        // Get project info
        const projRes = await fetch(`/api/projects/${projectId}`);
        const projData = await projRes.json();
        if (projData.error) throw new Error(projData.error);
        setProject(projData);

        // Map list of members as online initially for mockup visibility
        if (projData.members) {
          setOnlineMembers(
            projData.members.map((m) => ({
              id: m.id,
              username: m.username,
              typing: false,
            }))
          );
        }

        // Get channels
        const chanRes = await fetch(`/api/projects/${projectId}/channels`);
        const chanData = await chanRes.json();
        if (chanData.error) throw new Error(chanData.error);
        
        // Fetch message counts for each channel/topic to display inside cards
        const topicsWithCounts = await Promise.all(
          chanData.map(async (topic) => {
            try {
              const msgRes = await fetch(`/api/channels/${topic.id}/messages`);
              const msgData = await msgRes.json();
              return {
                ...topic,
                messageCount: msgData.length || 0,
                lastActive: msgData.length > 0 
                  ? formatRelativeTime(msgData[msgData.length - 1].createdAt)
                  : "No messages",
                unreadCount: 0
              };
            } catch (e) {
              return { ...topic, messageCount: 0, lastActive: "No messages", unreadCount: 0 };
            }
          })
        );

        setTopics(topicsWithCounts);

        if (topicsWithCounts.length > 0) {
          setActiveTopic(topicsWithCounts[0]);
        }
      } catch (err) {
        console.error("Error fetching chat initialization details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [status, projectId]);

  // Helper to print nice elapsed time
  const formatRelativeTime = (isoString) => {
    try {
      const elapsed = Date.now() - new Date(isoString).getTime();
      const mins = Math.floor(elapsed / 60000);
      if (mins < 1) return "Just now";
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      return new Date(isoString).toLocaleDateString();
    } catch (e) {
      return "";
    }
  };

  // 2. Fetch channel messages when active topic changes
  useEffect(() => {
    if (!activeTopic?.id) return;

    let ignore = false;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/channels/${activeTopic.id}/messages`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        if (!ignore) {
          setMessages(data);
        }
      } catch (err) {
        console.error("Error loading topic messages:", err);
      }
    };

    fetchMessages();

    return () => {
      ignore = true;
    };
  }, [activeTopic?.id]);

  // 3. Socket.io setup & room triggers
  const activeTopicRef = useRef(activeTopic?.id);
  const joinedRoomRef = useRef(null);
  const topicsRef = useRef(topics);

  useEffect(() => {
    activeTopicRef.current = activeTopic?.id;
  }, [activeTopic?.id]);

  useEffect(() => {
    topicsRef.current = topics;
  }, [topics]);

  // Wake up Render.com socket server if external URL is defined
  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    if (socketUrl) {
      const wakeUrl = socketUrl.replace("ws://", "http://").replace("wss://", "https://");
      fetch(wakeUrl)
        .then(() => console.log("Wake-up request sent to Render.com socket server"))
        .catch((err) => console.warn("Render.com socket server wake-up request error:", err));
    }
  }, []);

  // Handle single socket connection lifecycle
  useEffect(() => {
    if (!currentUser?.id) return;

    let socket;
    const socketInitializer = () => {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "";
      const isCustomUrl = !!process.env.NEXT_PUBLIC_SOCKET_URL;
      socket = io(socketUrl, {
        path: isCustomUrl ? undefined : "/api/socket",
        transports: ["polling", "websocket"],
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Socket client connected successfully. ID:", socket.id);
        if (activeTopicRef.current) {
          const roomName = `channel_${activeTopicRef.current}`;
          socket.emit("join-room", roomName);
          joinedRoomRef.current = roomName;
        }
      });

      socket.on("connect_error", (err) => {
        console.error("Socket client connection error details:", err.message, err);
      });

      // Receive new message
      socket.on("receive-message", (message) => {
        if (message.channelId === activeTopicRef.current) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === message.id)) return prev;
            return [...prev, message];
          });
        }

        // Browser push notification if from another user
        if (message.senderId !== currentUser?.id && typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
          const matchedTopic = topicsRef.current.find((t) => t.id === message.channelId);
          const topicName = matchedTopic ? matchedTopic.name : "chat";
          new Notification(`#${topicName}`, {
            body: `${message.sender?.username || "Someone"}: ${message.text}`,
            icon: "/helix_logo.svg",
          });
        }

        // Increment count in sidebar topics card
        setTopics((prev) =>
          prev.map((t) =>
            t.id === message.channelId
              ? { ...t, messageCount: (t.messageCount || 0) + 1, lastActive: "Just now" }
              : t
          )
        );
      });

      // Update message flags/reactions
      socket.on("update-message", (message) => {
        if (message.channelId === activeTopicRef.current) {
          setMessages((prev) =>
            prev.map((m) => (m.id === message.id ? message : m))
          );
        }
      });

      // Receive typing statuses
      socket.on("typing", ({ username, typing }) => {
        setOnlineMembers((prev) =>
          prev.map((m) => (m.username === username ? { ...m, typing } : m))
        );
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket client disconnected. Reason:", reason);
      });
    };

    socketInitializer();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [currentUser?.id]);

  // Handle room switching on existing socket
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    if (joinedRoomRef.current) {
      socket.emit("leave-room", joinedRoomRef.current);
    }

    if (activeTopic?.id) {
      const roomName = `channel_${activeTopic.id}`;
      socket.emit("join-room", roomName);
      joinedRoomRef.current = roomName;
    } else {
      joinedRoomRef.current = null;
    }
  }, [activeTopic?.id]);

  // 4. Action triggers forwarded to Socket server
  const handleSendMessage = ({ text, replyTo }) => {
    if (!socketRef.current || !activeTopic?.id || !currentUser?.id) return;

    socketRef.current.emit("send-message", {
      channelId: activeTopic.id,
      senderId: currentUser.id,
      text,
      replyTo,
    });
  };

  const handlePinMessage = (messageId) => {
    if (!socketRef.current) return;
    const msg = messages.find((m) => m.id === messageId);
    if (!msg) return;

    socketRef.current.emit("update-message-flags", {
      messageId,
      field: "pinned",
      value: !msg.pinned,
    });
  };

  const handleMarkImportant = (messageId) => {
    if (!socketRef.current) return;
    const msg = messages.find((m) => m.id === messageId);
    if (!msg) return;

    socketRef.current.emit("update-message-flags", {
      messageId,
      field: "important",
      value: !msg.important,
    });
  };

  const handleMarkDecision = (messageId) => {
    if (!socketRef.current) return;
    const msg = messages.find((m) => m.id === messageId);
    if (!msg) return;

    socketRef.current.emit("update-message-flags", {
      messageId,
      field: "decision",
      value: !msg.decision,
    });
  };

  const handleAddReaction = (messageId, emoji) => {
    if (!socketRef.current || !currentUser?.id) return;

    socketRef.current.emit("add-reaction", {
      messageId,
      emoji,
      userId: currentUser.id,
    });
  };

  // 5. Create new topic in DB
  const handleCreateTopic = async ({ title, type, status }) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/channels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: title, type, status }),
      });
      const newTopic = await res.json();
      if (newTopic.error) throw new Error(newTopic.error);

      const topicWithMetadata = {
        ...newTopic,
        messageCount: 0,
        lastActive: "No messages",
        unreadCount: 0,
      };

      setTopics((prev) => [...prev, topicWithMetadata]);
      setActiveTopic(topicWithMetadata);
    } catch (err) {
      console.error("Error creating channel topic:", err);
    }
  };

  // Parse items for right sidebar context dashboard
  const pinnedMessages = messages.filter((m) => m.pinned);
  const importantMessages = messages.filter((m) => m.important);
  const decisions = messages.filter((m) => m.decision);

  const parseSharedLinks = () => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const links = [];

    messages.forEach((m) => {
      if (m.system || !m.text) return;
      const matches = m.text.match(urlRegex);
      if (matches) {
        matches.forEach((url) => {
          let title = "Shared Link";
          if (url.includes("github.com")) title = "GitHub Repository";
          else if (url.includes("figma.com")) title = "Figma Design Mockups";
          else if (url.includes("neon")) title = "Neon SQL database";
          else if (url.includes("docs") || url.includes("wiki")) title = "API Documentation";

          if (!links.some((l) => l.url === url)) {
            links.push({ url, title });
          }
        });
      }
    });

    return links;
  };
  const sharedLinks = parseSharedLinks();

  const handleMessageClick = (messageId) => {
    const el = document.getElementById(messageId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("bg-(--accent)/10", "border-(--accent)/30");
      setTimeout(() => {
        el.classList.remove("bg-(--accent)/10", "border-(--accent)/30");
      }, 2000);
    }
  };

  useEffect(() => {
    if (project?.name) {
      if (activeTopic) {
        document.title = `#${activeTopic.name || activeTopic.title} - ${project.name} | Helix`;
      } else {
        document.title = `${project.name} Chat | Helix`;
      }
    } else {
      document.title = "Discussion & Chat | Helix";
    }
  }, [project?.name, activeTopic]);

  if (loading || status === "loading") {
    return <LoadingScreen fullScreen={true} />;
  }

  return (
    <div className="flex h-full flex-1 min-h-0 overflow-hidden bg-(--bg-main) animate-in fade-in duration-300">
      {/* 1. Left Sidebar: Topics */}
      <TopicsSidebar
        projectName={project?.name}
        topics={topics}
        activeTopic={activeTopic}
        setActiveTopic={(t) => {
          setTopics((prev) =>
            prev.map((item) => (item.id === t.id ? { ...item, unreadCount: 0 } : item))
          );
          setActiveTopic(t);
        }}
        onCreateTopic={handleCreateTopic}
        isOpen={leftSidebarOpen}
        onClose={() => setLeftSidebarOpen(false)}
      />

      {/* 2. Middle Panel: Discussion */}
      <ChatArea
        activeTopic={activeTopic}
        messages={messages}
        currentUser={currentUser}
        onSendMessage={handleSendMessage}
        onPinMessage={handlePinMessage}
        onMarkImportant={handleMarkImportant}
        onMarkDecision={handleMarkDecision}
        onAddReaction={handleAddReaction}
        onlineMembers={onlineMembers}
        onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
        onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
      />

      {/* 3. Right Sidebar: Workspace Context */}
      <WorkspaceContextSidebar
        pinnedMessages={pinnedMessages}
        importantMessages={importantMessages}
        decisions={decisions}
        sharedLinks={sharedLinks}
        onMessageClick={handleMessageClick}
        isOpen={rightSidebarOpen}
        onClose={() => setRightSidebarOpen(false)}
      />
    </div>
  );
}
