import { useState } from "react";
import TaskCard from "./TaskCard";

const TaskBar = ({ tasks, activeTask }) => {
  const [expandedTask, setExpandedTask] = useState(null);
  return (
    <aside className="flex h-full w-full min-w-[280px] flex-col border-r border-[var(--border-color)] md:w-[40%]">
      <div className="helix-scroll flex-1 overflow-y-auto p-2">
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              selected={activeTask?.id === task.id}
              expandedTask={expandedTask}
              setExpandedTask={setExpandedTask}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--border-color)] p-2">
        <button className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 font-medium text-white transition-opacity hover:opacity-90">
          + Add Task
        </button>
      </div>
    </aside>
  );
};

export default TaskBar