export default function TasksLoading() {
  return (
    <div className="h-full flex-1 overflow-y-auto p-4 animate-pulse">
      <div className="flex h-full flex-col gap-2 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-md">
        {/* TaskListBar Header Skeleton */}
        <div className="flex items-center gap-4 border-b border-[var(--border-color)] pb-4">
          <div className="h-8 w-20 rounded-lg bg-[var(--bg-hover)]" />
          <div className="h-8 w-20 rounded-lg bg-[var(--bg-hover)]" />
          <div className="h-8 w-20 rounded-lg bg-[var(--bg-hover)]" />
          <div className="ml-auto h-8 w-28 rounded-lg bg-[var(--bg-hover)]" />
        </div>

        {/* Split View Content Skeletons */}
        <div className="flex min-h-0 w-full flex-1 gap-4 pt-2">
          {/* Left Column (Task List) */}
          <div className="flex h-full w-[40%] flex-col gap-3 pr-4 border-r border-[var(--border-color)]">
            <div className="h-14 rounded-xl bg-[var(--bg-hover)]" />
            <div className="h-14 rounded-xl bg-[var(--bg-hover)]" />
            <div className="h-14 rounded-xl bg-[var(--bg-hover)]" />
            <div className="h-14 rounded-xl bg-[var(--bg-hover)]" />
            <div className="mt-auto h-12 w-full rounded-xl bg-[var(--bg-hover)]" />
          </div>

          {/* Right Column (Task Details) */}
          <div className="flex h-full flex-1 flex-col gap-4">
            <div className="h-10 w-2/3 rounded-lg bg-[var(--bg-hover)]" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-20 rounded-full bg-[var(--bg-hover)]" />
              <div className="h-6 w-24 rounded-full bg-[var(--bg-hover)]" />
            </div>
            <div className="space-y-2 mt-4">
              <div className="h-4 w-full rounded bg-[var(--bg-hover)]" />
              <div className="h-4 w-5/6 rounded bg-[var(--bg-hover)]" />
              <div className="h-4 w-2/3 rounded bg-[var(--bg-hover)]" />
            </div>
            <div className="flex gap-2 mt-4">
              <div className="h-8 w-16 rounded bg-[var(--bg-hover)]" />
              <div className="h-8 w-16 rounded bg-[var(--bg-hover)]" />
            </div>
            <div className="mt-6 space-y-3">
              <div className="h-8 w-32 rounded bg-[var(--bg-hover)]" />
              <div className="h-6 rounded bg-[var(--bg-hover)]" />
              <div className="h-6 rounded bg-[var(--bg-hover)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
