import React, { useEffect, useRef, useState } from "react";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const eventColors = {
  task: "#3b82f6", // Blue
  deadline: "#ef4444", // Red
  meeting: "#8b5cf6", // Purple
  focus: "#f97316", // Orange
  default: "#10b981", // Emerald
};

export default function DayView({
  selectedDate,
  events = [],
  onAddEventClick,
}) {
  const [hourHeight, setHourHeight] = useState(80);
  const [now, setNow] = useState(new Date());

  const scrollRef = useRef(null);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Auto scroll to current time or first event on load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!scrollRef.current) return;

      const containerHeight = scrollRef.current.clientHeight;

      // Default to scrolling to 8:00 AM or the current hour
      const scrollHour = now.getHours() + now.getMinutes() / 60;
      scrollRef.current.scrollTo({
        top: Math.max(0, (scrollHour - 2) * hourHeight),
        behavior: "smooth",
      });
    });

    return () => clearTimeout(timer);
  }, []);

  // Ctrl + scroll zoom
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const wheelHandler = (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault();

      const container = scrollRef.current;
      const mouseY = e.clientY;
      const rect = container.getBoundingClientRect();
      const relativeY = mouseY - rect.top + container.scrollTop;
      const ratio = relativeY / hourHeight;

      setHourHeight((prev) => {
        const next = Math.min(200, Math.max(40, prev - e.deltaY * 0.1));
        requestAnimationFrame(() => {
          container.scrollTop = ratio * next - (mouseY - rect.top);
        });
        return next;
      });
    };

    element.addEventListener("wheel", wheelHandler, { passive: false });
    return () => {
      element.removeEventListener("wheel", wheelHandler);
    };
  }, [hourHeight]);

  // Ctrl + +/- key zoom support
  useEffect(() => {
    const keyHandler = (e) => {
      if (!e.ctrlKey) return;

      if (e.key === "=" || e.key === "+") {
        e.preventDefault();
        setHourHeight((h) => Math.min(200, h + 10));
      }

      if (e.key === "-") {
        e.preventDefault();
        setHourHeight((h) => Math.max(40, h - 10));
      }
    };

    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);

  const getTop = (hour) => hour * hourHeight;
  const getHeight = (start, end) => Math.max(0.5, end - start) * hourHeight;

  const parseTimeToDecimal = (timeStr) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(":");
    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    return hours + minutes / 60;
  };

  const parsedDate = selectedDate
    ? new Date(selectedDate + "T00:00:00")
    : new Date();

  const isSelectedDateToday = () => {
    const today = new Date();
    return (
      today.getDate() === parsedDate.getDate() &&
      today.getMonth() === parsedDate.getMonth() &&
      today.getFullYear() === parsedDate.getFullYear()
    );
  };

  const currentHour = now.getHours() + now.getMinutes() / 60;
  const nowTop = currentHour * hourHeight;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] p-4">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            {parsedDate.toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h2>

          <p className="text-sm text-[var(--text-secondary)]">
            {parsedDate.toLocaleDateString(undefined, {
              weekday: "long",
            })}
          </p>
        </div>

        <button
          onClick={onAddEventClick}
          className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm text-white transition hover:opacity-90 font-medium cursor-pointer"
        >
          Add Event
        </button>
      </div>

      {/* Timeline */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto helix-scroll">
        <div
          className="relative"
          style={{
            height: `${24 * hourHeight}px`,
          }}
        >
          {/* Current Time Line (Only displays if selected date is today) */}
          {isSelectedDateToday() && (
            <div
              className="pointer-events-none absolute right-0 left-20 z-20"
              style={{
                top: `${nowTop}px`,
              }}
            >
              <div className="relative">
                {/* Dot */}
                <div className="absolute top-1/2 -left-[6px] h-3 w-3 -translate-y-1/2 rounded-full bg-red-500" />

                {/* Line */}
                <div className="h-[2px] w-full bg-red-500" />

                {/* Time Label */}
                <div className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-red-500 px-2 py-1 text-xs text-white shadow">
                  {now.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Hour Rows */}
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="flex border-b border-[var(--border-color)]"
              style={{
                height: `${hourHeight}px`,
              }}
            >
              {/* Time Column */}
              <div className="w-20 border-r border-[var(--border-color)] px-3 py-2 text-sm text-[var(--text-secondary)]">
                {String(hour).padStart(2, "0")}:00
              </div>

              {/* Schedule Area */}
              <div className="flex-1" />
            </div>
          ))}

          {/* Events list */}
          {events.map((event) => {
            const startDecimal = parseTimeToDecimal(event.startTime);
            const endDecimal = parseTimeToDecimal(event.endTime);
            const duration = endDecimal - startDecimal;
            const topPos = getTop(startDecimal);
            const heightPos = getHeight(startDecimal, endDecimal);
            const color = eventColors[event.type] || eventColors.default;

            return (
              <div
                key={event.id}
                className="absolute right-4 left-24 z-10 overflow-hidden rounded-xl p-3 text-left shadow-md border border-white/5 transition hover:scale-[1.01] hover:shadow-lg flex flex-col justify-between"
                style={{
                  top: `${topPos + 2}px`,
                  height: `${heightPos - 4}px`,
                  backgroundColor: color,
                }}
              >
                <div className="min-w-0">
                  <h3 className="font-semibold text-white truncate text-sm">
                    {event.title}
                  </h3>
                  {event.description && (
                    <p className="text-[11px] text-white/80 line-clamp-2 mt-0.5">
                      {event.description}
                    </p>
                  )}
                </div>

                <div className="text-[10px] text-white/70 font-medium">
                  {event.startTime} - {event.endTime}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
