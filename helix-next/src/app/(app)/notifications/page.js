"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import NotificationCard from "@/components/notifications/NotificationCard";
import { dismissNotification, clearAllNotifications } from "@/ScriptFunc/notifications";

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all", "task", "project", "event", "system"

  // User Settings for Toggles (loaded from localStorage)
  const [preferences, setPreferences] = useState({
    task: true,
    project: true,
    event: true,
    system: true,
  });

  // User dismissed notification IDs
  const [dismissedIds, setDismissedIds] = useState([]);

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Load preferences and dismissed IDs
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const notifyTask = localStorage.getItem("notify-task") !== "false";
    const notifyProject = localStorage.getItem("notify-project") !== "false";
    const notifyEvent = localStorage.getItem("notify-event") !== "false";
    const notifySystem = localStorage.getItem("notify-system") !== "false";

    setPreferences({
      task: notifyTask,
      project: notifyProject,
      event: notifyEvent,
      system: notifySystem,
    });

    const storedDismissed = localStorage.getItem("dismissed-notifications");
    if (storedDismissed) {
      try {
        setDismissedIds(JSON.parse(storedDismissed));
      } catch (e) {
        setDismissedIds([]);
      }
    }
  }, []);

  // Fetch notifications
  useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchNotifications() {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setNotifications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [status]);

  // Handle individual notification dismiss
  const handleDismiss = (id) => {
    dismissNotification(id, dismissedIds, setDismissedIds);
  };

  // Handle Clear All
  const handleClearAll = () => {
    clearAllNotifications(filteredNotifications, dismissedIds, setDismissedIds);
  };

  // 1. Filter out dismissed notifications
  // 2. Filter out notifications where preferences are disabled
  // 3. Filter by selected category chip (All, Tasks, etc.)
  const filteredNotifications = notifications.filter((item) => {
    if (dismissedIds.includes(item.id)) return false;

    // Check user settings on/off toggles
    if (item.type === "task" && !preferences.task) return false;
    if (item.type === "project" && !preferences.project) return false;
    if (item.type === "event" && !preferences.event) return false;
    if (item.type === "system" && !preferences.system) return false;

    // Check header category filter
    if (filterType !== "all" && item.type !== filterType) return false;

    return true;
  });

  if (loading || status === "loading") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-(--bg-main)">
        <CircularProgress size={40} className="text-(--accent)" />
      </div>
    );
  }

  const chips = [
    { id: "all", label: "All Alert Types", icon: <NotificationsRoundedIcon sx={{ fontSize: 14 }} /> },
    { id: "task", label: "Tasks", icon: <CheckBoxRoundedIcon sx={{ fontSize: 14 }} /> },
    { id: "project", label: "Projects", icon: <FolderRoundedIcon sx={{ fontSize: 14 }} /> },
    { id: "event", label: "Events", icon: <TodayRoundedIcon sx={{ fontSize: 14 }} /> },
    { id: "system", label: "System", icon: <InfoRoundedIcon sx={{ fontSize: 14 }} /> },
  ];

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-(--bg-main) p-4">
      {/* Top Header Row */}
      <div className="mb-4 flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowBackRoundedIcon />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              Notifications
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">Stay updated on objectives, logs, event reminders, and task timelines</p>
          </div>
        </div>

        {filteredNotifications.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 active:scale-95 transition cursor-pointer"
          >
            <DeleteSweepRoundedIcon sx={{ fontSize: 16 }} />
            Clear All
          </button>
        )}
      </div>

      {/* Chips Filter Row */}
      <div className="mb-4 flex flex-wrap gap-2 overflow-x-auto pb-1 helix-scroll">
        {chips.map((chip) => {
          const isActive = filterType === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setFilterType(chip.id)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition cursor-pointer select-none ${
                isActive
                  ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-sm"
                  : "border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
              }`}
            >
              {chip.icon}
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Notifications List area */}
      <div className="flex-1 overflow-y-auto helix-scroll pr-1">
        {error && (
          <p className="text-sm text-red-500 bg-red-500/10 p-4 rounded-2xl border border-red-500/20">
            {error}
          </p>
        )}

        {filteredNotifications.length > 0 ? (
          <div className="space-y-3 pb-8">
            {filteredNotifications.map((notif) => (
              <NotificationCard
                key={notif.id}
                notification={notif}
                onDismiss={handleDismiss}
              />
            ))}
          </div>
        ) : (
          /* Visual Premium Empty State */
          <div className="flex flex-col items-center justify-center rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-12 text-center shadow-sm">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--bg-hover)] text-[var(--text-secondary)]">
              <NotificationsRoundedIcon sx={{ fontSize: 32 }} />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
              All Caught Up!
            </h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm">
              There are no new notifications matching your current filters. Try adjust filter categories or checking your notification preferences in settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
