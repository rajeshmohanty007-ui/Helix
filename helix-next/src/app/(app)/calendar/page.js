"use client";

import { useState, useEffect, useCallback } from "react";
import { signIn } from "next-auth/react";
import MobMonth from "@/components/calender/MobMonth";
import MonthCalendar from "@/components/calender/Month";
import AgendaCard from "@/components/calender/AgendaCard";
import DayView from "@/components/calender/DayView";
import AddEventModal from "@/components/calender/AddEventModal";
import AiSchedulerModal from "@/components/calender/AiSchedulerModal";
import { getTodayString, formatDateString } from "@/ScriptFunc/calendar";
import { useToast } from "@/components/providers/ToastProvider";
import GoogleIcon from "@/components/ui/GoogleIcon";
import CircularProgress from "@mui/material/CircularProgress";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSchedulerAvailable, setIsSchedulerAvailable] = useState(true);

  // Google Calendar Sync State
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [lastGoogleSync, setLastGoogleSync] = useState(null);
  const [syncingGoogle, setSyncingGoogle] = useState(false);
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      const [eventsRes, tasksRes] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/tasks"),
      ]);
      const eventsData = await eventsRes.json();
      const tasksData = await tasksRes.json();

      if (Array.isArray(eventsData)) {
        setEvents(eventsData);
      }
      if (Array.isArray(tasksData)) {
        setTasks(tasksData);
      }
    } catch (err) {
      console.error("Error fetching calendar data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGoogleStatus = async () => {
    try {
      const res = await fetch("/api/calendar/google/sync");
      const data = await res.json();
      if (res.ok) {
        setIsGoogleConnected(Boolean(data.connected));
        setLastGoogleSync(data.lastSync || null);
      }
    } catch (err) {
      console.warn("Failed to check Google Calendar status:", err);
    }
  };

  const handleSyncGoogleCalendar = useCallback(async () => {
    setSyncingGoogle(true);
    try {
      const res = await fetch("/api/calendar/google/sync", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.code === "NOT_CONNECTED") {
          setIsGoogleConnected(false);
          // Prompt user to reconnect
          signIn("google", { callbackUrl: "/calendar?sync=true" });
          return;
        }
        throw new Error(data.error || "Failed to sync with Google Calendar");
      }

      setIsGoogleConnected(true);
      setLastGoogleSync(data.lastSync || new Date().toISOString());
      showToast(
        `Google Calendar synced! (${data.pulledCount} imported, ${data.pushedCount} exported)`,
        "success"
      );
      await fetchData();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSyncingGoogle(false);
    }
  }, [showToast]);

  const handleConnectGoogleCalendar = () => {
    signIn("google", { callbackUrl: "/calendar?sync=true" });
  };

  const checkSchedulerAvailability = () => {
    if (typeof window === "undefined") return;
    const lastRunString = localStorage.getItem("lastAiScheduleRun");
    if (!lastRunString) {
      setIsSchedulerAvailable(true);
      return;
    }
    const lastRun = new Date(lastRunString);
    const now = new Date();

    const targetToday = new Date(now);
    targetToday.setHours(4, 0, 0, 0);

    let mostRecent4AM;
    if (now >= targetToday) {
      mostRecent4AM = targetToday;
    } else {
      mostRecent4AM = new Date(targetToday);
      mostRecent4AM.setDate(mostRecent4AM.getDate() - 1);
    }

    setIsSchedulerAvailable(lastRun < mostRecent4AM);
  };

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      if (!isMounted) return;
      await fetchData();
      await fetchGoogleStatus();
      checkSchedulerAvailability();
    };
    init();

    // Check if redirected from Google OAuth with sync request
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("sync") === "true") {
        handleSyncGoogleCalendar();
        // Clean url
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    const interval = setInterval(checkSchedulerAvailability, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [handleSyncGoogleCalendar]);

  const selectedDateEvents = events.filter(
    (event) => formatDateString(event.date) === selectedDate
  );

  useEffect(() => {
    document.title = "Calendar | Helix";
  }, []);

  const handleScheduleCreated = () => {
    fetchData();
    checkSchedulerAvailability();
  };

  return (
    <div className="h-full min-h-0 flex-1 relative flex flex-col">
      {/* Calendar Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-[var(--border-color)] bg-[var(--bg-card)]">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Calendar Workspace
            </span>
            {isGoogleConnected && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Google Synced
              </span>
            )}
          </div>
          <span className="text-xs text-[var(--text-secondary)] hidden sm:inline">
            Plan schedules, sync events, and organize your productivity
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Google Calendar Sync Button */}
          {isGoogleConnected ? (
            <button
              onClick={handleSyncGoogleCalendar}
              disabled={syncingGoogle}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-white/5 hover:bg-white/10 border border-[var(--border-color)] hover:border-violet-500/40 text-[var(--text-primary)] rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-xs disabled:opacity-50"
              title={
                lastGoogleSync
                  ? `Last synced: ${new Date(lastGoogleSync).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : "Sync with Google Calendar"
              }
            >
              {syncingGoogle ? (
                <>
                  <CircularProgress size={16} color="inherit" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <GoogleIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Sync Google Calendar</span>
                  <span className="sm:hidden">Sync</span>
                  <SyncRoundedIcon sx={{ fontSize: 16 }} className="text-[var(--text-secondary)]" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleConnectGoogleCalendar}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-white/5 hover:bg-white/10 border border-[var(--border-color)] hover:border-violet-500/40 text-[var(--text-primary)] rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-xs"
              title="Connect your Google Calendar to synchronize events"
            >
              <GoogleIcon className="h-4 w-4" />
              <span>Connect Google Calendar</span>
            </button>
          )}

          {/* AI Task Scheduler */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            disabled={!isSchedulerAvailable}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[var(--accent)] hover:bg-[var(--accent)]/95 disabled:bg-[var(--border-color)] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            title={
              !isSchedulerAvailable
                ? "You can run the scheduler once a day. Refresh at 4:00 AM."
                : "Optimize schedule with AI"
            }
          >
            <span>🧠 AI Scheduler</span>
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden relative">
        {/* Desktop view */}
        <div className="hidden h-full w-full lg:flex">
          <div className="helix-scroll h-full w-[60%] overflow-y-auto p-4">
            <MonthCalendar
              events={events}
              tasks={tasks}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onAddEvent={() => {
                setEventToEdit(null);
                setIsAddEventModalOpen(true);
              }}
            />
          </div>
          <div className="helix-scroll h-full flex-1 overflow-y-auto p-4">
            <DayView
              selectedDate={selectedDate}
              events={selectedDateEvents}
              onAddEventClick={() => {
                setEventToEdit(null);
                setIsAddEventModalOpen(true);
              }}
              onEventClick={(event) => {
                setEventToEdit(event);
                setIsAddEventModalOpen(true);
              }}
            />
          </div>
        </div>

        {/* Mobile view */}
        <div className="helix-scroll flex h-full w-full flex-col gap-2 overflow-y-auto p-4 lg:hidden">
          <MobMonth
            events={events}
            tasks={tasks}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onAddEvent={() => {
              setEventToEdit(null);
              setIsAddEventModalOpen(true);
            }}
          />
          
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Agenda for {new Date(selectedDate + "T00:00:00").toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </h3>
              <button
                onClick={() => {
                  setEventToEdit(null);
                  setIsAddEventModalOpen(true);
                }}
                className="text-xs font-semibold text-[var(--accent)] hover:underline cursor-pointer"
              >
                + Add Event
              </button>
            </div>

            {selectedDateEvents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--border-color)] p-6 text-center text-xs text-[var(--text-secondary)]">
                No events scheduled for this day.
              </div>
            ) : (
              selectedDateEvents.map((event) => (
                <AgendaCard
                  key={event.id}
                  title={event.title}
                  startTime={event.startTime}
                  endTime={event.endTime}
                  type={event.type}
                  priority={event.priority}
                  status={event.status}
                  googleEventId={event.googleEventId}
                  assignees={[]}
                  onClick={() => {
                    setEventToEdit(event);
                    setIsAddEventModalOpen(true);
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Event creation / editing modal */}
      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => {
          setIsAddEventModalOpen(false);
          setEventToEdit(null);
        }}
        defaultDate={selectedDate}
        onEventAdded={fetchData}
        eventToEdit={eventToEdit}
      />

      {/* AI Task Scheduler Wizard Modal */}
      <AiSchedulerModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onScheduleCreated={handleScheduleCreated}
      />
    </div>
  );
}