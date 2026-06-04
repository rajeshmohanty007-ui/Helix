"use client";
import { useState, useEffect, useRef } from "react";
import Card3 from "@/components/ui/Card3";
import Card4 from "@/components/ui/Card4";
import Chats from "@/components/projects/Chats";
import ObjectivesSec from "@/components/projects/ObjectivesSec";
import UpdatesSec from "@/components/projects/UpdatesSec";
import SeeMore from "@/components/ui/SeeMore";
import MobileNav from "@/components/layouts/MobileNav";

import { dummyChats } from "./dumChats";
import {
  Add,
  Search,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
} from "@mui/icons-material";

const ProjectSide = ({
  collapsed,
  setCollapsed,
  activeProj,
  setActiveProj,
}) => {
  const projects = [
    { id: 1, name: "Helix", status: "active" },
    { id: 2, name: "Portfolio", status: "active" },
    { id: 3, name: "Game Engine", status: "paused" },
  ];

  return (
    <aside
      className={`absolute flex flex-col top-0 left-0 z-25 h-full rounded-r-4xl border-r border-(--border-color) bg-(--bg-sidebar) transition-all duration-300 lg:relative ${collapsed ? "w-16" : "w-72"} `}
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

        <button className="rounded-lg p-2 hover:bg-(--bg-hover)">
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
          <button
            key={project.id}
            className={`relative flex w-full items-center gap-3 px-3 py-3 text-left transition ${!collapsed && activeProj === project.name ? "rounded-xl bg-(--accent) text-white" : ""} ${activeProj !== project.name ? "rounded-xl hover:bg-(--bg-hover)" : ""}`}
            onClick={() => setActiveProj(project.name)}
          >
            {collapsed && activeProj === project.name && (
              <span className="absolute top-0 left-0 h-full w-0.5 bg-(--accent)" />
            )}
            {/* Status Dot */}
            <span
              className={`h-4 w-4 rounded-full ${
                project.status === "active" ? "bg-green-500" : "bg-yellow-500"
              } `}
            />

            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-medium">{project.name}</span>

                <span className="text-xs opacity-60">{project.status}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default function ProjectsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [mobileTab, setMobileTab] = useState("updates");
  const [projColl, setProjColl] = useState(true);
  const [activeProj, setActiveProj] = useState(() => {
    const saved = localStorage.getItem("activeProj");
    return saved ? saved : "";
  });
  const [leftWidth, setLeftWidth] = useState(33);
  const [middleWidth, setMiddleWidth] = useState(34);

  useEffect(() => {
    localStorage.setItem("activeProj", activeProj);
  }, [activeProj]);

  const containerRef = useRef(null);

  const startResize = (e, section) => {
    e.preventDefault();

    const move = (event) => {
      const container = containerRef.current;

      const rect = container.getBoundingClientRect();

      const x = event.clientX - rect.left;

      const percent = (x / rect.width) * 100;

      if (section === "left") {
        const maxLeft = 100 - middleWidth - 20;

        setLeftWidth(Math.min(Math.max(percent, 15), maxLeft));
      }

      if (section === "middle") {
        const newMiddle = percent - leftWidth;
        const maxMiddle = 100 - leftWidth - 20;

        setMiddleWidth(Math.min(Math.max(newMiddle, 15), maxMiddle));
      }
    };

    const stop = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", stop);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);
  };
  return <div className="relative flex h-full flex-1">
          <ProjectSide
            collapsed={projColl}
            setCollapsed={setProjColl}
            activeProj={activeProj}
            setActiveProj={setActiveProj}
          />
          {!projColl && (
            <div
              className="fixed inset-0 z-19 bg-black/40 lg:hidden"
              onClick={() => setProjColl(true)}
            />
          )}
          <div className="ml-16 flex min-h-0 flex-1 flex-col p-2 lg:ml-0">
            <h1 className="w-full p-4 text-center text-2xl font-bold text-(--accent)">
              {activeProj}
            </h1>
            <div
              ref={containerRef}
              className="flex min-h-0 flex-1 rounded-t-2xl border border-(--border-color) backdrop-blur-lg"
            >
              <div className="hidden h-full w-full lg:flex">
                <div
                  style={{ width: `${leftWidth}%` }}
                  className="flex h-full min-w-0 flex-col"
                >
                  <h1 className="sticky top-0 w-full p-2 text-center text-lg font-semibold text-(--accent)">
                    Updates
                  </h1>
                  <button className="m-1 rounded-lg bg-(--accent) p-2 text-white">
                    Add an Update
                  </button>
                  <div className="helix-scroll min-h-0 flex-1 overflow-y-auto p-2">
                    <div className="flex flex-col gap-2">
                      <Card3
                        profile=""
                        username="Rajesh"
                        action="completed"
                        timestamp="5 minutes ago"
                        content="Implemented JWT authentication and protected routes."
                      />
                      <Card3
                        profile="https://i.pravatar.cc/100?img=8"
                        username="Aman"
                        action="started"
                        timestamp="20 minutes ago"
                        content="Started building the real-time chat system."
                      />
                      <Card3
                        profile="https://i.pravatar.cc/100?img=11"
                        username="Sarah"
                        action="blocked"
                        timestamp="1 hour ago"
                        content="Waiting for database migration approval."
                      />
                      <Card3
                        profile="https://i.pravatar.cc/100?img=15"
                        username="John"
                        action="updated"
                        timestamp="2 hours ago"
                        content="Updated the project roadmap and sprint goals."
                      />
                    </div>
                    <div className="flex justify-center py-2">
                      <SeeMore />
                    </div>
                  </div>
                </div>
                <div
                  className="group relative w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "left")}
                >
                  <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-(--border-color) group-hover:bg-(--accent)" />
                </div>
                <div
                  style={{ width: `${middleWidth}%` }}
                  className="flex h-full min-w-0 flex-col"
                >
                  <h1 className="sticky top-0 w-full p-2 text-center text-lg font-semibold text-(--accent)">
                    Objectives
                  </h1>
                  <button className="m-1 rounded-lg bg-(--accent) p-2 text-white">
                    Add an Objective
                  </button>
                  <div className="helix-scroll min-h-0 flex-1 overflow-y-auto p-2">
                    <div className="flex flex-col gap-2">
                      <Card4
                        title="Complete Authentication System"
                        deadline="June 15, 2026"
                        status="progress"
                        members={[
                          {
                            name: "Rajesh",
                            avatar: "https://i.pravatar.cc/100?img=5",
                          },
                          {
                            name: "Aman",
                            avatar: "https://i.pravatar.cc/100?img=8",
                          },
                        ]}
                      />
                      <Card4
                        title="Launch Beta Version"
                        deadline="July 1, 2026"
                        status="pending"
                        members={[
                          {
                            name: "Sarah",
                            avatar: "https://i.pravatar.cc/100?img=11",
                          },
                        ]}
                      />
                      <Card4
                        title="Real-time Chat Module"
                        deadline="June 10, 2026"
                        status="blocked"
                        members={[
                          {
                            name: "John",
                            avatar: "https://i.pravatar.cc/100?img=15",
                          },
                          {
                            name: "Rajesh",
                            avatar: "https://i.pravatar.cc/100?img=5",
                          },
                        ]}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="group relative w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "middle")}
                >
                  <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-(--border-color) group-hover:bg-(--accent)" />
                </div>
                <div
                  className="flex h-full min-w-0 flex-col"
                  style={{ width: `${100 - middleWidth - leftWidth}%` }}
                >
                  <h1 className="sticky top-0 w-full p-2 text-center text-lg font-semibold text-(--accent)">
                    Chats
                  </h1>
                  <div className="min-h-0 min-w-0 flex-1">
                    <Chats data={dummyChats} />
                  </div>
                </div>
              </div>
              <div className="flex h-full w-full flex-col lg:hidden">
                <div className="min-h-0 flex-1">
                  {mobileTab === "updates" && <UpdatesSec />}

                  {mobileTab === "objectives" && <ObjectivesSec />}

                  {mobileTab === "chats" && <Chats data={dummyChats} />}
                </div>

                <MobileNav active={mobileTab} setActive={setMobileTab} />
              </div>
            </div>
          </div>
        </div>;
}