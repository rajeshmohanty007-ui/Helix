"use client";
import { useState, useEffect } from "react";
import TaskListBar from "@/components/tasks/TaskListBar";
import TaskBar from "@/components/tasks/TaskBar";
import TaskDesc from "@/components/tasks/TaskDesc";
import QuickTask from "@/components/tasks/QuickTask";
import AddTaskListModal from "@/components/tasks/AddTaskListModal";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import {
  toggleTask,
  toggleSubtask,
  deleteTask,
  clearList,
  deleteList,
} from "@/ScriptFunc/tasks";

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
  const [mobileShowDesc, setMobileShowDesc] = useState(false);

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

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
      setMobileShowDesc(false);
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
          setMobileShowDesc(false);
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

  const handleTaskSaved = (savedTask) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === savedTask.id);
      if (exists) {
        return prev.map((t) => (t.id === savedTask.id ? savedTask : t));
      } else {
        return [savedTask, ...prev];
      }
    });
    setActiveTask(savedTask);
  };

  const handleToggleTask = async (taskId, newCompleted) => {
    await toggleTask(taskId, newCompleted, setTasks, activeTask, setActiveTask);
  };

  const handleToggleSubtask = async (subtaskId, newCompleted) => {
    await toggleSubtask(subtaskId, newCompleted, setTasks, activeTask, setActiveTask);
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId, setTasks, activeTask, setActiveTask);
    setMobileShowDesc(false);
  };

  const handleClearList = async (listName) => {
    await clearList(listName, activeTaskList, setTasks, setActiveTask);
  };

  const handleDeleteList = async (listName) => {
    await deleteList(listName, activeTaskList, setActiveTaskList, taskLists, setTaskLists);
  };

  useEffect(() => {
    if (activeTaskList) {
      document.title = `${activeTaskList} Tasks | Helix`;
    } else {
      document.title = "Tasks | Helix";
    }
  }, [activeTaskList]);

  return (
    <div className="h-full flex-1 overflow-y-auto p-4">
      <div className="flex h-full flex-col gap-2 overflow-hidden rounded-2xl border border-(--border-color) bg-(--bg-main) p-4 shadow-md">
        <div className={mobileShowDesc ? "hidden md:block" : "block"}>
          <TaskListBar
            tasklists={taskLists}
            active={activeTaskList}
            setActive={setActiveTaskList}
            onAddListClick={() => setIsListModalOpen(true)}
            onClearList={handleClearList}
            onDeleteList={handleDeleteList}
          />
        </div>
        <div className="flex min-h-0 w-full flex-1">
          {activeTaskList === "Quick Tasks" ? (
            <QuickTask />
          ) : (
            <>
              <TaskBar
                tasks={tasks}
                activeTask={activeTask}
                onSelectTask={(task) => {
                  setActiveTask(task);
                  setMobileShowDesc(true);
                }}
                onAddTaskClick={() => {
                  setTaskToEdit(null);
                  setIsTaskModalOpen(true);
                }}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                className={mobileShowDesc ? "hidden md:flex" : "flex"}
              />
              <TaskDesc 
                task={activeTask} 
                onToggleSubtask={handleToggleSubtask} 
                onBack={() => setMobileShowDesc(false)}
                onEdit={(task) => {
                  setTaskToEdit(task);
                  setIsTaskModalOpen(true);
                }}
                onDelete={handleDeleteTask}
                className={mobileShowDesc ? "flex" : "hidden md:flex"}
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
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        taskList={activeTaskList}
        onTaskAdded={handleTaskSaved}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}