"use client";
import { useState, useEffect } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

export default function AppShell({ children }) {
  const [mounted, setMounted] = useState(false);

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
  return (
    <main className="bg-(--bg-main) text-(--text-primary) overflow-hidden">
      <Topbar title="Dashboard" />
      <section className="relative mt-16 flex w-full justify-start workspace-height">
        <Sidebar collapsed={sideColl} setCollapsed={setSideColl} sec="Home" />
        {!sideColl && (
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setSideColl(true)}
          />
        )}
        {children}
      </section>
    </main>
  );
}
