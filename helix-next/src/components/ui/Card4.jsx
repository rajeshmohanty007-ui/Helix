import { useState } from "react";
import {
  CalendarMonthRounded,
  CheckCircleRounded,
  PlayCircleRounded,
  ScheduleRounded,
  ErrorRounded,
} from "@mui/icons-material";

const statusConfig = {
  completed: {
    icon: CheckCircleRounded,
    color: "#22c55e",
    text: "Completed",
  },

  progress: {
    icon: PlayCircleRounded,
    color: "#3b82f6",
    text: "In Progress",
  },

  pending: {
    icon: ScheduleRounded,
    color: "#f59e0b",
    text: "Pending",
  },

  blocked: {
    icon: ErrorRounded,
    color: "#ef4444",
    text: "Blocked",
  },
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const Card4 = ({
  id,
  projectId,
  title,
  deadline,
  status = "pending",
  members = [],
  isAdmin = false,
  projectMembers = [],
  onObjectiveUpdated,
}) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState(false);
  const [editingMembers, setEditingMembers] = useState(false);
  const [newDeadline, setNewDeadline] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Long press timer reference
  let pressTimer = null;

  const handleTouchStart = () => {
    if (!isAdmin) return;
    pressTimer = setTimeout(() => {
      setShowOverlay(true);
    }, 600);
  };

  const handleTouchEnd = () => {
    clearTimeout(pressTimer);
  };

  const handleMarkCompleted = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/objectives/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status.");
      
      if (onObjectiveUpdated) onObjectiveUpdated(data.objective);
      setShowOverlay(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDeadline = async () => {
    if (!newDeadline) return;
    setLoading(true);
    try {
      const formattedDeadline = formatDate(newDeadline);
      const res = await fetch(`/api/projects/${projectId}/objectives/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deadline: formattedDeadline }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update deadline.");
      
      if (onObjectiveUpdated) onObjectiveUpdated(data.objective);
      setEditingDeadline(false);
      setShowOverlay(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/objectives/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberIds: selectedMembers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update members.");
      
      if (onObjectiveUpdated) onObjectiveUpdated(data.objective);
      setEditingMembers(false);
      setShowOverlay(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMemberSelect = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((uid) => uid !== userId)
        : [...prev, userId]
    );
  };

  const currentStatus =
    statusConfig[status] || statusConfig.pending;

  const StatusIcon = currentStatus.icon;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="
        w-full
        rounded-xl
        border
        border-(--border-color)
        bg-(--bg-card)
        p-4
        transition-all
        duration-200
        hover:bg-(--bg-hover)
        relative
        group
        overflow-hidden
      "
    >
      {/* Admin Options Overlay Menu */}
      {isAdmin && (
        <div className={`
          absolute inset-0 z-20 rounded-xl bg-[var(--bg-card)]/95 backdrop-blur-xs p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200
          ${showOverlay ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"}
        `}>
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <span className="animate-spin text-[var(--accent)] text-lg">⌛</span>
              <span className="text-xs text-[var(--text-secondary)] font-medium">Updating...</span>
            </div>
          ) : editingDeadline ? (
            <div className="w-full space-y-2" onClick={(e) => e.stopPropagation()}>
              <label className="text-xs font-bold text-[var(--text-primary)]">Change Deadline</label>
              <input
                type="date"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-color)] bg-transparent px-2 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent)] scheme-dark"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveDeadline}
                  className="flex-1 rounded-lg bg-[var(--accent)] py-1.5 text-xs font-semibold text-white hover:opacity-90 active:scale-95 cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingDeadline(false);
                    setShowOverlay(false);
                  }}
                  className="flex-1 rounded-lg border border-[var(--border-color)] py-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : editingMembers ? (
            <div className="w-full flex flex-col space-y-2 h-full justify-between" onClick={(e) => e.stopPropagation()}>
              <label className="text-xs font-bold text-[var(--text-primary)]">Manage Members</label>
              <div className="flex-1 overflow-y-auto max-h-24 space-y-1.5 border border-[var(--border-color)] p-1.5 rounded-lg pr-1 helix-scroll">
                {projectMembers.length === 0 ? (
                  <p className="text-[10px] text-[var(--text-secondary)] italic">No users in project.</p>
                ) : (
                  projectMembers.map((m) => {
                    const isChecked = selectedMembers.includes(m.id);
                    return (
                      <label key={m.id} className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-primary)]">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleMemberSelect(m.id)}
                          className="accent-[var(--accent)]"
                        />
                        <span className="truncate">{m.username}</span>
                      </label>
                    );
                  })
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveMembers}
                  className="flex-1 rounded-lg bg-[var(--accent)] py-1.5 text-xs font-semibold text-white hover:opacity-90 active:scale-95 cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingMembers(false);
                    setShowOverlay(false);
                  }}
                  className="flex-1 rounded-lg border border-[var(--border-color)] py-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {status !== "completed" && (
                <button
                  type="button"
                  onClick={handleMarkCompleted}
                  className="w-full rounded-xl bg-emerald-600 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition active:scale-98 cursor-pointer"
                >
                  ✓ Mark as Completed
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setNewDeadline("");
                  setEditingDeadline(true);
                }}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] py-2 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition active:scale-98 cursor-pointer"
              >
                📅 Change Deadline
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedMembers(members.map((m) => m.id));
                  setEditingMembers(true);
                }}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] py-2 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition active:scale-98 cursor-pointer"
              >
                👥 Change Assigned Members
              </button>
              {showOverlay && (
                <button
                  type="button"
                  onClick={() => setShowOverlay(false)}
                  className="w-full rounded-xl bg-white/10 py-1.5 text-[10px] font-bold text-[var(--text-secondary)] hover:bg-white/15 transition cursor-pointer"
                >
                  Dismiss Menu
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Title */}
      <h2
        className="
          text-base
          font-semibold
          text-(--text-primary)
        "
      >
        {title}
      </h2>

      {/* Deadline */}
      <div className="mt-3 flex items-center gap-2">
        <CalendarMonthRounded
          sx={{
            fontSize: 18,
            color: "var(--text-secondary)",
          }}
        />

        <span
          className="
            text-sm
            text-(--text-secondary)
          "
        >
          {deadline}
        </span>
      </div>

      {/* Status */}
      <div
        className="
          mt-3
          inline-flex
          items-center
          gap-1
          rounded-full
          px-3
          py-1
          text-sm
          font-medium
        "
        style={{
          color: currentStatus.color,
          backgroundColor: `${currentStatus.color}20`,
        }}
      >
        <StatusIcon sx={{ fontSize: 16 }} />
        {currentStatus.text}
      </div>

      {/* Team Members */}
      <div className="mt-4">
        <p
          className="
            mb-2
            text-xs
            font-medium
            uppercase
            tracking-wide
            text-(--text-secondary)
          "
        >
          Working On It
        </p>

        <div className="flex items-center">
          {members.map((member, index) => (
            <img
              key={index}
              src={member.avatar}
              alt={member.name}
              title={member.name}
              className="
                h-8
                w-8
                rounded-full
                border-2
                border-(--bg-card)
                object-cover
                -ml-2
                first:ml-0
              "
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card4;