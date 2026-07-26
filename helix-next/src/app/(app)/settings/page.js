"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "@/context/ThemeContext";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import SettingsSidebar from "@/components/settings/SettingsSidebar";
import ProfileTab from "@/components/settings/ProfileTab";
import AppearanceTab from "@/components/settings/AppearanceTab";
import NotificationsTab from "@/components/settings/NotificationsTab";

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { mounted } = useTheme();

  // Page level tabs and states
  const [activeTab, setActiveTab] = useState("profile"); // "profile", "appearance", or "notifications"
  const [mobileShowActions, setMobileShowActions] = useState(false);
  const [loading, setLoading] = useState(true);

  // Profile fields loaded from server API
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileError, setProfileError] = useState("");

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Fetch complete profile on authenticated status
  useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchProfile() {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setUsername(data.username || "");
        setEmail(data.email || "");
      } catch (err) {
        setProfileError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [status]);

  if (loading || status === "loading" || !mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-(--bg-main)">
        <CircularProgress size={40} className="text-(--accent)" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-(--bg-main) p-4">
      {/* Top Header Row */}
      <div className="mb-4 flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowBackRoundedIcon />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              Helix Settings
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">Manage your account profile, themes, preferences, and details</p>
          </div>
        </div>
      </div>

      {/* Settings Panel Container */}
      <div className="flex min-h-0 flex-1 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-md">
        
        {/* Left Side Settings Sidebar */}
        <SettingsSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileShowActions={mobileShowActions}
          setMobileShowActions={setMobileShowActions}
        />

        {/* Right Side Category Action Content Panel */}
        <div
          className={`h-full flex-1 flex-col overflow-y-auto helix-scroll p-6 md:flex ${
            mobileShowActions ? "flex" : "hidden"
          }`}
        >
          {/* Mobile Back navigation */}
          <div className="mb-4 flex items-center md:hidden">
            <button
              onClick={() => setMobileShowActions(false)}
              className="flex items-center gap-2 text-sm font-semibold text-[var(--accent)] cursor-pointer"
            >
              <ArrowBackRoundedIcon fontSize="small" />
              Back to categories
            </button>
          </div>

          {/* TAB 1: Profile & Account Settings */}
          {activeTab === "profile" && (
            <ProfileTab
              initialUsername={username}
              initialEmail={email}
              profileError={profileError}
              setProfileError={setProfileError}
              updateSession={update}
            />
          )}

          {/* TAB 2: Appearance & Theme Settings */}
          {activeTab === "appearance" && <AppearanceTab />}

          {/* TAB 3: Notification Settings */}
          {activeTab === "notifications" && <NotificationsTab />}
        </div>
      </div>
    </div>
  );
}
