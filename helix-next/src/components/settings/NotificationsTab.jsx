"use client";

import { useState, useEffect } from "react";
import { toggleNotificationSetting } from "@/ScriptFunc/settings";

export default function NotificationsTab() {
  const [notifyTask, setNotifyTask] = useState(true);
  const [notifyProject, setNotifyProject] = useState(true);
  const [notifyEvent, setNotifyEvent] = useState(true);
  const [notifySystem, setNotifySystem] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setNotifyTask(localStorage.getItem("notify-task") !== "false");
      setNotifyProject(localStorage.getItem("notify-project") !== "false");
      setNotifyEvent(localStorage.getItem("notify-event") !== "false");
      setNotifySystem(localStorage.getItem("notify-system") !== "false");
    }
  }, []);

  return (
    <div className="space-y-8 max-w-xl animate-in fade-in duration-200">
      <div>
        <h3 className="text-lg font-bold text-[var(--text-primary)]">Notification Preferences</h3>
        <p className="text-xs text-[var(--text-secondary)]">Turn notification streams on or off for different categories</p>
      </div>

      <div className="space-y-4">
        {/* Task Toggle */}
        <div className="flex items-center justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] p-4">
          <div className="pr-4">
            <h4 className="text-sm font-bold text-[var(--text-primary)]">Task Updates</h4>
            <p className="text-[11px] text-[var(--text-secondary)]">Receive alert updates regarding task timelines and priorities</p>
          </div>
          <button
            type="button"
            onClick={() => toggleNotificationSetting("notify-task", notifyTask, setNotifyTask)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              notifyTask ? "bg-[var(--accent)]" : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                notifyTask ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Project Toggle */}
        <div className="flex items-center justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] p-4">
          <div className="pr-4">
            <h4 className="text-sm font-bold text-[var(--text-primary)]">Project Log Activity</h4>
            <p className="text-[11px] text-[var(--text-secondary)]">Get notified about new projects, updates, and key objective additions</p>
          </div>
          <button
            type="button"
            onClick={() => toggleNotificationSetting("notify-project", notifyProject, setNotifyProject)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              notifyProject ? "bg-[var(--accent)]" : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                notifyProject ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Event Toggle */}
        <div className="flex items-center justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] p-4">
          <div className="pr-4">
            <h4 className="text-sm font-bold text-[var(--text-primary)]">Calendar Events</h4>
            <p className="text-[11px] text-[var(--text-secondary)]">Get notified when new meetings or time-blocks are scheduled</p>
          </div>
          <button
            type="button"
            onClick={() => toggleNotificationSetting("notify-event", notifyEvent, setNotifyEvent)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              notifyEvent ? "bg-[var(--accent)]" : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                notifyEvent ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* System Toggle */}
        <div className="flex items-center justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] p-4">
          <div className="pr-4">
            <h4 className="text-sm font-bold text-[var(--text-primary)]">System logs</h4>
            <p className="text-[11px] text-[var(--text-secondary)]">Receive welcome tips, summaries, and system-level alerts</p>
          </div>
          <button
            type="button"
            onClick={() => toggleNotificationSetting("notify-system", notifySystem, setNotifySystem)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              notifySystem ? "bg-[var(--accent)]" : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                notifySystem ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
