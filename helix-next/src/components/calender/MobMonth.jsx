import React, { useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";

export default function MobMonth() {
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

          const workload = dayEvents.length;

          const intensityClass =
            workload === 0
              ? "bg-[var(--bg-main)]"
              : workload === 1
                ? "bg-yellow-400/25"
                : workload === 2
                  ? "bg-yellow-400/50"
                  : workload === 3
                    ? "bg-orange-400/50"
                    : workload === 4
                      ? "bg-orange-500/70"
                      : workload === 5
                        ? "bg-red-500/70"
                        : "bg-red-600";

          return (
            <button
              key={day}
              className={`relative aspect-square rounded-xl transition-all duration-200 ${intensityClass} ${
                isToday(day) ? "ring-2 ring-[var(--accent)]" : ""
              } `}
            >
              {/* Date Number */}
              <span
                className={`absolute top-2 left-2 text-xs font-medium ${
                  workload >= 5 ? "text-white" : "text-[var(--text-primary)]"
                } `}
              >
                {day}
              </span>

              {/* Deadline Dot */}
              {workload >= 5 && (
                <div className="absolute right-2 bottom-2 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
