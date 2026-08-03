"use client";

import { useState, useEffect } from "react";
import MobMonth from "@/components/calender/MobMonth";
import MonthCalendar from "@/components/calender/Month";
import AgendaCard from "@/components/calender/AgendaCard";
import DayView from "@/components/calender/DayView";
import AddEventModal from "@/components/calender/AddEventModal";
import AiSchedulerModal from "@/components/calender/AiSchedulerModal";
import { getTodayString, formatDateString } from "@/ScriptFunc/calendar";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSchedulerAvailable, setIsSchedulerAvailable] = useState(true);

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
    fetchData();
    checkSchedulerAvailability();

    const interval = setInterval(checkSchedulerAvailability, 60000);
    return () => clearInterval(interval);
  }, []);

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
      {/* AI Task Scheduler Action Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--border-color)] bg-[var(--bg-card)]">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            AI Assist
          </span>
          <span className="text-xs text-[var(--text-secondary)] hidden sm:inline">
            Optimize your tasks and calendar into a balanced weekly plan
          </span>
        </div>
        <div className="flex items-center gap-3">
          {!isSchedulerAvailable && (
            <span className="text-[11px] text-[var(--text-secondary)] italic">
              Available tomorrow after 4:00 AM
            </span>
          )}
          <button
            onClick={() => setIsAiModalOpen(true)}
            disabled={!isSchedulerAvailable}
            className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent)]/95 disabled:bg-[var(--border-color)] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            title={!isSchedulerAvailable ? "You can run the scheduler once a day. Refresh at 4:00 AM." : "Optimize schedule with AI"}
          >
            <span>🧠 AI Task Scheduler</span>
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