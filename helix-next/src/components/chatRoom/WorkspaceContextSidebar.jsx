import { useState } from "react";
import PushPinIcon from "@mui/icons-material/PushPin";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import LinkIcon from "@mui/icons-material/Link";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function WorkspaceContextSidebar({
  pinnedMessages = [],
  importantMessages = [],
  decisions = [],
  sharedLinks = [],
  onMessageClick,
  isOpen,
  onClose,
}) {
  // Collapsible section states
  const [openSection, setOpenSection] = useState({
    pinned: true,
    important: true,
    decisions: true,
    links: true,
  });

  const toggleSection = (section) => {
    setOpenSection((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const SectionHeader = ({ id, label, count, icon }) => (
    <button
      onClick={() => toggleSection(id)}
      className="flex w-full items-center justify-between px-4 py-3 bg-(--bg-sidebar) hover:bg-(--bg-hover) text-xs font-bold text-(--text-primary) border-b border-(--border-color) transition select-none cursor-pointer"
    >
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
        {count > 0 && (
          <span className="rounded-full bg-(--accent)/15 text-(--accent) text-[9px] px-2 py-0.5">
            {count}
          </span>
        )}
      </div>
      {openSection[id] ? (
        <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
      ) : (
        <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
      )}
    </button>
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden mt-16"
          onClick={onClose}
        />
      )}
      <aside
        className={`flex flex-col w-80 border-l border-(--border-color) bg-(--bg-sidebar) h-[calc(100vh-64px)] select-none shrink-0 z-40 fixed top-16 right-0 transition-transform duration-300 ease-in-out lg:relative lg:top-0 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
      {/* Title */}
      <div className="px-4 py-4 border-b border-(--border-color)">
        <h3 className="text-sm font-bold text-(--text-primary)">
          Workspace Context
        </h3>
        <p className="text-[10px] text-(--text-secondary) mt-0.5">
          Surfacing important info for this discussion
        </p>
      </div>

      {/* Sections Container */}
      <div className="flex-1 overflow-y-auto helix-scroll">
        {/* 1. Pinned Messages */}
        <div className="flex flex-col">
          <SectionHeader
            id="pinned"
            label="Pinned Messages"
            count={pinnedMessages.length}
            icon={<PushPinIcon sx={{ fontSize: 14, color: "#eab308" }} />}
          />
          {openSection.pinned && (
            <div className="p-3 bg-(--bg-main) space-y-2 border-b border-(--border-color)">
              {pinnedMessages.length === 0 ? (
                <p className="text-[10px] text-center text-(--text-secondary) py-2">
                  No pinned messages.
                </p>
              ) : (
                pinnedMessages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => onMessageClick && onMessageClick(msg.id)}
                    className="w-full text-left p-2 bg-(--bg-card) border border-(--border-color) rounded-xl hover:border-(--accent) transition duration-150 flex flex-col gap-1 cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-[8px] text-(--text-secondary) font-bold uppercase">
                      <span>{msg.sender?.username || "System"}</span>
                      <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[11px] text-(--text-primary) line-clamp-2 break-all">
                      {msg.text}
                    </p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* 2. Important Messages */}
        <div className="flex flex-col">
          <SectionHeader
            id="important"
            label="Important Messages"
            count={importantMessages.length}
            icon={<LabelImportantIcon sx={{ fontSize: 14, color: "#f43f5e" }} />}
          />
          {openSection.important && (
            <div className="p-3 bg-(--bg-main) space-y-2 border-b border-(--border-color)">
              {importantMessages.length === 0 ? (
                <p className="text-[10px] text-center text-(--text-secondary) py-2">
                  No messages marked important.
                </p>
              ) : (
                importantMessages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => onMessageClick && onMessageClick(msg.id)}
                    className="w-full text-left p-2 bg-(--bg-card) border border-(--border-color) rounded-xl hover:border-(--accent) transition duration-150 flex flex-col gap-1 cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-[8px] text-(--text-secondary) font-bold uppercase">
                      <span>{msg.sender?.username || "System"}</span>
                    </div>
                    <p className="text-[11px] text-(--text-primary) line-clamp-2 break-all">
                      {msg.text}
                    </p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* 3. Decisions */}
        <div className="flex flex-col">
          <SectionHeader
            id="decisions"
            label="Decisions"
            count={decisions.length}
            icon={<PlaylistAddCheckIcon sx={{ fontSize: 16, color: "#10b981" }} />}
          />
          {openSection.decisions && (
            <div className="p-3 bg-(--bg-main) space-y-2 border-b border-(--border-color)">
              {decisions.length === 0 ? (
                <p className="text-[10px] text-center text-(--text-secondary) py-2">
                  No decisions logged yet.
                </p>
              ) : (
                decisions.map((decision) => (
                  <div
                    key={decision.id}
                    className="p-2 bg-(--bg-card) border-l-2 border-green-500 rounded-r-xl border-y border-r border-(--border-color) flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between text-[8px] text-green-600 font-bold uppercase">
                      <span>Decision Logged</span>
                      <span>{new Date(decision.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[11px] text-(--text-primary) break-all">
                      {decision.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 4. Shared Links */}
        <div className="flex flex-col">
          <SectionHeader
            id="links"
            label="Shared Links"
            count={sharedLinks.length}
            icon={<LinkIcon sx={{ fontSize: 14, color: "#3b82f6" }} />}
          />
          {openSection.links && (
            <div className="p-3 bg-(--bg-main) space-y-2 border-b border-(--border-color)">
              {sharedLinks.length === 0 ? (
                <p className="text-[10px] text-center text-(--text-secondary) py-2">
                  No links shared yet.
                </p>
              ) : (
                sharedLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 bg-(--bg-card) border border-(--border-color) rounded-xl hover:border-(--accent) hover:text-(--accent) transition duration-150 cursor-pointer"
                  >
                    <div className="text-[9px] text-(--text-secondary) truncate">
                      {link.url}
                    </div>
                    <p className="text-[11px] font-semibold text-(--text-primary) mt-0.5 truncate hover:text-(--accent)">
                      {link.title || "External Link"}
                    </p>
                  </a>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      </aside>
    </>
  );
}
