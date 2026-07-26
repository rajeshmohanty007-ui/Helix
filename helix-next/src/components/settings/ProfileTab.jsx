"use client";

import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import { saveProfile, savePassword } from "@/ScriptFunc/settings";

export default function ProfileTab({
  initialUsername,
  initialEmail,
  profileError: parentProfileError,
  setProfileError: setParentProfileError,
  updateSession,
}) {
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
    </div>
  );
}
