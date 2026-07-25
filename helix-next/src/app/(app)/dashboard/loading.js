export default function DashboardLoading() {
  return (
    <div className="flex-1 overflow-y-auto helix-scroll">
      <div className="m-4 flex flex-col gap-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-md animate-pulse">
        {/* Greetings Skeleton */}
        <div className="flex flex-col gap-2 justify-between md:flex-row md:items-center">
          <div className="space-y-2 w-full max-w-[250px]">
            <div className="h-7 w-3/4 rounded bg-[var(--bg-hover)]" />
            <div className="h-5 w-1/2 rounded bg-[var(--bg-hover)]" />
            <div className="h-4 w-1/3 rounded bg-[var(--bg-hover)]" />
          </div>
          <div className="space-y-2 w-full max-w-[180px]">
            <div className="h-10 rounded-2xl bg-[var(--bg-hover)]" />
            <div className="h-10 rounded-2xl bg-[var(--bg-hover)]" />
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="h-32 rounded-2xl bg-[var(--bg-hover)]" />
          <div className="h-32 rounded-2xl bg-[var(--bg-hover)]" />
          <div className="h-32 rounded-2xl bg-[var(--bg-hover)]" />
        </div>

        {/* Activity Skeleton */}
        <div className="h-64 rounded-2xl bg-[var(--bg-hover)]" />

        {/* Recent Activities Section */}
        <div className="space-y-4">
          <div className="h-8 w-48 rounded bg-[var(--bg-hover)]" />
          <div className="h-28 rounded-2xl bg-[var(--bg-hover)]" />
          <div className="h-28 rounded-2xl bg-[var(--bg-hover)]" />
        </div>

        {/* See All Button */}
        <div className="flex justify-center">
          <div className="h-10 w-24 rounded-xl bg-[var(--bg-hover)]" />
        </div>
      </div>
    </div>
  );
}
