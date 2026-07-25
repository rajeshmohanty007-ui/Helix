"use client";

import { signOut, useSession } from "next-auth/react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

export default function Profile({ onClose }) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs">
      {/* Background click overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-[90%] max-w-md rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">User Profile</h2>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
          >
            <CloseRoundedIcon fontSize="small" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="my-6 flex flex-col items-center gap-4 text-center">
          <div className="relative">
            {user?.image ? (
              <img
                src={user.image}
                alt={user?.name || "User"}
                className="h-24 w-24 rounded-full border-2 border-[var(--accent)] object-cover shadow-md"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--bg-hover)] text-[var(--accent)] border-2 border-[var(--accent)] shadow-md">
                <AccountCircleRoundedIcon sx={{ fontSize: 64 }} />
              </div>
            )}
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-[var(--bg-card)]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              {user?.username || "Guest User"}
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {user?.email || "No email available"}
            </p>
          </div>

          <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-[var(--accent)]">
            Member
          </span>
        </div>

        {/* Footer actions */}
        <div className="border-t border-[var(--border-color)] pt-4">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/10 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-500/20 active:scale-98"
          >
            <LogoutRoundedIcon fontSize="small" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
