"use client";

import { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CircularProgress from "@mui/material/CircularProgress";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";

export default function AddProjectModal({ isOpen, onClose, onProjectAdded }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [usernames, setUsernames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  function handleAddMember(e) {
    e.preventDefault();
    const cleanUsername = memberInput.trim();
    if (!cleanUsername) return;

    if (usernames.includes(cleanUsername)) {
      setError("Username already added to list.");
      return;
    }

    setUsernames([...usernames, cleanUsername]);
    setMemberInput("");
    setError("");
  }

  function handleRemoveMember(usernameToRemove) {
    setUsernames(usernames.filter((u) => u !== usernameToRemove));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          usernames,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create project.");
      }

      setName("");
      setDescription("");
      setUsernames([]);
      setMemberInput("");
      
      if (onProjectAdded) onProjectAdded(data);
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
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Create New Project</h2>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <CloseRoundedIcon fontSize="small" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
              {error}
            </p>
          )}

          {/* Project Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Helix Redesign"
              required
              className="w-full rounded-2xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
              Description <span className="text-xs font-normal text-[var(--text-secondary)]">(Optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the objective or goals of this project..."
              rows={3}
              className="w-full rounded-2xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)] resize-none"
            />
          </div>

          {/* Add Members */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
              Add Members
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                placeholder="Enter member's username"
                className="flex-1 rounded-2xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddMember(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddMember}
                className="flex items-center gap-1.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-2 hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition active:scale-95 text-sm font-medium cursor-pointer"
              >
                <PersonAddRoundedIcon fontSize="small" />
                Add
              </button>
            </div>

            {/* List of Added Members */}
            {usernames.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] p-3">
                {usernames.map((username) => (
                  <span
                    key={username}
                    className="flex items-center gap-1.5 rounded-full bg-[var(--accent)]/15 px-3 py-1 text-xs font-medium text-[var(--accent)] border border-[var(--accent)]/20"
                  >
                    @{username}
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(username)}
                      className="rounded-full p-0.5 hover:bg-[var(--accent)]/20 transition cursor-pointer"
                    >
                      <CloseRoundedIcon sx={{ fontSize: 12 }} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 border-t border-[var(--border-color)] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-[var(--border-color)] py-3 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <CircularProgress size={18} color="inherit" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
