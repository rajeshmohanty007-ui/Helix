"use client";

import { useRouter } from "next/navigation";
import {
  Add,
  Search,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
  SettingsRounded,
} from "@mui/icons-material";

export default function ProjectSidebar({
  collapsed,
  setCollapsed,
  activeProj,
  setActiveProj,
  projects = [],
  onAddProjectClick,
}) {
  const router = useRouter();
  return (
    <aside
      className={`absolute flex flex-col top-0 left-0 z-25 h-full rounded-r-4xl border-r border-(--border-color) bg-(--bg-sidebar) transition-all duration-300 lg:relative ${
        collapsed ? "w-16" : "w-72"
      } `}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-1/2 -right-4 z-26 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-(--bg-card) shadow-lg transition hover:scale-105"
      >
        {collapsed ? (
          <KeyboardDoubleArrowRight fontSize="small" />
        ) : (
          <KeyboardDoubleArrowLeft fontSize="small" />
        )}
      </button>

      {/* Header */}
      <div className="flex items-center justify-between p-2">
        {!collapsed && <h2 className="text-lg font-semibold">Projects</h2>}

        <button
          onClick={onAddProjectClick}
          className="rounded-lg p-2 hover:bg-(--bg-hover) cursor-pointer"
          title="Create New Project"
        >
          <Add />
        </button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 rounded-lg bg-(--bg-main) px-3 py-2">
            <Search fontSize="small" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>
      )}

      {/* Project List */}
      <div className="flex flex-col flex-1 items-center gap-2 overflow-x-hidden overflow-y-auto px-2 helix-scroll">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`group relative flex w-full items-center justify-between gap-2 px-3 py-3 rounded-xl transition cursor-pointer select-none ${
              !collapsed && activeProj?.id === project.id
                ? "bg-(--accent) text-white shadow-md"
                : "hover:bg-(--bg-hover) text-(--text-primary)"
            }`}
            onClick={() => setActiveProj(project)}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {collapsed && activeProj?.id === project.id && (
                <span className="absolute top-0 left-0 h-full w-0.5 bg-(--accent)" />
              )}
              {/* Status Dot */}
              <span
                className={`h-4 w-4 rounded-full shrink-0 ${
                  project.status === "active"
                    ? "bg-green-500"
                    : project.status === "completed"
                    ? "bg-blue-500"
                    : "bg-yellow-500"
                } `}
              />

              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="font-medium truncate">{project.name}</span>
                  <span className="text-xs opacity-60">{project.status}</span>
                </div>
              )}
            </div>

            {!collapsed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/projects/${project.id}/settings`);
                }}
                className={`rounded-lg p-1.5 transition opacity-0 group-hover:opacity-100 no-hover-visible cursor-pointer flex items-center justify-center shrink-0 ${
                  activeProj?.id === project.id
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                }`}
                title="Project Settings"
              >
                <SettingsRounded fontSize="small" />
              </button>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
