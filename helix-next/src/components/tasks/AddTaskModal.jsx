"use client";

import { useState, useEffect } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CircularProgress from "@mui/material/CircularProgress";

export default function AddTaskModal({ isOpen, onClose, taskList, onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [aiTags, setAiTags] = useState([]);
  const [aiSubtasks, setAiSubtasks] = useState([]);
  const [error, setError] = useState("");

  // Sync client-side 2-minute cooldown on open
  useEffect(() => {
    if (isOpen) {
      const lastRequest = localStorage.getItem("helix_task_ai_cooldown");
      if (lastRequest) {
        const elapsed = Date.now() - parseInt(lastRequest, 10);
        const remaining = Math.ceil((2 * 60 * 1000 - elapsed) / 1000);
        if (remaining > 0) {
          setCooldownTime(remaining);
        }
      }
    }
  }, [isOpen]);

  // Run cooldown countdown timer
  useEffect(() => {
    if (cooldownTime <= 0) return;
    const timer = setInterval(() => {
      setCooldownTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownTime]);

  if (!isOpen) return null;

  const handleCreateWithAI = async () => {
    if (!title.trim()) return;
    setError("");
    setAiLoading(true);

    try {
      const res = await fetch("/api/tasks/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate AI metadata");
      }

      const { metadata } = data;
      if (metadata) {
        if (metadata.description) setDescription(metadata.description);
        if (metadata.priority) setPriority(metadata.priority);
        if (metadata.duration) setDuration(metadata.duration);
        if (metadata.tags) setAiTags(metadata.tags);
        if (metadata.subtasks) setAiSubtasks(metadata.subtasks);
      }

      // Save cooldown to localStorage
      localStorage.setItem("helix_task_ai_cooldown", Date.now().toString());
      setCooldownTime(120);
    } catch (err) {
      setError(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Task title is required");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          priority,
          deadline: deadline || "No deadline",
          duration: duration.trim() || "0 hrs",
          taskList,
          tags: aiTags,
          subtasks: aiSubtasks,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create task");
      }

      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDeadline("");
      setDuration("");
      setAiTags([]);
      setAiSubtasks([]);
      if (onTaskAdded) {
        onTaskAdded(data.task);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-[90%] max-w-lg rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">New Task ({taskList})</h2>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
          >
            <CloseRoundedIcon fontSize="small" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1 helix-scroll">
          {error && <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</p>}
          
          {/* Title - MANDATORY */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-[var(--text-primary)]">
                Task Title <span className="text-red-500">*</span>
              </label>
              
              <button
                type="button"
                onClick={handleCreateWithAI}
                disabled={aiLoading || cooldownTime > 0 || !title.trim()}
                className="rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 hover:bg-[var(--accent)]/25 px-3 py-1.5 text-xs font-semibold text-[var(--accent)] transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
              >
                {aiLoading ? (
                  <>
                    <CircularProgress size={12} color="inherit" />
                    <span>AI Analyzing...</span>
                  </>
                ) : cooldownTime > 0 ? (
                  <span>AI Cooldown ({cooldownTime}s)</span>
                ) : (
                  <span>✨ Create with AI</span>
                )}
              </button>
            </div>
            
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build API integration"
              required
              disabled={aiLoading}
              className="w-full rounded-2xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)] disabled:opacity-50"
            />
          </div>

          {/* Description - OPTIONAL */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
              Description <span className="text-xs font-normal text-[var(--text-secondary)]">(Optional)</span>
            </label>
            <textarea
              value={aiLoading ? "AI is generating description..." : description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task details..."
              rows={3}
              disabled={aiLoading}
              className={`w-full rounded-2xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)] resize-none ${
                aiLoading ? "animate-pulse opacity-50 select-none" : ""
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority - OPTIONAL */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
                Priority <span className="text-xs font-normal text-[var(--text-secondary)]">(Optional)</span>
              </label>
              <select
                value={aiLoading ? "" : priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={aiLoading}
                className={`w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)] cursor-pointer ${
                  aiLoading ? "animate-pulse opacity-50 select-none" : ""
                }`}
              >
                {aiLoading ? (
                  <option value="">Analyzing priority...</option>
                ) : (
                  <>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </>
                )}
              </select>
            </div>

            {/* Duration - OPTIONAL */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
                Estimated Duration <span className="text-xs font-normal text-[var(--text-secondary)]">(Optional)</span>
              </label>
              <input
                type="text"
                value={aiLoading ? "Estimating duration..." : duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 2 hrs"
                disabled={aiLoading}
                className={`w-full rounded-2xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)] ${
                  aiLoading ? "animate-pulse opacity-50 select-none" : ""
                }`}
              />
            </div>
          </div>

          {/* Deadline - OPTIONAL */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
              Deadline <span className="text-xs font-normal text-[var(--text-secondary)]">(Optional)</span>
            </label>
            <input
              type={aiLoading ? "text" : "datetime-local"}
              value={aiLoading ? "Calculating deadline..." : deadline}
              onChange={(e) => setDeadline(e.target.value)}
              disabled={aiLoading}
              className={`w-full rounded-2xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)] [color-scheme:dark] ${
                aiLoading ? "animate-pulse opacity-50 select-none" : ""
              }`}
            />
          </div>

          <div className="flex gap-3 border-t border-[var(--border-color)] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading || aiLoading}
              className="flex-1 rounded-2xl border border-[var(--border-color)] py-3 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)] disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || aiLoading}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <CircularProgress size={18} color="inherit" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Task</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
