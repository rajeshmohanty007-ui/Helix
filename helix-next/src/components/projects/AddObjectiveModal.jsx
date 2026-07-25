"use client";

import { useState, useEffect } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CircularProgress from "@mui/material/CircularProgress";
import { ScheduleRounded, PlayCircleRounded, CheckCircleRounded, ErrorRounded } from "@mui/icons-material";

const statusConfig = {
  pending: { icon: ScheduleRounded, color: "#f59e0b", label: "Pending" },
  progress: { icon: PlayCircleRounded, color: "#3b82f6", label: "In Progress" },
  completed: { icon: CheckCircleRounded, color: "#22c55e", label: "Completed" },
  blocked: { icon: ErrorRounded, color: "#ef4444", label: "Blocked" },
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

export default function AddObjectiveModal({ isOpen, onClose, projectId, onObjectiveAdded }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("pending");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      // Fetch users list
      setUsersLoading(true);
      fetch("/api/users")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setAvailableUsers(data);
          }
        })
        .catch((err) => console.error("Error loading users:", err))
        .finally(() => setUsersLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function toggleUserSelection(userId) {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter objective title.");
      return;
    }
    if (!deadline) {
      setError("Please set a deadline.");
      return;
    }

    setLoading(true);
    setError("");

    const formattedDeadline = formatDate(deadline);

    try {
      const res = await fetch(`/api/projects/${projectId}/objectives`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          deadline: formattedDeadline,
          status,
          memberIds: selectedUserIds,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add objective.");
      }

      setTitle("");
      setDeadline("");
      setStatus("pending");
      setSelectedUserIds([]);
      if (onObjectiveAdded) onObjectiveAdded(data.objective);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs">
      {/* Overlay Close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-[90%] max-w-lg rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Add Project Objective</h2>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
          >
            <CloseRoundedIcon fontSize="small" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1 helix-scroll">
          {error && (
            <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
              {error}
            </p>
          )}

          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
              Objective Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Launch Beta version"
              required
              className="w-full rounded-2xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)]"
            />
          </div>

          {/* Deadline Date Picker */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
              Deadline Date
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              className="w-full rounded-2xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)] scheme-dark"
            />
          </div>

          {/* Status Select */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
              Initial Status
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Object.keys(statusConfig).map((key) => {
                const conf = statusConfig[key];
                const Icon = conf.icon;
                const isSelected = status === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setStatus(key)}
                    style={{
                      borderColor: isSelected ? conf.color : "transparent",
                      color: isSelected ? conf.color : "var(--text-secondary)",
                      backgroundColor: isSelected ? `${conf.color}15` : "var(--bg-main)",
                    }}
                    className="flex flex-col items-center gap-2 rounded-2xl border px-3 py-3 text-center transition hover:bg-opacity-80 active:scale-95"
                  >
                    <Icon fontSize="medium" />
                    <span className="text-xs font-semibold">{conf.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assignees (Members) */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
              Assign Team Members
            </label>
            {usersLoading ? (
              <div className="flex justify-center p-4">
                <CircularProgress size={20} />
              </div>
            ) : availableUsers.length === 0 ? (
              <p className="text-xs text-[var(--text-secondary)] italic">No other users found.</p>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 border border-[var(--border-color)] rounded-2xl">
                {availableUsers.map((user) => {
                  const isSelected = selectedUserIds.includes(user.id);
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => toggleUserSelection(user.id)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
                        isSelected
                          ? "bg-[var(--accent)] text-white"
                          : "bg-[var(--bg-hover)] text-[var(--text-secondary)] border border-[var(--border-color)]"
                      }`}
                    >
                      <span className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                        {user.username[0].toUpperCase()}
                      </span>
                      {user.username}
                      {isSelected && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Submit Button */}
          <div className="flex gap-3 border-t border-[var(--border-color)] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-[var(--border-color)] py-3 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <CircularProgress size={18} color="inherit" />
                  Saving...
                </>
              ) : (
                "Save Objective"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
