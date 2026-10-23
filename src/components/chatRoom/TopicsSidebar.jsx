import { useState } from "react";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlined";
import FlagIcon from "@mui/icons-material/Flag";
import BugReportIcon from "@mui/icons-material/BugReport";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import CampaignIcon from "@mui/icons-material/Campaign";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

// Mapping icons to topic types
export const getTopicIcon = (type, sx = {}) => {
  switch (type) {
    case "objective":
      return <FlagIcon sx={{ color: "#3b82f6", ...sx }} />; // Blue flag
    case "bug":
      return <BugReportIcon sx={{ color: "#ef4444", ...sx }} />; // Red bug
    case "sprint":
      return <CalendarMonthIcon sx={{ color: "#10b981", ...sx }} />; // Green calendar
    case "ideas":
      return <LightbulbIcon sx={{ color: "#eab308", ...sx }} />; // Yellow lightbulb
    case "announcements":
      return <CampaignIcon sx={{ color: "#a855f7", ...sx }} />; // Purple megaphone
    case "general":
    default:
      return <ChatBubbleOutlineIcon sx={{ color: "#64748b", ...sx }} />; // Slate chat bubble
  }
};

// Mapping status to colors
export const getStatusDotColor = (status) => {
  switch (status) {
    case "active":
      return "bg-green-500 shadow-[0_0_8px_#22c55e]";
    case "waiting":
      return "bg-yellow-500 shadow-[0_0_8px_#eab308]";
    case "blocked":
      return "bg-red-500 shadow-[0_0_8px_#ef4444]";
    case "completed":
    default:
      return "bg-slate-400";
  }
};

