import React, { useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";

export default function MonthCalendar({
  events = [],
  tasks = [],
  selectedDate,
  onSelectDate,
  onAddEvent,
}) {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const formatDateString = (dateInput) => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "";
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Check if a day has any unfinished task deadline
  const isUnfinishedTaskDeadlineOnDay = (dayString) => {
    return tasks.some((task) => {
      if (task.completed) return false;
      if (!task.deadline || task.deadline === "No deadline") return false;

      if (task.deadline === dayString) return true;

      try {
        const deadlineDate = new Date(task.deadline);
        if (isNaN(deadlineDate.getTime())) return false;

        const targetDate = new Date(dayString + "T00:00:00");
        return (
          deadlineDate.getFullYear() === targetDate.getFullYear() &&
          deadlineDate.getMonth() === targetDate.getMonth() &&
          deadlineDate.getDate() === targetDate.getDate()
        );
      } catch {
        return false;
      }
    });
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

          const dayEvents = events.filter(
            (e) => formatDateString(e.date) === dayString
          );
          const eventCount = dayEvents.length;

          // Heatmap intensity based on event count
          const intensityClass =
            eventCount === 0
              ? "bg-[var(--bg-main)] hover:bg-[var(--bg-hover)]"
              : eventCount <= 2
                ? "bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20"
                : eventCount <= 4
                  ? "bg-[var(--accent)]/25 hover:bg-[var(--accent)]/35"
                  : eventCount <= 6
                    ? "bg-[var(--accent)]/45 hover:bg-[var(--accent)]/55"
                    : "bg-[var(--accent)]/70 hover:bg-[var(--accent)]/80 text-white";

          const hasUnfinishedDeadline = isUnfinishedTaskDeadlineOnDay(dayString);
          const isSelected = selectedDate === dayString;

          return (
            <button
              key={day}
              onClick={() => onSelectDate(dayString)}
              className={`group relative flex aspect-square flex-col rounded-2xl p-2 transition-all duration-200 ${intensityClass} ${
                isToday(day)
                  ? "border-[var(--accent)] border-2 ring-1 ring-[var(--accent)]"
                  : "border border-[var(--border-color)] hover:scale-[1.03]"
              } ${isSelected ? "ring-2 ring-[var(--accent)] scale-[1.03]" : ""}`}
            >
              {/* Date & Action Row */}
              <div className="flex items-start justify-between w-full">
                <span
                  className={`text-sm font-semibold 2xl:text-lg ${
                    isToday(day)
                      ? "text-[var(--accent)]"
                      : eventCount > 6
                        ? "text-white"
                        : "text-[var(--text-primary)]"
                  }`}
                >
                  {day}
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Red dot for unfinished task deadlines */}
                  {hasUnfinishedDeadline && (
                    <span
                      className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-md border border-[var(--bg-card)]"
                      title="Unfinished task deadline"
                    />
                  )}

                  {/* Add event mini-button */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDate(dayString);
                      onAddEvent();
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                    title="Add event"
                  >
                    <AddIcon sx={{ fontSize: 16 }} />
                  </div>
                </div>
              </div>

              {/* Workload Progress Bar */}
              <div className="mt-auto w-full">
                <div className="h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/15">
                  <div
                    className={`h-full rounded-full transition-all ${
                      eventCount > 6 ? "bg-white" : "bg-[var(--accent)]"
                    }`}
                    style={{
                      width: `${Math.min(eventCount * 25, 100)}%`,
                    }}
                  />
                </div>

                <div
                  className={`mt-1 text-left text-[10px] font-medium ${
                    eventCount > 6 ? "text-white/80" : "text-[var(--text-secondary)]"
                  }`}
                >
                  {eventCount === 0
                    ? "Free"
                    : `${eventCount} event${eventCount > 1 ? "s" : ""}`}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
