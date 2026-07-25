"use client";

import { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CircularProgress from "@mui/material/CircularProgress";
import { CheckCircleRounded, PlayCircleRounded, ErrorRounded, EditRounded } from "@mui/icons-material";

const actionConfig = {
  completed: { icon: CheckCircleRounded, color: "#22c55e", label: "Completed" },
  started: { icon: PlayCircleRounded, color: "#3b82f6", label: "Started" },
  blocked: { icon: ErrorRounded, color: "#ef4444", label: "Blocked" },
  updated: { icon: EditRounded, color: "var(--accent)", label: "Updated" },
};

export default function AddUpdateModal({ isOpen, onClose, projectId, onUpdateAdded }) {
  const [action, setAction] = useState("updated");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) {
      setError("Please describe the update.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/projects/${projectId}/updates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, content }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add update.");
      }

      setContent("");
      setAction("updated");
      if (onUpdateAdded) onUpdateAdded(data.update);
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
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Add Project Update</h2>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
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

          {/* Action Select */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
              Update Status
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Object.keys(actionConfig).map((key) => {
                const conf = actionConfig[key];
                const Icon = conf.icon;
                const isSelected = action === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setAction(key)}
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

          {/* Content TextArea */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
              Description
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What did you achieve, start, or what is blocking your progress?"
              rows={4}
              required
              className="w-full rounded-2xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)] resize-none"
            />
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
                "Save Update"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
