export default function ProjectsLoading() {
  return (
    <div className="relative flex h-full flex-1 animate-pulse">
      {/* Fake ProjectSide Column */}
      <aside className="hidden flex-col h-full w-16 border-r border-[var(--border-color)] bg-[var(--bg-sidebar)] lg:flex items-center py-4 gap-4">
        <div className="h-8 w-8 rounded-full bg-[var(--bg-hover)]" />
        <div className="h-10 w-10 rounded-xl bg-[var(--bg-hover)]" />
        <div className="h-10 w-10 rounded-xl bg-[var(--bg-hover)]" />
        <div className="h-10 w-10 rounded-xl bg-[var(--bg-hover)]" />
      </aside>

      {/* Main Content Area */}
      <div className="flex min-h-0 flex-1 flex-col p-2">
        {/* Active Project Title Placeholder */}
        <div className="flex justify-center p-4">
          <div className="h-8 w-32 rounded bg-[var(--bg-hover)]" />
        </div>

        {/* 3-Column Pane */}
        <div className="flex min-h-0 flex-1 rounded-t-2xl border border-[var(--border-color)] bg-[var(--bg-card)]">
          {/* Column 1: Updates */}
          <div className="flex h-full w-1/3 min-w-0 flex-col border-r border-[var(--border-color)] p-4 space-y-4">
            <div className="h-6 w-24 mx-auto rounded bg-[var(--bg-hover)]" />
            <div className="h-10 rounded-lg bg-[var(--bg-hover)]" />
            <div className="flex-1 space-y-3 overflow-hidden">
              <div className="h-24 rounded-xl bg-[var(--bg-hover)]" />
              <div className="h-24 rounded-xl bg-[var(--bg-hover)]" />
              <div className="h-24 rounded-xl bg-[var(--bg-hover)]" />
            </div>
          </div>

          {/* Column 2: Objectives */}
          <div className="flex h-full w-1/3 min-w-0 flex-col border-r border-[var(--border-color)] p-4 space-y-4">
            <div className="h-6 w-28 mx-auto rounded bg-[var(--bg-hover)]" />
            <div className="h-10 rounded-lg bg-[var(--bg-hover)]" />
            <div className="flex-1 space-y-3 overflow-hidden">
              <div className="h-20 rounded-xl bg-[var(--bg-hover)]" />
              <div className="h-20 rounded-xl bg-[var(--bg-hover)]" />
              <div className="h-20 rounded-xl bg-[var(--bg-hover)]" />
            </div>
          </div>

          {/* Column 3: Chats */}
          <div className="flex h-full w-1/3 min-w-0 flex-col p-4 space-y-4">
            <div className="h-6 w-20 mx-auto rounded bg-[var(--bg-hover)]" />
            <div className="flex-1 rounded-xl bg-[var(--bg-hover)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
