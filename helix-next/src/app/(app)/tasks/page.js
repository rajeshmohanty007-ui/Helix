"use client";
import { useState, useEffect } from "react";
import TaskListBar from "@/components/tasks/TaskListBar";
import TaskBar from "@/components/tasks/TaskBar";
import TaskDesc from "@/components/tasks/TaskDesc";
import QuickTask from "@/components/tasks/QuickTask";
import AddTaskListModal from "@/components/tasks/AddTaskListModal";
import AddTaskModal from "@/components/tasks/AddTaskModal";

export default function TasksPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [activeTaskList, setActiveTaskList] = useState("Daily");
  const [taskLists, setTaskLists] = useState(["Quick Tasks", "Daily", "College", "Freelance"]);
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Load custom task lists from localStorage on mount
  useEffect(() => {
    if (!mounted) return;
    const savedLists = localStorage.getItem("custom_task_lists");
    const parsed = savedLists ? JSON.parse(savedLists) : [];
    
    // Combine defaults and custom lists
    const defaults = ["Quick Tasks", "Daily", "College", "Freelance"];
    const combined = Array.from(new Set([...defaults, ...parsed]));
    setTaskLists(combined);

    const savedActive = localStorage.getItem("taskList");
    if (savedActive && combined.includes(savedActive)) {
      setActiveTaskList(savedActive);
    }
  }, [mounted]);

  // Sync active task list to localstorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("taskList", activeTaskList);
    }
  }, [activeTaskList, mounted]);

  // Fetch tasks when active tab changes
  useEffect(() => {
    if (!mounted || activeTaskList === "Quick Tasks") {
      setTasks([]);
      setActiveTask(null);
      return;
    }

    setTasksLoading(true);
    fetch(`/api/tasks?list=${encodeURIComponent(activeTaskList)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTasks(data);
          if (data.length > 0) {
            setActiveTask(data[0]);
          } else {
            setActiveTask(null);
          }
        }
      })
      .catch((err) => console.error("Error loading tasks:", err))
      .finally(() => setTasksLoading(false));
  }, [activeTaskList, mounted]);

  const handleAddTaskList = (newListName) => {
    if (!taskLists.includes(newListName)) {
      const updated = [...taskLists, newListName];
      setTaskLists(updated);
      
      // Save custom list to localStorage (excluding default ones)
      const defaults = ["Quick Tasks", "Daily", "College", "Freelance"];
      const customOnly = updated.filter(list => !defaults.includes(list));
      localStorage.setItem("custom_task_lists", JSON.stringify(customOnly));
    }
    setActiveTaskList(newListName);
  };

  const handleTaskAdded = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
    setActiveTask(newTask);
  };

  const handleToggleTask = async (taskId, newCompleted) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: taskId, completed: newCompleted }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: newCompleted } : t))
      );

      if (activeTask && activeTask.id === taskId) {
        setActiveTask((prev) => ({ ...prev, completed: newCompleted }));
      }
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  const handleToggleSubtask = async (subtaskId, newCompleted) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subtaskId, completed: newCompleted }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setTasks((prev) =>
        prev.map((t) => {
          if (t.subtasks && t.subtasks.some((s) => s.id === subtaskId)) {
            return {
              ...t,
              subtasks: t.subtasks.map((s) =>
                s.id === subtaskId ? { ...s, completed: newCompleted } : s
              ),
            };
          }
          return t;
        })
      );

      if (activeTask && activeTask.subtasks) {
        setActiveTask((prev) => ({
          ...prev,
          subtasks: prev.subtasks.map((s) =>
            s.id === subtaskId ? { ...s, completed: newCompleted } : s
          ),
        }));
      }
    } catch (err) {
      console.error("Error toggling subtask:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`/api/tasks?id=${taskId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      if (activeTask && activeTask.id === taskId) {
        setActiveTask(null);
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleClearList = async (listName) => {
    try {
      const res = await fetch(`/api/tasks?list=${encodeURIComponent(listName)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to clear tasks");
      }

      if (activeTaskList === listName) {
        setTasks([]);
        setActiveTask(null);
      }
    } catch (err) {
      console.error("Error clearing list:", err);
    }
  };

  const handleDeleteList = async (listName) => {
    try {
      const res = await fetch(`/api/tasks?list=${encodeURIComponent(listName)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete list");
      }

      // Filter list out
      const updated = taskLists.filter((list) => list !== listName);
      setTaskLists(updated);

      // Sync custom lists to localStorage
      const defaults = ["Quick Tasks", "Daily", "College", "Freelance"];
      const customOnly = updated.filter((list) => !defaults.includes(list));
      localStorage.setItem("custom_task_lists", JSON.stringify(customOnly));

      // Redirect active tab if deleted
      if (activeTaskList === listName) {
        setActiveTaskList("Daily");
      }
    } catch (err) {
      console.error("Error deleting list:", err);
    }
  };

  return (
    <div className="h-full flex-1 overflow-y-auto p-4">
      <div className="flex h-full flex-col gap-2 overflow-hidden rounded-2xl border border-(--border-color) bg-(--bg-main) p-4 shadow-md">
        <TaskListBar
          tasklists={taskLists}
          active={activeTaskList}
          setActive={setActiveTaskList}
          onAddListClick={() => setIsListModalOpen(true)}
          onClearList={handleClearList}
          onDeleteList={handleDeleteList}
        />
        <div className="flex min-h-0 w-full flex-1">
          {activeTaskList === "Quick Tasks" ? (
            <QuickTask />
          ) : (
            <>
              <TaskBar
                tasks={tasks}
                activeTask={activeTask}
                onSelectTask={setActiveTask}
                onAddTaskClick={() => setIsTaskModalOpen(true)}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
              />
              <TaskDesc 
                task={activeTask} 
                onToggleSubtask={handleToggleSubtask} 
              />
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddTaskListModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onListAdded={handleAddTaskList}
      />
      <AddTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskList={activeTaskList}
        onTaskAdded={handleTaskAdded}
      />
    </div>
  );
}