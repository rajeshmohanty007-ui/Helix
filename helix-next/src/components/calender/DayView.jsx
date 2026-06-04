import React, { useEffect, useRef, useState } from "react";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const sampleEvents = [
  {
    id: 1,
    title: "Team Meeting",
    start: 8,
    end: 9,
    color: "#8b5cf6",
  },
  {
    id: 2,
    title: "Deep Work Session",
    start: 10,
    end: 12,
    color: "#3b82f6",
  },
  {
    id: 3,
    title: "Project Review",
    start: 14,
    end: 15.5,
    color: "#f97316",
  },
];

export default function DayView() {
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

  // Auto scroll to current time on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!scrollRef.current) return;

      const currentHour = now.getHours() + now.getMinutes() / 60;

      const containerHeight = scrollRef.current.clientHeight;

      scrollRef.current.scrollTo({
        top: Math.max(0, currentHour * hourHeight - containerHeight / 2),
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

    element.addEventListener("wheel", wheelHandler, {
      passive: false,
    });

    return () => {
      element.removeEventListener("wheel", wheelHandler);
    };
  }, []);
  // Ctrl + +/-
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

  const getHeight = (start, end) => (end - start) * hourHeight;

  const currentHour = now.getHours() + now.getMinutes() / 60;

  const nowTop = currentHour * hourHeight;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] p-4">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            {now.toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h2>

          <p className="text-sm text-[var(--text-secondary)]">
            {now.toLocaleDateString(undefined, {
              weekday: "long",
            })}
          </p>
        </div>

        <button className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm text-white transition hover:opacity-90">
          Add Event
        </button>
      </div>

      {/* Timeline */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div
          className="relative"
          style={{
            height: `${24 * hourHeight}px`,
          }}
        >
          {/* Current Time Line */}
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

          {/* Events */}
          {sampleEvents.map((event) => (
            <button
              key={event.id}
              onClick={() => {
                console.log("Open Edit Menu", event.id);
              }}
              className="absolute right-4 left-24 z-10 overflow-hidden rounded-xl p-3 text-left shadow-md transition hover:scale-[1.01] hover:shadow-lg"
              style={{
                top: `${getTop(event.start)}px`,
                height: `${getHeight(event.start, event.end)}px`,
                backgroundColor: event.color,
              }}
            >
              <h3 className="font-semibold text-white">{event.title}</h3>

              {/* <p className="mt-1 text-xs text-white/80">
                {event.start}:00 - {event.end}:00
              </p> */}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
