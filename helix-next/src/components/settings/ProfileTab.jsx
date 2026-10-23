"use client";

import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import { signIn } from "next-auth/react";
import { saveProfile, savePassword } from "@/ScriptFunc/settings";
import GoogleIcon from "../ui/GoogleIcon";
import { useToast } from "../providers/ToastProvider";

export default function ProfileTab({
  initialUsername,
  initialEmail,
  profileError: parentProfileError,
  setProfileError: setParentProfileError,
  updateSession,
}) {
  const { showToast } = useToast();
  const [googleConnected, setGoogleConnected] = useState(false);
  const [lastGoogleSync, setLastGoogleSync] = useState(null);
  const [googleActionLoading, setGoogleActionLoading] = useState(false);

  useEffect(() => {
    async function checkGoogleStatus() {
      try {
        const res = await fetch("/api/calendar/google/sync");
        const data = await res.json();
        if (res.ok) {
          setGoogleConnected(Boolean(data.connected));
          setLastGoogleSync(data.lastSync);
        }
      } catch (err) {
        console.warn("Failed to check Google status in ProfileTab:", err);
      }
    }
    checkGoogleStatus();
  }, []);

  const handleDisconnectGoogle = async () => {
    setGoogleActionLoading(true);
    try {
      const res = await fetch("/api/calendar/google/sync", {
        method: "DELETE",
      });
      if (res.ok) {
        setGoogleConnected(false);
        setLastGoogleSync(null);
        showToast("Google Calendar disconnected", "success");
      }
    } catch (err) {
      showToast("Failed to disconnect Google Calendar", "error");
    } finally {
      setGoogleActionLoading(false);
    }
  };

  const handleConnectGoogle = () => {
    signIn("google", { callbackUrl: "/settings" });
  };
  const [username, setUsername] = useState(initialUsername || "");
  const [email, setEmail] = useState(initialEmail || "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState(parentProfileError || "");
  const [profileSuccess, setProfileSuccess] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Sync initial props
  useEffect(() => {
    if (initialUsername) setUsername(initialUsername);
    if (initialEmail) setEmail(initialEmail);
  }, [initialUsername, initialEmail]);

  const onSaveProfile = (e) => {
    e.preventDefault();
    saveProfile({
      username,
      email,
      setProfileSaving,
      setProfileError,
      setProfileSuccess,
      updateSession,
    });
  };

  const onSavePassword = (e) => {
    e.preventDefault();
    savePassword({
      currentPassword,
      newPassword,
      confirmPassword,
      setPasswordSaving,
      setPasswordError,
      setPasswordSuccess,
      setCurrentPassword,
      setNewPassword,
      setConfirmPassword,
    });
  };

  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <h3 className="text-lg font-bold text-[var(--text-primary)]">Profile Settings</h3>
        <p className="text-xs text-[var(--text-secondary)]">Modify account credentials, details, and email preferences</p>
      </div>

      {/* Avatar Generation Showcase */}
      <div className="flex items-center gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] p-4">
        <img
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${username || "Guest"}`}
          alt="Avatar"
          className="h-16 w-16 rounded-full border border-[var(--border-color)] bg-[var(--bg-hover)]"
        />
        <div>
          <h4 className="text-sm font-bold text-[var(--text-primary)]">Your Visual Avatar</h4>
          <p className="text-xs text-[var(--text-secondary)]">Automatically generated based on your current username seed.</p>
        </div>
      </div>

      {/* Personal Details Form */}
      <form onSubmit={onSaveProfile} className="space-y-4">
        <h4 className="text-sm font-semibold border-b border-[var(--border-color)] pb-2 text-[var(--text-primary)]">
          Personal Details
        </h4>

        {(profileError || parentProfileError) && (
          <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
            {profileError || parentProfileError}
          </p>
        )}

        {profileSuccess && (
          <p className="text-sm text-green-500 bg-green-500/10 p-3 rounded-xl border border-green-500/20">
            {profileSuccess}
          </p>
        )}

        <div>
          <label className="mb-2 block text-xs font-semibold text-[var(--text-primary)]">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (setParentProfileError) setParentProfileError("");
              setProfileError("");
            }}
            required
            className="w-full rounded-2xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)]"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-[var(--text-primary)]">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (setParentProfileError) setParentProfileError("");
              setProfileError("");
            }}
            required
            className="w-full rounded-2xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)]"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={profileSaving}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {profileSaving ? (
              <>
                <CircularProgress size={18} color="inherit" />
                Saving Profile...
              </>
            ) : (
              "Save Details"
            )}
          </button>
        </div>
      </form>

      {/* Password update section */}
      <form onSubmit={onSavePassword} className="space-y-4 pt-4">
        <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
          <LockRoundedIcon fontSize="small" className="text-[var(--text-secondary)]" />
          <h4 className="text-sm font-semibold text-[var(--text-primary)]">
            Security Credentials
          </h4>
        </div>

        {passwordError && (
          <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
            {passwordError}
          </p>
        )}

        {passwordSuccess && (
          <p className="text-sm text-green-500 bg-green-500/10 p-3 rounded-xl border border-green-500/20">
            {passwordSuccess}
          </p>
        )}

        <div>
          <label className="mb-2 block text-xs font-semibold text-[var(--text-primary)]">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-2xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)]"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold text-[var(--text-primary)]">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-2xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)]"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-[var(--text-primary)]">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-2xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)]"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={passwordSaving}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 py-3 text-sm font-semibold text-[var(--accent)] transition hover:bg-[var(--accent)]/25 disabled:opacity-50 cursor-pointer"
          >
            {passwordSaving ? (
              <>
                <CircularProgress size={18} color="primary" />
                Changing Password...
              </>
            ) : (
              "Change Password"
            )}
          </button>
        </div>
      </form>

      {/* Connected Integrations Section */}
      <div className="space-y-4 pt-2">
        <h4 className="text-sm font-semibold border-b border-[var(--border-color)] pb-2 text-[var(--text-primary)]">
          Connected Services & Integrations
        </h4>

        <div className="flex items-center justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] p-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 border border-white/10 shrink-0">
              <GoogleIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h5 className="text-sm font-bold text-[var(--text-primary)]">
                  Google Calendar
                </h5>
                {googleConnected && (
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                    Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {googleConnected
                  ? lastGoogleSync
                    ? `Last synchronized: ${new Date(lastGoogleSync).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                    : "Synchronizes events bidirectionally with Helix"
                  : "Connect your Google account to sync calendar schedules"}
              </p>
            </div>
          </div>

          <div>
            {googleConnected ? (
              <button
                type="button"
                onClick={handleDisconnectGoogle}
                disabled={googleActionLoading}
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition cursor-pointer disabled:opacity-50"
              >
                {googleActionLoading ? "Disconnecting..." : "Disconnect"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConnectGoogle}
                className="rounded-xl bg-violet-600 hover:bg-violet-500 px-4 py-2 text-xs font-semibold text-white transition cursor-pointer shadow-sm"
              >
                Connect
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
