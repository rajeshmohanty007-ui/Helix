"use client";
import { useState, useEffect, useRef } from "react";
import Card3 from "@/components/ui/Card3";
import Card4 from "@/components/ui/Card4";
import Chats from "@/components/projects/Chats";
import ObjectivesSec from "@/components/projects/ObjectivesSec";
import UpdatesSec from "@/components/projects/UpdatesSec";
import SeeMore from "@/components/ui/SeeMore";
import MobileNav from "@/components/layouts/MobileNav";
import AddUpdateModal from "@/components/projects/AddUpdateModal";
import AddObjectiveModal from "@/components/projects/AddObjectiveModal";

import { dummyChats } from "./dumChats";
import {
  Add,
  Search,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
} from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";

const ProjectSide = ({
  collapsed,
  setCollapsed,
  activeProj,
  setActiveProj,
  projects = [],
}) => {
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
            className={`relative flex w-full items-center gap-3 px-3 py-3 text-left transition ${!collapsed && activeProj?.id === project.id ? "rounded-xl bg-(--accent) text-white" : ""} ${activeProj?.id !== project.id ? "rounded-xl hover:bg-(--bg-hover)" : ""}`}
            onClick={() => setActiveProj(project)}
          >
            {collapsed && activeProj?.id === project.id && (
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

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [activeProj, setActiveProj] = useState(null);

  const [updates, setUpdates] = useState([]);
  const [updatesLoading, setUpdatesLoading] = useState(false);
  const [objectives, setObjectives] = useState([]);
  const [objectivesLoading, setObjectivesLoading] = useState(false);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isObjectiveModalOpen, setIsObjectiveModalOpen] = useState(false);

  const [mobileTab, setMobileTab] = useState("updates");
  const [projColl, setProjColl] = useState(true);
  
  const [leftWidth, setLeftWidth] = useState(33);
  const [middleWidth, setMiddleWidth] = useState(34);

  // Fetch projects
  useEffect(() => {
    if (!mounted) return;
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
          
          const savedProjId = localStorage.getItem("activeProjId");
          let initialProj = null;
          if (savedProjId) {
            initialProj = data.find((p) => p.id === savedProjId);
          }
          if (!initialProj && data.length > 0) {
            initialProj = data[0];
          }
          setActiveProj(initialProj);
        }
      })
      .catch((err) => console.error("Error loading projects:", err))
      .finally(() => setProjectsLoading(false));
  }, [mounted]);

  // Sync activeProj selection to localstorage
  useEffect(() => {
    if (activeProj?.id) {
      localStorage.setItem("activeProjId", activeProj.id);
    }
  }, [activeProj]);

  // Load updates & objectives when activeProj changes
  useEffect(() => {
    if (!activeProj?.id) return;

    setUpdatesLoading(true);
    fetch(`/api/projects/${activeProj.id}/updates`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUpdates(data);
        }
      })
      .catch((err) => console.error("Error fetching updates:", err))
      .finally(() => setUpdatesLoading(false));

    setObjectivesLoading(true);
    fetch(`/api/projects/${activeProj.id}/objectives`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setObjectives(data);
        }
      })
      .catch((err) => console.error("Error fetching objectives:", err))
      .finally(() => setObjectivesLoading(false));
  }, [activeProj?.id]);

  const handleUpdateAdded = (newUpdate) => {
    setUpdates((prev) => [newUpdate, ...prev]);
  };

  const handleObjectiveAdded = (newObjective) => {
    setObjectives((prev) => [newObjective, ...prev]);
  };

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

  return (
    <div className="relative flex h-full flex-1">
      <ProjectSide
        collapsed={projColl}
        setCollapsed={setProjColl}
        activeProj={activeProj}
        setActiveProj={setActiveProj}
        projects={projects}
      />
      {!projColl && (
        <div
          className="fixed inset-0 z-19 bg-black/40 lg:hidden"
          onClick={() => setProjColl(true)}
        />
      )}
      <div className="ml-16 flex min-h-0 flex-1 flex-col p-2 lg:ml-0">
        <h1 className="w-full p-4 text-center text-2xl font-bold text-(--accent)">
          {projectsLoading ? "Loading..." : (activeProj?.name || "Select a Project")}
        </h1>
        <div
          ref={containerRef}
          className="flex min-h-0 flex-1 rounded-t-2xl border border-(--border-color) backdrop-blur-lg"
        >
          <div className="hidden h-full w-full lg:flex">
            {/* Updates Section */}
            <div
              style={{ width: `${leftWidth}%` }}
              className="flex h-full min-w-0 flex-col"
            >
              <h1 className="sticky top-0 w-full p-2 text-center text-lg font-semibold text-(--accent)">
                Updates
              </h1>
              <button
                onClick={() => activeProj && setIsUpdateModalOpen(true)}
                disabled={!activeProj}
                className="m-1 rounded-lg bg-(--accent) p-2 text-white hover:opacity-90 disabled:opacity-50 transition active:scale-98"
              >
                Add an Update
              </button>
              <div className="helix-scroll min-h-0 flex-1 overflow-y-auto p-2">
                {updatesLoading ? (
                  <div className="flex justify-center p-4">
                    <CircularProgress size={24} />
                  </div>
                ) : updates.length === 0 ? (
                  <p className="text-center text-sm text-[var(--text-secondary)] py-8">
                    No updates yet.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {updates.map((update) => (
                      <Card3
                        key={update.id}
                        profile={`https://api.dicebear.com/7.x/initials/svg?seed=${update.user.username}`}
                        username={update.user.username}
                        action={update.action}
                        timestamp={
                          new Date(update.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          }) +
                          " - " +
                          new Date(update.createdAt).toLocaleDateString()
                        }
                        content={update.content}
                      />
                    ))}
                  </div>
                )}
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

            {/* Objectives Section */}
            <div
              style={{ width: `${middleWidth}%` }}
              className="flex h-full min-w-0 flex-col"
            >
              <h1 className="sticky top-0 w-full p-2 text-center text-lg font-semibold text-(--accent)">
                Objectives
              </h1>
              <button
                onClick={() => activeProj && setIsObjectiveModalOpen(true)}
                disabled={!activeProj}
                className="m-1 rounded-lg bg-(--accent) p-2 text-white hover:opacity-90 disabled:opacity-50 transition active:scale-98"
              >
                Add an Objective
              </button>
              <div className="helix-scroll min-h-0 flex-1 overflow-y-auto p-2">
                {objectivesLoading ? (
                  <div className="flex justify-center p-4">
                    <CircularProgress size={24} />
                  </div>
                ) : objectives.length === 0 ? (
                  <p className="text-center text-sm text-[var(--text-secondary)] py-8">
                    No objectives yet.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {objectives.map((obj) => (
                      <Card4
                        key={obj.id}
                        title={obj.title}
                        deadline={obj.deadline}
                        status={obj.status}
                        members={obj.members.map((m) => ({
                          name: m.username,
                          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${m.username}`,
                        }))}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div
              className="group relative w-2 cursor-col-resize"
              onMouseDown={(e) => startResize(e, "middle")}
            >
              <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-(--border-color) group-hover:bg-(--accent)" />
            </div>

            {/* Chats Section */}
            <div
              className="flex h-full min-w-0 flex-col"
              style={{ width: `${100 - middleWidth - leftWidth}%` }}
            >
              <h1 className="sticky top-0 w-full p-2 text-center text-lg font-semibold text-(--accent)">
                Chats
              </h1>
              <div className="min-h-0 min-w-0 flex-1">
                <Chats data={dummyChats} activeProj={activeProj} />
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="flex h-full w-full flex-col lg:hidden">
            <div className="min-h-0 flex-1">
              {mobileTab === "updates" && (
                <UpdatesSec
                  updates={updates}
                  loading={updatesLoading}
                  onAddClick={() => activeProj && setIsUpdateModalOpen(true)}
                />
              )}

              {mobileTab === "objectives" && (
                <ObjectivesSec
                  objectives={objectives}
                  loading={objectivesLoading}
                  onAddClick={() => activeProj && setIsObjectiveModalOpen(true)}
                />
              )}

              {mobileTab === "chats" && <Chats data={dummyChats} />}
            </div>

            <MobileNav active={mobileTab} setActive={setMobileTab} />
          </div>
        </div>
      </div>

      {/* Forms Modals */}
      {activeProj && (
        <>
          <AddUpdateModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            projectId={activeProj.id}
            onUpdateAdded={handleUpdateAdded}
          />
          <AddObjectiveModal
            isOpen={isObjectiveModalOpen}
            onClose={() => setIsObjectiveModalOpen(false)}
            projectId={activeProj.id}
            onObjectiveAdded={handleObjectiveAdded}
          />
        </>
      )}
    </div>
  );
}