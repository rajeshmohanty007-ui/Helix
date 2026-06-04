"use client";
import TaskListBar from "@/components/tasks/TaskListBar";
import TaskBar from "@/components/tasks/TaskBar";
import TaskDesc from "@/components/tasks/TaskDesc";

const tasks = [
  {
    id: 1,
    title:
      "Build authentication system with JWT, refresh tokens and role based access control",
    priority: "High",
    deadline: "Tomorrow",
    duration: "4 hrs",
  },
  {
    id: 2,
    title: "Create dashboard UI",
    priority: "Medium",
    deadline: "Jun 10",
    duration: "3 hrs",
  },
];
const task = {
  id: 1,
  title: "Build authentication system",
  description:
    "Implement JWT authentication with refresh tokens and role-based permissions.",
  priority: "High",
  deadline: "12 Jun 2026",
  duration: "4 Hours",
  completed: false,
  tags: ["React", "Backend", "Security"],
  subtasks: [
    { id: 1, title: "Create JWT middleware", completed: true },
    { id: 2, title: "Build login API", completed: false },
    { id: 3, title: "Build register API", completed: false },
  ],
};

export default function ProjectsPage() {
  return <div className="h-full flex-1 overflow-y-auto p-4">
          <div className="flex h-full flex-col gap-2 overflow-hidden rounded-2xl border border-(--border-color) bg-(--bg-main) p-4 shadow-md">
            <TaskListBar
              tasklists={["Daily", "College", "Freelance"]}
              active="College"
            />
            <div className="flex min-h-0 w-full flex-1">
              <TaskBar tasks={tasks} activeTask={1} />
              <TaskDesc task={task} />
            </div>
          </div>
        </div>;
}