"use client";
import { useState, useEffect } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

const Profile = dynamic(() => import("../ui/Profile"), {
  ssr: false,
});

const links = [
  {href: "/dashboard", title: "Dashboard",sec:"Home"},
  {href: "/tasks", title: "Tasks",sec:"task"},
  {href: "/projects", title: "Projects",sec:"proj"},
  {href: "/calendar", title: "Calendar",sec:"cal"},
];

export default function AppShell({ children }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Background notifications polling and desktop push
  useEffect(() => {
    if (!session?.user || typeof window === "undefined" || !("Notification" in window)) return;

    const notifiedIds = new Set();

    // Populate historical notification IDs so we don't spam desktop alerts on initial load
    const loadExistingNotificationIds = async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (Array.isArray(data)) {
          data.forEach((item) => notifiedIds.add(item.id));
        }
      } catch (err) {
        console.warn("Failed initial notifications load in AppShell:", err);
      }
    };

    loadExistingNotificationIds();

    // Set polling interval for checking new alerts
    const interval = setInterval(async () => {
      if (Notification.permission !== "granted") return;

      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (!Array.isArray(data)) return;

        // Fetch user preferences and dismissed IDs to respect user rules
        const notifyTask = localStorage.getItem("notify-task") !== "false";
        const notifyProject = localStorage.getItem("notify-project") !== "false";
        const notifyEvent = localStorage.getItem("notify-event") !== "false";
        const notifySystem = localStorage.getItem("notify-system") !== "false";

        const storedDismissed = localStorage.getItem("dismissed-notifications");
        let dismissedList = [];
        if (storedDismissed) {
          try {
            dismissedList = JSON.parse(storedDismissed);
          } catch (e) {}
        }

        data.forEach((item) => {
          if (notifiedIds.has(item.id)) return;
          if (dismissedList.includes(item.id)) return;

          // Respect client toggle configurations
          if (item.type === "task" && !notifyTask) return;
          if (item.type === "project" && !notifyProject) return;
          if (item.type === "event" && !notifyEvent) return;
          if (item.type === "system" && !notifySystem) return;

          // Push browser notification!
          new Notification(item.title || "Helix Notification", {
            body: item.message,
            icon: "/helix_logo.svg",
          });

          notifiedIds.add(item.id);
        });
      } catch (err) {
        console.warn("Error running background notification polling:", err);
      }
    }, 15000); // Check every 15s

    return () => clearInterval(interval);
  }, [session]);
  
  const [sideColl, setSideColl] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("collapsed");

    if (saved !== null) {
      setSideColl(saved === "true");
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("collapsed", sideColl);
  }, [sideColl]);

  const isChatPage = /^\/projects\/[^/]+\/chat$/.test(pathname || "");
  const isProjectSettingsPage = /^\/projects\/[^/]+\/settings$/.test(pathname || "");
  const isMainSettingsPage = pathname === "/settings";
  const isSidebarHidden = isChatPage || isProjectSettingsPage || isMainSettingsPage;
  const currentLink = links.find(link => link.href === pathname);
  const currentTitle = isChatPage 
    ? "Project Chat" 
    : isProjectSettingsPage 
      ? "Project Settings" 
      : isMainSettingsPage 
        ? "Helix Settings" 
        : pathname === "/notifications"
          ? "Notifications"
          : (currentLink?.title || "Dashboard");
  const currentSec = isSidebarHidden ? "proj" : (currentLink?.sec || "Home");
  return (
    <main className="bg-(--bg-main) text-(--text-primary) overflow-hidden">
      <Topbar title={currentTitle} onProfileClick={() => setIsProfileOpen(true)} />
      <section className="relative mt-16 flex w-full justify-start workspace-height">
        {!isSidebarHidden && (
          <Sidebar
            collapsed={sideColl}
            setCollapsed={setSideColl}
            sec={currentSec}
            onProfileClick={() => setIsProfileOpen(true)}
          />
        )}
        {!sideColl && !isSidebarHidden && (
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setSideColl(true)}
          />
        )}
        {children}
      </section>
      {isProfileOpen && <Profile onClose={() => setIsProfileOpen(false)} />}
    </main>
  );
}
