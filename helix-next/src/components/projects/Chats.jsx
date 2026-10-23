"use client";

import { useState, useEffect } from "react";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import TagIcon from "@mui/icons-material/Tag";
import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";

const Chats = ({ activeProj }) => {
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  
  const [channelsLoading, setChannelsLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // 1. Fetch channels when activeProj changes
  useEffect(() => {
    if (!activeProj?.id) {
      setChannels([]);
      setActiveChannel(null);
      setMessages([]);
      return;
    }

    setChannelsLoading(true);
    setChannels([]);
    setActiveChannel(null);
    setMessages([]);

    fetch(`/api/projects/${activeProj.id}/channels`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setChannels(data);
          if (data.length > 0) {
            setActiveChannel(data[0]);
          }
        }
      })
      .catch((err) => console.error("Error loading chat channels:", err))
      .finally(() => setChannelsLoading(false));
  }, [activeProj?.id]);

  // 2. Fetch messages when activeChannel changes
  useEffect(() => {
    if (!activeChannel?.id) {
      setMessages([]);
      return;
    }

    setMessagesLoading(true);
    fetch(`/api/channels/${activeChannel.id}/messages`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMessages(data);
        }
      })
      .catch((err) => console.error("Error loading channel messages:", err))
      .finally(() => setMessagesLoading(false));
  }, [activeChannel?.id]);

  if (!activeProj) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-(--bg-card) p-6 rounded-2xl border border-(--border-color)">
        <p className="text-sm text-[var(--text-secondary)] italic">Select a project to preview chat room</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full overflow-hidden border border-(--border-color) rounded-2xl bg-[var(--bg-card)]">
      {/* Sidebar - Channels only */}
      <aside className="flex w-14 flex-col items-center min-h-0 border-r border-(--border-color) overflow-y-auto helix-scroll py-2 bg-[var(--bg-sidebar)]">
        {channelsLoading ? (
          <CircularProgress size={20} className="text-(--accent) mt-4" />
        ) : (
          <div className="flex flex-col gap-2">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel)}
                title={`# ${channel.name}`}
                className={`group relative flex h-10 w-10 items-center justify-center rounded-xl transition cursor-pointer ${
                  activeChannel?.id === channel.id
                    ? "bg-[var(--accent)] text-white shadow-sm"
                    : "bg-(--bg-card) hover:bg-[var(--accent)]/15 text-(--text-primary) hover:text-[var(--accent)]"
                }`}
              >
                <TagIcon fontSize="small" />
              </button>
            ))}
          </div>
        )}
      </aside>

      {/* Chat Messages */}
      <section className="flex min-w-0 flex-1 flex-col bg-[var(--bg-card)]">
        <header className="flex items-center justify-between border-b border-(--border-color) px-3 py-2">
          <h2 className="truncate text-sm font-semibold text-[var(--text-primary)]">
            # {activeChannel?.name || "Loading..."}
          </h2>

          <Link
            href={`/projects/${activeProj.id}/chat`}
            target="_blank"
            className="rounded-md p-1 transition hover:bg-(--bg-hover) text-[var(--text-primary)] flex items-center justify-center cursor-pointer"
            title="Open Full Workspace Chat"
          >
            <OpenInFullIcon fontSize="small" />
          </Link>
        </header>

        {/* Message Feed */}
        <div className="flex-1 space-y-3 overflow-y-auto p-3 helix-scroll">
          {messagesLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <CircularProgress size={24} className="text-(--accent)" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-xs text-[var(--text-secondary)] italic">No messages in this channel yet.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[var(--text-primary)]">
                    {msg.sender?.username || "System"}
                  </span>

                  <span className="text-[10px] text-[var(--text-secondary)]">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <p className="text-[13px] text-[var(--text-secondary)] break-words">
                  {msg.text}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Expand Chat Room Button */}
        <div className="border-t border-(--border-color) p-2">
          <Link
            href={`/projects/${activeProj.id}/chat`}
            target="_blank"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] py-2 text-xs font-semibold text-white transition hover:opacity-90 active:scale-98 cursor-pointer shadow-sm"
          >
            <OpenInFullIcon sx={{ fontSize: 14 }} />
            Expand Chat Room
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Chats;