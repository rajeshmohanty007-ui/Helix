import { useState } from "react";
import TaskCard from "./TaskCard";

const TaskBar = ({
  tasks = [],
  activeTask,
  onSelectTask,
  onAddTaskClick,
  onToggleTask,
  onDeleteTask,
}) => {
  const [expandedTask, setExpandedTask] = useState(null);

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <aside className="flex h-full w-full min-w-[280px] flex-col border-r border-[var(--border-color)] md:w-[40%]">
      <div className="helix-scroll flex-1 overflow-y-auto p-2">
        <div className="flex flex-col gap-2">
          {sortedTasks.length === 0 ? (
            <p className="text-center text-xs text-[var(--text-secondary)] py-8 italic">No tasks in this list.</p>
          ) : (
            sortedTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onSelectTask && onSelectTask(task)}
                className="cursor-pointer"
              >
                <TaskCard
                  task={task}
                  selected={activeTask?.id === task.id}
                  expandedTask={expandedTask}
                  setExpandedTask={setExpandedTask}
                  onToggleTask={onToggleTask}
                  onDeleteTask={onDeleteTask}
                />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="border-t border-[var(--border-color)] p-2">
        <button
          onClick={onAddTaskClick}
          className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 font-medium text-white transition hover:opacity-90 active:scale-98 cursor-pointer"
        >
          + Add Task
        </button>
      </div>
    </aside>
  );
};

export default TaskBar