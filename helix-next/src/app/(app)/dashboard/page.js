"use client";

import { useState, useEffect } from "react";
import Card1 from "@/components/ui/Card1";
import FolderIcon from "@mui/icons-material/Folder";
import Activity from "@/components/ui/Activity";
import Card2 from "@/components/ui/Card2";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { formatDate, formatElapsed } from "@/ScriptFunc/dashboard";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401 || res.status === 404) {
            import("next-auth/react").then(({ signOut }) => {
              signOut({ callbackUrl: "/" });
            });
          }
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading dashboard details:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    document.title = "Dashboard | Helix";
  }, []);



  if (loading) {
    return <LoadingScreen fullScreen={true} />;
  }

  if (!data || data.error || !data.user) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-(--bg-main)">
        <p className="text-[var(--text-secondary)] italic">{data?.error || "Failed to load dashboard data."}</p>
      </div>
    );
  }

  const { user, stats, activity, recentActivities } = data;

  return (
    <div className="flex-1 overflow-y-auto helix-scroll">
      <div className="m-4 flex flex-col gap-8 rounded-2xl border border-(--border-color) bg-(--bg-card) p-4 shadow-md">
        {/* Greetings */}
        <div className="flex flex-col gap-2 justify-between md:flex-row md:items-center">
          <div>
            <p className="text-2xl font-semibold text-(--text-primary)">
              Hello, {user.username}
            </p>
            <p className="text-xl text-(--text-primary)">
              You have {stats.remainingTasks} tasks remaining
            </p>
            <p className="text-[var(--text-secondary)] text-sm">Date : {formatDate()}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <p className="rounded-2xl border border-(--border-color) bg-(--bg-main) px-4 py-2 shadow-sm text-sm font-medium">
              <b className="text-(--text-primary)">{user.streak}</b> days Streak 🔥
            </p>
            <p className="rounded-2xl border border-(--border-color) bg-(--bg-main) px-4 py-2 shadow-sm text-sm font-medium">
              Productivity Score : <b className="text-[var(--accent)]">{user.productivityScore}</b>
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card1
            title="Active Projects"
            value={stats.activeProjects}
            growth="0"
            icon={<FolderIcon fontSize="medium" />}
          />
          <Card1
            title="Completed Projects"
            value={stats.completedProjects}
            growth="0"
            icon={<FolderIcon fontSize="medium" />}
          />
          <Card1
            title="Tasks Due"
            value={stats.remainingTasks}
            growth="0"
            icon={<FolderIcon fontSize="medium" />}
          />
        </div>

        {/* Activity Component */}
        <div>
          <Activity
            progress={activity.progress}
            completedTasks={activity.completedTasks}
            totalTasks={activity.totalTasks}
            deadlineTask={activity.deadlineTask}
            deadlineTime={activity.deadlineTime}
            upcomingEvents={activity.upcomingEvents}
          />
        </div>

        {/* Recent Activities */}
        <div>
          <h1 className="font-bold text-2xl text-(--accent) mb-4">Recent Activities</h1>
          {recentActivities.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)] py-8 italic text-center">
              No recent project activity found.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {recentActivities.map((act) => (
                <Card2
                  key={act.id}
                  profile={`https://api.dicebear.com/7.x/initials/svg?seed=${act.username}`}
                  username={act.username}
                  relation={act.projectName}
                  action={act.action}
                  description={act.description}
                  time={formatElapsed(act.createdAt)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}