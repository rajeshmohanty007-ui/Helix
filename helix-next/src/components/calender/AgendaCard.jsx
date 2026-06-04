import React from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FlagIcon from "@mui/icons-material/Flag";
import GroupIcon from "@mui/icons-material/Group";

export default function AgendaCard({
  title,
  startTime,
  endTime,
  type = "task",
  priority = "medium",
  status = "pending",
  assignees = [],
  onClick,
}) {
  const typeStyles = {
    task: "bg-blue-500/15 text-blue-500",
    deadline: "bg-red-500/15 text-red-500",
    meeting: "bg-purple-500/15 text-purple-500",
    focus: "bg-orange-500/15 text-orange-500",
  };

  const priorityStyles = {
    low: "text-green-500",
    medium: "text-yellow-500",
    high: "text-red-500",
  };

  return (
    <button
      onClick={onClick}
      className="
        w-full
        rounded-2xl
        border border-[var(--border-color)]
        bg-[var(--bg-card)]
        p-4
        text-left
        transition-all
        hover:bg-[var(--bg-hover)]
        active:scale-[0.98]
      "
    >
      {/* Top Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-[var(--text-primary)]">
            {title}
          </h3>

          <div className="mt-1 flex items-center gap-1 text-xs text-[var(--text-secondary)]">
            <AccessTimeIcon sx={{ fontSize: 14 }} />

            <span>
              {startTime} - {endTime}
            </span>
          </div>
        </div>

        <div
          className={`
            rounded-full px-2 py-1 text-[10px] font-medium
            ${typeStyles[type]}
          `}
        >
          {type}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <FlagIcon
            sx={{ fontSize: 14 }}
            className={priorityStyles[priority]}
          />

          <span className="text-xs text-[var(--text-secondary)] capitalize">
            {priority}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {assignees.length > 0 && (
            <>
              <GroupIcon
                sx={{ fontSize: 14 }}
                className="text-[var(--text-secondary)]"
              />

              <div className="flex -space-x-2">
                {assignees.slice(0, 3).map((person, index) => (
                  <div
                    key={index}
                    className="
                      flex h-6 w-6 items-center justify-center
                      rounded-full
                      border-2 border-[var(--bg-card)]
                      bg-[var(--accent)]
                      text-[10px]
                      font-semibold
                      text-white
                    "
                  >
                    {person.charAt(0)}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-[var(--bg-main)]">
        <div
          className={`
            h-full rounded-full
            ${
              status === "completed"
                ? "w-full bg-green-500"
                : status === "in-progress"
                  ? "w-2/3 bg-[var(--accent)]"
                  : "w-1/4 bg-yellow-500"
            }
          `}
        />
      </div>
    </button>
  );
}