"use client";
import { useState, useEffect } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const Profile = dynamic(() => import("../ui/Profile"), {
  ssr: false,
});

const links = [
  {href: "/dashboard", title: "Dashboard",sec:"Home"},
  {href: "/tasks", title: "Tasks",sec:"proj"},
  {href: "/projects", title: "Projects",sec:"task"},
  {href: "/calendar", title: "Calendar",sec:"cal"},
]

export default function AppShell({ children }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
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
  const currentLink = links.find(link => link.href === pathname);
  const currentTitle = isChatPage ? "Project Chat" : (currentLink?.title || "Dashboard");
  const currentSec = isChatPage ? "proj" : (currentLink?.sec || "Home");
  return (
    <main className="bg-(--bg-main) text-(--text-primary) overflow-hidden">
      <Topbar title={currentTitle} />
      <section className="relative mt-16 flex w-full justify-start workspace-height">
        {!isChatPage && (
          <Sidebar
            collapsed={sideColl}
            setCollapsed={setSideColl}
            sec={currentSec}
            onProfileClick={() => setIsProfileOpen(true)}
          />
        )}
        {!sideColl && !isChatPage && (
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
