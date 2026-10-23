"use client";

import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import Link from "next/link";

export default function NotificationCard({ notification, onDismiss }) {
  const { id, type, title, message, createdAt, actionUrl } = notification;

  // Type configuration
  const config = {
    task: {
      icon: <CheckBoxRoundedIcon fontSize="small" />,
      colorClass: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      label: "Task",
    },
    event: {
      icon: <TodayRoundedIcon fontSize="small" />,
      colorClass: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      label: "Event",
    },
    project: {
      icon: <FolderRoundedIcon fontSize="small" />,
      colorClass: "bg-violet-500/10 text-violet-500 border-violet-500/20",
      label: "Project",
    },
    system: {
      icon: <InfoRoundedIcon fontSize="small" />,
      colorClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      label: "System",
    },
  };

  const currentConfig = config[type] || config.system;

  // Format time
  const timeString = new Date(createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="group relative flex gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-sm transition-all duration-300 hover:border-[var(--accent)] hover:shadow-md">
      
      {/* Icon Badge */}
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${currentConfig.colorClass}`}>
        {currentConfig.icon}
      </div>

      {/* Info Content */}
      <div className="flex-1 min-w-0 pr-6">
        <div className="flex items-center gap-2 mb-1">
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${currentConfig.colorClass}`}>
            {currentConfig.label}
          </span>
          <span className="text-[10px] text-[var(--text-secondary)]">
            {timeString}
          </span>
        </div>
        
        <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">
          {title}
        </h4>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
          {message}
        </p>

        {/* Action button */}
        {actionUrl && (
          <Link
            href={actionUrl}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--accent)] hover:underline"
          >
            Go to {currentConfig.label}
            <ArrowForwardRoundedIcon sx={{ fontSize: 12 }} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      {/* Dismiss Button */}
      {onDismiss && (
        <button
          onClick={() => onDismiss(id)}
          className="absolute top-4 right-4 rounded-lg p-1 text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] cursor-pointer"
          title="Dismiss"
        >
          <CloseRoundedIcon sx={{ fontSize: 16 }} />
        </button>
      )}
    </div>
  );
}
