export async function toggleTask(taskId, newCompleted, setTasks, activeTask, setActiveTask) {
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
}

export async function toggleSubtask(subtaskId, newCompleted, setTasks, activeTask, setActiveTask) {
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
}

export async function deleteTask(taskId, setTasks, activeTask, setActiveTask) {
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
}

export async function clearList(listName, activeTaskList, setTasks, setActiveTask) {
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
}

export async function deleteList(listName, activeTaskList, setActiveTaskList, taskLists, setTaskLists) {
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
    if (typeof window !== "undefined") {
      localStorage.setItem("custom_task_lists", JSON.stringify(customOnly));
    }

    // Redirect active tab if deleted
    if (activeTaskList === listName) {
      setActiveTaskList("Daily");
    }
  } catch (err) {
    console.error("Error deleting list:", err);
  }
}
