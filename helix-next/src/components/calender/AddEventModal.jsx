"use client";

import { useState, useEffect } from "react";
import { useDialog } from "@/components/providers/DialogProvider";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function AddEventModal({ isOpen, onClose, defaultDate, onEventAdded, eventToEdit }) {
  const { showConfirm } = useDialog();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [type, setType] = useState("task");
  const [priority, setPriority] = useState("medium");
  const [repeat, setRepeat] = useState("none");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Deletion modal states
  const [showDeleteScopeSelector, setShowDeleteScopeSelector] = useState(false);

  const formatDateString = (dateInput) => {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "";
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Sync state with edit mode or defaults
  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title || "");
      setDescription(eventToEdit.description || "");
      setDate(formatDateString(eventToEdit.date));
      setStartTime(eventToEdit.startTime || "09:00");
      setEndTime(eventToEdit.endTime || "10:00");
      setType(eventToEdit.type || "task");
      setPriority(eventToEdit.priority || "medium");
      setRepeat("none");
    } else {
      setTitle("");
      setDescription("");
      setDate(defaultDate || "");
      setStartTime("09:00");
      setEndTime("10:00");
      setType("task");
      setPriority("medium");
      setRepeat("none");
    }
    setError("");
    setShowDeleteScopeSelector(false);
  }, [eventToEdit, defaultDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Event title is required");
      return;
    }
    if (!date) {
      setError("Event date is required");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const url = "/api/events";
      const method = eventToEdit ? "PATCH" : "POST";
      const body = {
        title: title.trim(),
        description: description.trim(),
        date,
        startTime,
        endTime,
        type,
        priority,
      };

      if (eventToEdit) {
        body.id = eventToEdit.id;
      } else {
        body.repeat = repeat;
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Failed to ${eventToEdit ? "update" : "create"} event`);
      }

      if (onEventAdded) {
        onEventAdded();
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const triggerDelete = async (mode) => {
    setLoading(true);
    setError("");
    setShowDeleteScopeSelector(false);

    try {
      const res = await fetch(`/api/events?id=${eventToEdit.id}&mode=${mode}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete event");
      }

      if (onEventAdded) {
        onEventAdded();
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async () => {
    if (!eventToEdit) return;
    if (eventToEdit.repeatGroupId) {
      setShowDeleteScopeSelector(true);
    } else {
      const confirmed = await showConfirm(
        "Are you sure you want to delete this event?",
        "Delete Event",
        "danger",
        "Delete"
      );
      if (confirmed) {
        triggerDelete("single");
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs">
        <div className="absolute inset-0" onClick={onClose} />
        <div className="relative w-[90%] max-w-lg rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {eventToEdit ? "Edit Event" : "Add Event"}
            </h2>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
            >
              <CloseRoundedIcon fontSize="small" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1 helix-scroll">
            {error && (
              <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                {error}
              </p>
            )}

            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sync with stakeholders"
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
                placeholder="e.g. Prepare presentation slides before the sync"
                rows={3}
                className="w-full rounded-2xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Date */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)] [color-scheme:dark]"
                />
              </div>

              {/* Type */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)]"
                >
                  <option value="task">Task</option>
                  <option value="deadline">Deadline</option>
                  <option value="meeting">Meeting</option>
                  <option value="focus">Focus</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Start Time */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)] [color-scheme:dark]"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)] [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Repeat (Only for creation) */}
            {!eventToEdit && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
                  Repeat Action
                </label>
                <select
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value)}
                  className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)]"
                >
                  <option value="none">Does not repeat</option>
                  <option value="daily">Daily (Forever)</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            )}

            {/* Button Actions */}
            <div className="flex gap-3 border-t border-[var(--border-color)] pt-4 flex-col sm:flex-row">
              {eventToEdit && (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  disabled={loading}
                  className="rounded-2xl border border-red-500/30 bg-red-500/10 text-red-500 py-3 px-4 text-sm font-semibold transition hover:bg-red-500/20 active:scale-95 disabled:opacity-50 cursor-pointer sm:mr-auto"
                >
                  Delete Event
                </button>
              )}
              <div className="flex gap-2 flex-1 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl border border-[var(--border-color)] py-3 px-6 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-2xl bg-[var(--accent)] py-3 px-6 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (eventToEdit ? "Saving..." : "Adding...") : (eventToEdit ? "Save Changes" : "Add Event")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Recurrence deletion options overlay */}
      {showDeleteScopeSelector && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="absolute inset-0" onClick={() => setShowDeleteScopeSelector(false)} />
          <div className="relative w-[90%] max-w-md rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-center">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Delete Repeating Event</h3>
            <p className="text-xs text-[var(--text-secondary)] mb-6 leading-relaxed">
              This event is part of a recurring series. How would you like to delete it?
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => triggerDelete("single")}
                disabled={loading}
                className="w-full rounded-2xl border border-[var(--border-color)] hover:border-[var(--accent)] bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] p-3 text-sm font-semibold text-[var(--text-primary)] transition cursor-pointer active:scale-98"
              >
                Delete this event only
              </button>
              <button
                type="button"
                onClick={() => triggerDelete("following")}
                disabled={loading}
                className="w-full rounded-2xl border border-[var(--border-color)] hover:border-[var(--accent)] bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] p-3 text-sm font-semibold text-[var(--text-primary)] transition cursor-pointer active:scale-98"
              >
                Delete this and following events
              </button>
              <button
                type="button"
                onClick={() => triggerDelete("all")}
                disabled={loading}
                className="w-full rounded-2xl bg-red-500 hover:bg-red-600 p-3 text-sm font-semibold text-white transition cursor-pointer active:scale-98"
              >
                Delete all events in series
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteScopeSelector(false)}
                className="w-full rounded-2xl border border-[var(--border-color)] p-3 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)] cursor-pointer active:scale-98"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
