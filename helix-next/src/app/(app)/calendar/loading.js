export default function CalendarLoading() {
  return (
    <div className="h-full min-h-0 flex-1 p-4 animate-pulse">
      {/* Desktop view */}
      <div className="hidden h-full w-full lg:flex gap-4">
        {/* Left Column (Month Calendar) */}
        <div className="h-full w-[60%] flex flex-col gap-4 border border-[var(--border-color)] bg-[var(--bg-card)] rounded-2xl p-4">
          {/* Header controls */}
          <div className="flex justify-between items-center pb-2">
            <div className="h-8 w-32 rounded bg-[var(--bg-hover)]" />
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded bg-[var(--bg-hover)]" />
              <div className="h-8 w-8 rounded bg-[var(--bg-hover)]" />
            </div>
          </div>
          {/* Grid structure (7 columns x 6 rows) */}
          <div className="grid grid-cols-7 gap-2">
            {/* Days of week */}
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={`wk-${i}`} className="h-6 rounded bg-[var(--bg-hover)]" />
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 flex-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={`day-${i}`} className="h-16 rounded-xl bg-[var(--bg-hover)]" />
            ))}
          </div>
        </div>

        {/* Right Column (Day View / Schedule) */}
        <div className="h-full flex-1 flex flex-col gap-4 border border-[var(--border-color)] bg-[var(--bg-card)] rounded-2xl p-4">
          <div className="flex justify-between items-center pb-2">
            <div className="h-8 w-44 rounded bg-[var(--bg-hover)]" />
            <div className="h-10 w-24 rounded-lg bg-[var(--bg-hover)]" />
          </div>
          <div className="flex-1 space-y-4 overflow-hidden">
            <div className="h-20 rounded-xl bg-[var(--bg-hover)]" />
            <div className="h-20 rounded-xl bg-[var(--bg-hover)]" />
            <div className="h-20 rounded-xl bg-[var(--bg-hover)]" />
          </div>
        </div>
      </div>

      {/* Mobile view */}
      <div className="flex h-full w-full flex-col gap-4 lg:hidden">
        <div className="h-44 rounded-2xl bg-[var(--bg-card)] p-4 border border-[var(--border-color)]" />
        <div className="h-24 rounded-2xl bg-[var(--bg-card)] p-4 border border-[var(--border-color)]" />
      </div>
    </div>
  );
}
