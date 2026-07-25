import React, { useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function MobMonth({
  events = [],
  tasks = [],
  selectedDate,
  onSelectDate,
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
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
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

          // Heatmap intensity for mobile background
          const intensityClass =
            eventCount === 0
              ? "bg-[var(--bg-main)]"
              : eventCount <= 2
                ? "bg-[var(--accent)]/10"
                : eventCount <= 4
                  ? "bg-[var(--accent)]/25"
                  : "bg-[var(--accent)]/45" ;

          const hasUnfinishedDeadline = isUnfinishedTaskDeadlineOnDay(dayString);
          const isSelected = selectedDate === dayString;

          return (
            <button
              key={day}
              onClick={() => onSelectDate(dayString)}
              className={`relative aspect-square rounded-xl flex flex-col justify-between p-1.5 transition-all duration-200 ${intensityClass} ${
                isToday(day) ? "ring-2 ring-[var(--accent)]" : ""
              } ${isSelected ? "ring-2 ring-[var(--accent)] scale-[1.03]" : ""}`}
            >
              {/* Date Number and red dot */}
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-medium text-[var(--text-primary)]">
                  {day}
                </span>

                {hasUnfinishedDeadline && (
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-sm border border-[var(--bg-card)]"
                    title="Unfinished task deadline"
                  />
                )}
              </div>

              {/* Mobile Workload Progress Bar */}
              <div className="w-full mt-auto">
                <div className="h-1 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/20">
                  <div
                    className="h-full rounded-full bg-[var(--accent)] transition-all"
                    style={{
                      width: `${Math.min(eventCount * 25, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
