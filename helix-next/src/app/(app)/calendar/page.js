"use client";

import { useState, useEffect } from "react";
import MobMonth from "@/components/calender/MobMonth";
import MonthCalendar from "@/components/calender/Month";
import AgendaCard from "@/components/calender/AgendaCard";
import DayView from "@/components/calender/DayView";
import AddEventModal from "@/components/calender/AddEventModal";
import { getTodayString, formatDateString } from "@/ScriptFunc/calendar";

export default function CalendarPage() {


  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchData();
  }, []);



  const selectedDateEvents = events.filter(
    (event) => formatDateString(event.date) === selectedDate
  );

  return (
    <div className="h-full min-h-0 flex-1 relative">
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
              className="text-xs font-semibold text-[var(--accent)] hover:underline"
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
    </div>
  );
}