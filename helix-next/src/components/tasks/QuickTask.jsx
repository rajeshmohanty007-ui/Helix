"use client";

import { useState, useEffect } from "react";
import {
  CheckRounded,
  UndoRounded,
  DeleteOutlineRounded,
  AddRounded,
  FormatListBulletedRounded,
  CheckCircleOutlineRounded,
  ClearAllRounded,
} from "@mui/icons-material";

export default function QuickTask() {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("todo"); // "todo" or "completed"
  const [inputVal, setInputVal] = useState("");
  const [animatingId, setAnimatingId] = useState(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("helix_quick_tasks");
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save to local storage
  const saveTasks = (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem("helix_quick_tasks", JSON.stringify(newTasks));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      title: inputVal.trim(),
      completed: activeTab === "completed", // add directly to active list
    };
    saveTasks([...tasks, newTask]);
    setInputVal("");
  };

  const handleCheckboxClick = (id) => {
    // Trigger animation
    setAnimatingId(id);
    // Wait for animation to finish
    setTimeout(() => {
      const updated = tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      saveTasks(updated);
      setAnimatingId(null);
    }, 450);
  };

  const undoCompletedTask = (id) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: false } : t
    );
    saveTasks(updated);
  };

  const deleteTask = (id) => {
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
  };

  const clearCompleted = () => {
    const updated = tasks.filter((t) => !t.completed);
    saveTasks(updated);
  };

  const todoTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="flex h-full w-full flex-col justify-between p-2 overflow-hidden">
      {/* Header and Toggle Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3 mb-3">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Quick Tasks</h2>
          <p className="text-xs text-[var(--text-secondary)]">Lightweight name-only tracking board</p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-[var(--bg-main)] p-1 rounded-2xl border border-[var(--border-color)] self-start sm:self-center shadow-xs">
          <button
            onClick={() => setActiveTab("todo")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === "todo"
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <FormatListBulletedRounded sx={{ fontSize: 16 }} />
            To Do
            {todoTasks.length > 0 && (
              <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${activeTab === "todo" ? "bg-white/20 text-white" : "bg-[var(--border-color)] text-[var(--text-secondary)]"}`}>
                {todoTasks.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === "completed"
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <CheckCircleOutlineRounded sx={{ fontSize: 16 }} />
            Completed
            {completedTasks.length > 0 && (
              <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${activeTab === "completed" ? "bg-white/20 text-white" : "bg-[var(--border-color)] text-[var(--text-secondary)]"}`}>
                {completedTasks.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0 helix-scroll pb-2">
        {activeTab === "todo" ? (
          /* TO DO VIEW: Gallery Grid / List on mobile */
          todoTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-sm text-[var(--text-secondary)] italic">All quick tasks finished. Good job!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {todoTasks.map((task) => {
                const isAnimating = animatingId === task.id;
                return (
                  <div
                    key={task.id}
                    onClick={() => !isAnimating && handleCheckboxClick(task.id)}
                    className={`
                      relative group border bg-[var(--bg-card)] p-4 rounded-2xl flex items-start gap-3 shadow-xs transition-all duration-300 cursor-pointer
                      ${isAnimating 
                        ? "opacity-0 scale-95 -translate-y-2 border-green-500/40 bg-green-500/5 duration-500" 
                        : "border-[var(--border-color)] hover:border-[var(--accent)] hover:shadow-md"
                      }
                    `}
                  >
                    {/* Custom Checkbox */}
                    <div className="flex items-center justify-center pt-0.5 shrink-0">
                      <div
                        className={`h-5 w-5 rounded-full border flex items-center justify-center transition ${
                          isAnimating
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-[var(--text-secondary)] hover:border-[var(--accent)] group-hover:scale-105"
                        }`}
                      >
                        {isAnimating && <CheckRounded sx={{ fontSize: 14 }} />}
                      </div>
                    </div>

                    {/* Task Title */}
                    <span
                      className={`text-sm font-medium transition-all duration-300 break-words flex-1 pr-4 select-none ${
                        isAnimating
                          ? "line-through text-[var(--text-secondary)]"
                          : "text-[var(--text-primary)]"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* COMPLETED VIEW */
          <div className="flex flex-col h-full">
            {completedTasks.length > 0 && (
              <div className="flex justify-end mb-3">
                <button
                  onClick={clearCompleted}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/20 text-red-500 text-xs font-semibold hover:bg-red-500/10 active:scale-95 transition cursor-pointer"
                >
                  <ClearAllRounded sx={{ fontSize: 16 }} />
                  Clear Completed
                </button>
              </div>
            )}

            {completedTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-sm text-[var(--text-secondary)] italic">No completed quick tasks found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="border border-[var(--border-color)] bg-[var(--bg-card)]/60 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-xs hover:border-[var(--border-color)]/80 transition group"
                  >
                    <span className="text-sm font-medium text-[var(--text-secondary)] line-through break-words flex-1 pr-2">
                      {task.title}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition duration-200">
                      <button
                        onClick={() => undoCompletedTask(task.id)}
                        title="Restore Task"
                        className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition active:scale-90 cursor-pointer"
                      >
                        <UndoRounded fontSize="small" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        title="Delete Permanently"
                        className="rounded-lg p-1.5 text-red-500 hover:bg-red-500/10 transition active:scale-90 cursor-pointer"
                      >
                        <DeleteOutlineRounded fontSize="small" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Pinned Input Field */}
      <form
        onSubmit={addTask}
        className="flex items-center gap-2 border border-[var(--border-color)] bg-[var(--bg-card)] rounded-2xl p-2 shadow-lg mt-2 shrink-0"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={activeTab === "todo" ? "Add a new quick task to do..." : "Add a completed quick task..."}
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)]/60"
        />
        <button
          type="submit"
          disabled={!inputVal.trim()}
          className="rounded-xl bg-[var(--accent)] p-2.5 text-white hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:scale-100 transition cursor-pointer flex items-center justify-center shrink-0"
        >
          <AddRounded fontSize="small" />
        </button>
      </form>
    </div>
  );
}