export default function TopicsSidebar({
  projectName,
  topics = [],
  activeTopic,
  setActiveTopic,
  onCreateTopic,
  isOpen,
  onClose,
}) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New topic state
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("general");
  const [newStatus, setNewStatus] = useState("active");

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateTopic({
      title: newTitle.trim(),
      type: newType,
      status: newStatus,
    });
    setNewTitle("");
    setNewType("general");
    setNewStatus("active");
    setIsModalOpen(false);
  };

  // Filter topics
  const filteredTopics = topics.filter((topic) => {
    const title = topic.name || topic.title || "";
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || topic.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden mt-16"
          onClick={onClose}
        />
      )}
      <aside
        className={`flex flex-col w-72 border-r border-(--border-color) bg-(--bg-sidebar) h-[calc(100vh-64px)] select-none shrink-0 z-40 fixed top-16 left-0 transition-transform duration-300 ease-in-out md:relative md:top-0 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
      {/* Project Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-(--border-color)">
        <h2 className="text-sm font-bold text-(--text-primary) truncate">
          {projectName || "Loading Project..."}
        </h2>
      </div>

      {/* Search Container */}
      <div className="p-3 border-b border-(--border-color)">
        <div className="flex items-center gap-2 rounded-xl bg-(--bg-main) border border-(--border-color) px-3 py-2 text-(--text-secondary) focus-within:border-(--accent) transition duration-150">
          <SearchIcon sx={{ fontSize: 18 }} />
          <input
            type="text"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-(--text-primary) outline-none"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex px-2 py-1.5 gap-1 overflow-x-auto border-b border-(--border-color) helix-scroll text-[10px] font-bold">
        {["all", "active", "waiting", "blocked", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-2 py-1 rounded-md capitalize transition duration-150 shrink-0 ${
              filterStatus === status
                ? "bg-(--accent)/15 text-(--accent)"
                : "text-(--text-secondary) hover:bg-(--bg-hover) hover:text-(--text-primary)"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Topics List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 helix-scroll">
        {filteredTopics.length === 0 ? (
          <p className="text-center text-xs text-(--text-secondary) py-8">
            No topics found.
          </p>
        ) : (
          filteredTopics.map((topic) => {
            const isActive = activeTopic?.id === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => setActiveTopic(topic)}
                className={`relative flex w-full gap-3 p-3 text-left rounded-xl transition duration-150 border border-transparent ${
                  isActive
                    ? "bg-(--accent)/10 border-(--accent)/20 text-(--text-primary)"
                    : "hover:bg-(--bg-hover) text-(--text-secondary) hover:text-(--text-primary)"
                }`}
              >
                {/* Topic Type Icon */}
                <div className="flex items-center justify-center h-10 w-10 shrink-0 bg-(--bg-main) rounded-xl border border-(--border-color)">
                  {getTopicIcon(topic.type, { fontSize: 20 })}
                </div>

                {/* Topic Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-semibold text-xs text-(--text-primary) truncate">
                      {topic.name || topic.title}
                    </span>
                    {/* Status Dot */}
                    <span
                      className={`h-2.5 w-2.5 rounded-full shrink-0 mt-1 ${getStatusDotColor(
                        topic.status
                      )}`}
                      title={`Status: ${topic.status}`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] opacity-75 font-medium">
                    <span>{topic.messageCount || 0} messages</span>
                    <span className="truncate max-w-[80px]">
                      {topic.lastActive || "Just now"}
                    </span>
                  </div>
                </div>

                {/* Unread count badge */}
                {topic.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm animate-pulse">
                    {topic.unreadCount}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* New Topic Action Button */}
      <div className="p-3 border-t border-(--border-color) bg-(--bg-sidebar)">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--accent) py-2.5 text-xs font-semibold text-white transition hover:opacity-95 active:scale-98 cursor-pointer"
        >
          <AddIcon sx={{ fontSize: 16 }} />
          <span>New Topic</span>
        </button>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
          <form
            onSubmit={handleCreateSubmit}
            className="relative w-[90%] max-w-sm rounded-3xl border border-(--border-color) bg-(--bg-card) p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-(--border-color) pb-3 mb-4">
              <h3 className="text-sm font-bold text-(--text-primary)">Create New Topic</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-(--text-secondary) hover:text-(--text-primary) p-1 rounded-lg hover:bg-(--bg-hover) transition"
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </button>
            </div>

            {/* Title Input */}
            <div className="space-y-1.5 mb-4">
              <label className="text-xs font-bold text-(--text-secondary)">Topic Title</label>
              <input
                type="text"
                placeholder="e.g. Authentication Middleware"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full rounded-xl bg-(--bg-main) border border-(--border-color) focus:border-(--accent) px-3 py-2 text-xs text-(--text-primary) outline-none"
              />
            </div>

            {/* Type Selector */}
            <div className="space-y-1.5 mb-4">
              <label className="text-xs font-bold text-(--text-secondary)">Topic Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full rounded-xl bg-(--bg-main) border border-(--border-color) focus:border-(--accent) px-3 py-2 text-xs text-(--text-primary) outline-none"
              >
                <option value="general">General Discussion</option>
                <option value="objective">Objective Discussion</option>
                <option value="bug">Bug Discussion</option>
                <option value="sprint">Sprint Planning</option>
                <option value="ideas">Ideas</option>
                <option value="announcements">Announcements</option>
              </select>
            </div>

            {/* Status Selector */}
            <div className="space-y-1.5 mb-6">
              <label className="text-xs font-bold text-(--text-secondary)">Workflow Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full rounded-xl bg-(--bg-main) border border-(--border-color) focus:border-(--accent) px-3 py-2 text-xs text-(--text-primary) outline-none"
              >
                <option value="active">Active (Discussing)</option>
                <option value="waiting">Waiting (Review/Response)</option>
                <option value="blocked">Blocked (Dependencies)</option>
                <option value="completed">Completed (Finished)</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end pt-2 border-t border-(--border-color)">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-(--text-secondary) rounded-xl hover:bg-(--bg-hover) transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-(--accent) rounded-xl hover:opacity-90 transition active:scale-98 cursor-pointer"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
      </aside>
    </>
  );
}
