import { useEffect, useRef, useState } from "react";
import TagIcon from "@mui/icons-material/Tag";
import SendIcon from "@mui/icons-material/Send";
import PushPinIcon from "@mui/icons-material/PushPin";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import ReplyIcon from "@mui/icons-material/Reply";
import MoodIcon from "@mui/icons-material/Mood";
import CloseIcon from "@mui/icons-material/Close";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import MenuIcon from "@mui/icons-material/Menu";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { getTopicIcon } from "./TopicsSidebar";

export default function ChatArea({
  activeTopic,
  messages = [],
  currentUser,
  onSendMessage,
  onPinMessage,
  onMarkImportant,
  onMarkDecision,
  onAddReaction,
  onlineMembers = [],
  onToggleLeftSidebar,
  onToggleRightSidebar,
}) {
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null); // stores messageId
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSendMessage({
      text: text.trim(),
      replyTo: replyTo ? { id: replyTo.id, username: replyTo.sender?.username, text: replyTo.text } : null,
    });

    setText("");
    setReplyTo(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Helper to format timestamps
  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return "";
    }
  };

  // Helper to generate initials avatar background color based on name
  const getAvatarColor = (name) => {
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-amber-500",
      "bg-emerald-500",
      "bg-teal-500",
      "bg-cyan-500",
      "bg-sky-500",
      "bg-indigo-500",
      "bg-violet-500",
      "bg-fuchsia-500",
      "bg-pink-500",
      "bg-rose-500",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // Parsing message text to format code, mentions, links
  const parseMessageText = (content) => {
    if (!content) return "";

    // Code blocks: ```code```
    const codeBlockRegex = /```([\s\S]*?)```/g;
    // Inline code: `code`
    const inlineCodeRegex = /`([^`]+)`/g;
    // Mentions: @username
    const mentionRegex = /@(\w+)/g;
    // Links: https://...
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    let parts = [content];

    // Helper function to split parts using a regex and mapping replacement components
    const processParts = (regex, formatter) => {
      const newParts = [];
      for (const part of parts) {
        if (typeof part !== "string") {
          newParts.push(part);
          continue;
        }

        const matches = [...part.matchAll(regex)];
        if (matches.length === 0) {
          newParts.push(part);
          continue;
        }

        let lastIdx = 0;
        matches.forEach((match) => {
          const matchIdx = match.index;
          if (matchIdx > lastIdx) {
            newParts.push(part.substring(lastIdx, matchIdx));
          }
          newParts.push(formatter(match[1] || match[0], match.index));
          lastIdx = matchIdx + match[0].length;
        });

        if (lastIdx < part.length) {
          newParts.push(part.substring(lastIdx));
        }
      }
      parts = newParts;
    };

    // Process blocks first
    processParts(codeBlockRegex, (val, idx) => (
      <pre key={`codeblock-${idx}`} className="my-2 p-3 bg-neutral-950/80 font-mono text-xs text-green-400 rounded-lg overflow-x-auto border border-white/5 select-text">
        <code>{val}</code>
      </pre>
    ));

    // Process inline code
    processParts(inlineCodeRegex, (val, idx) => (
      <code key={`inline-${idx}`} className="px-1.5 py-0.5 bg-black/10 dark:bg-white/10 font-mono text-xs rounded text-(--accent) select-text">
        {val}
      </code>
    ));

    // Process URLs
    processParts(urlRegex, (val, idx) => (
      <a key={`url-${idx}`} href={val} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
        {val}
      </a>
    ));

    // Process Mentions
    processParts(mentionRegex, (val, idx) => (
      <span key={`mention-${idx}`} className="px-1.5 py-0.5 bg-(--accent)/15 text-(--accent) rounded-md text-xs font-semibold select-all">
        @{val}
      </span>
    ));

    return parts.map((part, i) => <span key={i}>{part}</span>);
  };

  return (
    <section className="flex flex-1 flex-col h-full bg-(--bg-main) min-w-0 select-text relative">
      {/* Header */}
      <header className="flex flex-row items-center justify-between border-b border-(--border-color) px-4 py-3 bg-(--bg-sidebar) gap-2 shrink-0">
        <div className="flex items-center gap-2">
          {/* Hamburger toggle for left sidebar (mobile only) */}
          <button
            type="button"
            onClick={onToggleLeftSidebar}
            className="md:hidden flex items-center justify-center p-1 text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-hover) rounded-lg mr-1 cursor-pointer"
            title="Toggle Topics List"
          >
            <MenuIcon sx={{ fontSize: 20 }} />
          </button>
          {activeTopic ? (
            <>
              <div className="flex h-8 w-8 items-center justify-center bg-(--bg-main) border border-(--border-color) rounded-lg shrink-0">
                {getTopicIcon(activeTopic.type, { fontSize: 16 })}
              </div>
              <h2 className="text-sm font-bold text-(--text-primary) truncate max-w-[120px] sm:max-w-none">
                {activeTopic.name || activeTopic.title}
              </h2>
            </>
          ) : (
            <h2 className="text-sm font-bold text-(--text-primary)">Select a Topic</h2>
          )}
        </div>

        {/* Online Members Header List */}
        {activeTopic && (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex -space-x-1.5 overflow-hidden">
              {onlineMembers.map((member) => (
                <div
                  key={member.id}
                  className={`flex h-6 w-6 items-center justify-center rounded-lg text-white font-bold text-[9px] border-2 border-(--bg-sidebar) ${getAvatarColor(
                    member.username
                  )}`}
                  title={member.username}
                >
                  {member.username.slice(0, 2).toUpperCase()}
                </div>
              ))}
            </div>
            <div className="text-[10px] text-(--text-secondary) font-bold flex items-center gap-1.5 shrink-0">
              <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
              <span>
                {onlineMembers.length} Online{" "}
                {onlineMembers.some((m) => m.typing) && (
                  <span className="italic animate-pulse text-(--accent) ml-1 hidden sm:inline">
                    (typing...)
                  </span>
                )}
              </span>
            </div>
            {/* Info toggle for right sidebar (mobile/tablet only) */}
            <button
              type="button"
              onClick={onToggleRightSidebar}
              className="lg:hidden flex items-center justify-center p-1.5 text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-hover) rounded-lg cursor-pointer"
              title="Toggle Workspace Context"
            >
              <InfoIcon sx={{ fontSize: 18 }} />
            </button>
          </div>
        )}
      </header>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 helix-scroll bg-(--bg-main)">
        {!activeTopic ? (
          <div className="flex flex-col items-center justify-center h-full text-(--text-secondary)">
            <TagIcon sx={{ fontSize: 48 }} className="animate-pulse mb-2 text-(--accent)" />
            <p className="text-xs font-semibold text-center max-w-xs">
              Select a conversation topic from the sidebar or click "New Topic" to start discussing.
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-(--text-secondary) p-8 text-center">
            <div className="h-12 w-12 rounded-full bg-(--accent)/10 flex items-center justify-center text-(--accent) mb-3">
              {getTopicIcon(activeTopic.type, { fontSize: 24 })}
            </div>
            <h3 className="text-sm font-bold text-(--text-primary) mb-1">
              Welcome to the #{activeTopic.title} discussion!
            </h3>
            <p className="text-xs max-w-xs text-(--text-secondary)">
              This topic has workflow status: <span className="font-semibold text-(--accent)">{activeTopic.status}</span>. Keep comments organized around the task!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => {
              // Handle System Messages
              if (msg.system) {
                const isProgress = msg.progress !== undefined;
                return (
                  <div
                    key={msg.id || index}
                    className="flex justify-center my-3 animate-in fade-in slide-in-from-bottom-2 duration-200"
                  >
                    <div className="w-full max-w-md rounded-2xl border border-(--border-color) bg-(--bg-sidebar) p-3 shadow-xs flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-(--accent)/15 text-(--accent) px-2 py-0.5 text-[8px] font-bold tracking-wider uppercase select-none">
                          System Log
                        </span>
                        <span className="text-[10px] text-(--text-secondary)">
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-(--text-primary)">
                        {msg.text}
                      </p>
                      {/* Dynamic Progress indicator */}
                      {isProgress && (
                        <div className="space-y-1 mt-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-(--text-secondary)">Progress Update</span>
                            <span className="font-bold text-(--accent)">{msg.progress}%</span>
                          </div>
                          <div className="w-full bg-(--bg-main) rounded-full h-1.5 overflow-hidden border border-(--border-color)">
                            <div
                              className="bg-gradient-to-r from-(--accent) to-purple-400 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${msg.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              const senderName = msg.sender?.username || "Unknown User";
              const initials = senderName.slice(0, 2).toUpperCase();
              const isMe = msg.sender?.id === currentUser?.id;

              return (
                <div
                  key={msg.id}
                  className="flex flex-col group relative rounded-2xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02] p-2 transition duration-150 border border-transparent hover:border-(--border-color)"
                >
                  {/* Reply Quote Header */}
                  {msg.replyTo && (
                    <div className="flex items-center gap-1 text-[10px] text-(--text-secondary) pl-10 mb-1 select-none opacity-80">
                      <ReplyIcon sx={{ fontSize: 12, transform: "scaleY(-1)" }} />
                      <span>Replying to</span>
                      <span className="font-bold text-(--text-primary)">@{msg.replyTo.username}</span>
                      <span className="truncate max-w-[120px] italic">"{msg.replyTo.text}"</span>
                    </div>
                  )}

                  <div className="flex gap-3 items-start">
                    {/* User Avatar */}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white font-bold shadow-inner text-xs ${getAvatarColor(
                        senderName
                      )}`}
                    >
                      {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-(--text-primary) truncate">
                          {senderName}
                        </span>
                        <span className="text-[9px] text-(--text-secondary) shrink-0">
                          {formatTime(msg.createdAt)}
                        </span>
                        {isMe && (
                          <span className="text-[8px] bg-(--accent)/15 text-(--accent) font-bold px-1.5 py-0.5 rounded-full select-none">
                            You
                          </span>
                        )}
                        {/* Context flags indicators */}
                        {msg.pinned && <PushPinIcon sx={{ fontSize: 10, color: "#eab308" }} />}
                        {msg.important && <LabelImportantIcon sx={{ fontSize: 10, color: "#f43f5e" }} />}
                        {msg.decision && <PlaylistAddCheckIcon sx={{ fontSize: 12, color: "#10b981" }} />}
                      </div>
                      <div className="mt-0.5 text-xs text-(--text-secondary) whitespace-pre-wrap break-words leading-relaxed select-text font-medium">
                        {parseMessageText(msg.text)}
                      </div>

                      {/* Render Reactions badges */}
                      {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2 select-none">
                          {Object.entries(msg.reactions).map(([emoji, users]) => {
                            const hasReacted = users.includes(currentUser?.id);
                            return (
                              <button
                                key={emoji}
                                onClick={() => onAddReaction(msg.id, emoji)}
                                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] transition duration-150 cursor-pointer ${
                                  hasReacted
                                    ? "bg-(--accent)/15 border-(--accent) text-(--accent)"
                                    : "bg-(--bg-sidebar) border-(--border-color) hover:bg-(--bg-hover) text-(--text-secondary)"
                                }`}
                              >
                                <span>{emoji}</span>
                                <span>{users.length}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hover Actions Toolbar */}
                  <div className="absolute right-3 -top-3.5 hidden group-hover:flex items-center bg-(--bg-card) border border-(--border-color) rounded-xl shadow-lg px-1 py-0.5 z-20 gap-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                    <button
                      onClick={() => setReplyTo(msg)}
                      className="p-1.5 text-(--text-secondary) hover:text-(--accent) hover:bg-(--bg-hover) rounded-lg transition cursor-pointer"
                      title="Reply"
                    >
                      <ReplyIcon sx={{ fontSize: 14 }} />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowEmojiPicker(showEmojiPicker === msg.id ? null : msg.id)}
                        className="p-1.5 text-(--text-secondary) hover:text-(--accent) hover:bg-(--bg-hover) rounded-lg transition cursor-pointer"
                        title="React"
                      >
                        <MoodIcon sx={{ fontSize: 14 }} />
                      </button>
                      {/* Emoji Picker Popover */}
                      {showEmojiPicker === msg.id && (
                        <div className="absolute bottom-full right-0 mb-1.5 bg-(--bg-card) border border-(--border-color) rounded-xl shadow-xl p-1.5 flex gap-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                          {["👍", "❤️", "🔥", "🚀", "😄"].map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => {
                                onAddReaction(msg.id, emoji);
                                setShowEmojiPicker(null);
                              }}
                              className="hover:scale-125 transition duration-150 p-1 text-sm cursor-pointer"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onPinMessage(msg.id)}
                      className={`p-1.5 hover:bg-(--bg-hover) rounded-lg transition cursor-pointer ${
                        msg.pinned ? "text-[#eab308]" : "text-(--text-secondary) hover:text-[#eab308]"
                      }`}
                      title={msg.pinned ? "Unpin message" : "Pin message"}
                    >
                      <PushPinIcon sx={{ fontSize: 14 }} />
                    </button>
                    <button
                      onClick={() => onMarkImportant(msg.id)}
                      className={`p-1.5 hover:bg-(--bg-hover) rounded-lg transition cursor-pointer ${
                        msg.important ? "text-[#f43f5e]" : "text-(--text-secondary) hover:text-[#f43f5e]"
                      }`}
                      title={msg.important ? "Remove Important flag" : "Mark as Important"}
                    >
                      <LabelImportantIcon sx={{ fontSize: 14 }} />
                    </button>
                    <button
                      onClick={() => onMarkDecision(msg.id)}
                      className={`p-1.5 hover:bg-(--bg-hover) rounded-lg transition cursor-pointer ${
                        msg.decision ? "text-[#10b981]" : "text-(--text-secondary) hover:text-[#10b981]"
                      }`}
                      title={msg.decision ? "Remove Decision log" : "Mark as Decision"}
                    >
                      <PlaylistAddCheckIcon sx={{ fontSize: 16 }} />
                    </button>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Reply Context Notification bar */}
      {replyTo && (
        <div className="px-4 py-1.5 bg-(--bg-sidebar) border-t border-(--border-color) flex items-center justify-between text-xs text-(--text-secondary) animate-in slide-in-from-bottom-1 duration-150">
          <div className="flex items-center gap-1.5">
            <ReplyIcon sx={{ fontSize: 14, transform: "scaleY(-1)" }} />
            <span>Replying to </span>
            <span className="font-bold text-(--text-primary)">@{replyTo.sender?.username}</span>
          </div>
          <button
            onClick={() => setReplyTo(null)}
            className="p-0.5 hover:bg-(--bg-hover) rounded-lg transition text-(--text-secondary) hover:text-red-500 cursor-pointer"
          >
            <CloseIcon sx={{ fontSize: 14 }} />
          </button>
        </div>
      )}

      {/* Message Input Box */}
      {activeTopic && (
        <div className="px-4 pb-4 pt-2 bg-(--bg-main) border-t border-(--border-color) shrink-0">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <textarea
              rows={1}
              placeholder={`Message #${activeTopic.name || activeTopic.title}`}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              className="w-full rounded-2xl bg-(--bg-sidebar) border border-(--border-color) hover:border-(--text-secondary) focus:border-(--accent) pl-4 pr-12 py-3 text-xs text-(--text-primary) outline-none shadow-sm transition duration-150 resize-none font-medium helix-scroll max-h-24"
            />
            <button
              type="submit"
              disabled={!text.trim()}
              className="absolute right-3 p-1.5 text-white bg-(--accent) rounded-xl transition hover:opacity-95 disabled:opacity-30 disabled:hover:opacity-30 active:scale-95 flex items-center justify-center cursor-pointer"
            >
              <SendIcon sx={{ fontSize: 14 }} />
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
