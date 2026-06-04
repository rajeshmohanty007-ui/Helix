import React, { useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";

export default function MonthCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock event structure mapping 'YYYY-MM-DD' strings to an array of events
  const [events, setEvents] = useState({
    "2026-06-03": [
      { id: 1, title: "Project Demo" },
      { id: 2, title: "Team Sync" },
    ],
    "2026-06-15": [{ id: 3, title: "Code Review" }],
    "2026-06-22": [{ id: 4, title: "Launch Day" }],
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calendar Math
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // First day of the current month (0 = Sunday, 1 = Monday, etc.)
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Total days in the current month
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Navigation Handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Helper to check if a specific date tile is "Today"
  const isToday = (day) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  // Quick helper to safely add a dummy event to a day
  const handleAddEvent = (dayString) => {
    const title = prompt("Enter event title:");
    if (!title) return;

    setEvents((prev) => ({
      ...prev,
      [dayString]: [...(prev[dayString] || []), { id: Date.now(), title }],
    }));
  };

  return (
    <div className="mx-auto w-full max-w-5xl rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 text-[var(--text-primary)] shadow-xl">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] p-2 transition-colors hover:bg-[var(--bg-hover)]"
        >
          <ChevronLeftIcon className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]" />
        </button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            {monthNames[month]}{" "}
            <span className="font-normal text-[var(--text-secondary)]">
              {year}
            </span>
          </h2>
        </div>
        <button
          onClick={handleNextMonth}
          className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] p-2 transition-colors hover:bg-[var(--bg-hover)]"
        >
          <ChevronRightIcon className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]" />
        </button>
      </div>

      {/* Days of Week Row */}
      <div className="mb-4 grid grid-cols-7 gap-1 text-center text-xs font-medium tracking-wider text-[var(--text-secondary)] uppercase">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid of Tiles */}
      <div className="grid grid-cols-7 gap-1 xl:gap-2">
        {/* Empty padding tiles for the days before the 1st of the month */}
        {Array.from({ length: firstDayIndex }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="pointer-events-none aspect-square opacity-0"
          />
        ))}

        {/* Actual Date Tiles */}
        {Array.from({ length: totalDays }).map((_, index) => {
          const day = index + 1;

          const dayString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

          const dayEvents = events[dayString] || [];

          // Heatmap intensity
          const eventCount = dayEvents.length;

          const intensityClass =
            eventCount === 0
              ? "bg-[var(--bg-main)]"
              : eventCount <= 2
                ? "bg-[var(--accent)]/15"
                : eventCount <= 4
                  ? "bg-[var(--accent)]/35"
                  : eventCount <= 6
                    ? "bg-[var(--accent)]/55"
                    : "bg-[var(--accent)]/80";

          // Example urgent condition
          const isUrgent = eventCount >= 5;

          return (
            <button
              key={day}
              className={`group relative flex aspect-square flex-col rounded-2xl p-2 transition-all duration-200 ${intensityClass} ${
                isToday(day)
                  ? "border-[var(--accent)] border-2 ring-1 ring-[var(--accent)]"
                  : "border border-[var(--border-color)] hover:scale-[1.03]"
              }`}
            >
              {/* Date */}
              <div className="flex items-start justify-between">
                <span
                  className={`text-sm font-semibold 2xl:text-lg ${
                    isToday(day)
                      ? "text-[var(--accent)]"
                      : "text-[var(--text-primary)]"
                  }`}
                >
                  {day}
                </span>

                {isUrgent && <span className="animate-pulse text-xs">⚠</span>}
              </div>

              {/* Workload Bar */}
              <div className="mt-auto">
                <div className="h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-[var(--accent)] transition-all"
                    style={{
                      width: `${Math.min(eventCount * 20, 100)}%`,
                    }}
                  />
                </div>

                <div className="mt-1 text-center text-[10px] text-[var(--text-secondary)]">
                  {eventCount === 0
                    ? "Free"
                    : `${eventCount} task${eventCount > 1 ? "s" : ""}`}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
