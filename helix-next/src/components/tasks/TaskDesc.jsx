import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ShareIcon from "@mui/icons-material/Share";


const TaskDesc = ({ task, onToggleSubtask }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { dark } = useTheme();
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (!task) {
    return (
      <section className="flex h-full flex-1 flex-col items-center justify-center border-l border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <p className="text-sm text-[var(--text-secondary)] italic">Select a task to view details</p>
      </section>
    );
  }

  const sortedSubtasks = task.subtasks
    ? [...task.subtasks].sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      })
    : [];

  return (
    <section className="helix-scroll flex h-full flex-1 flex-col overflow-y-auto bg-[var(--bg-card)] p-6">
      {/* Title Header */}
      <div className="mb-6 flex items-start justify-between border-b border-[var(--border-color)] pb-4">
        <h1 className={`text-2xl font-bold ${task.completed ? "text-[var(--text-secondary)] line-through" : "text-[var(--text-primary)]"}`}>
          {task.title}
        </h1>

        <IconButton
          size="small"
          onClick={handleMenuOpen}
          sx={{
            color: "var(--text-primary)",
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: dark ? "rgb(17,24,39)" : "rgb(255,255,255)",
              color: dark ? "rgb(249,250,251)" : "rgb(17,24,39)",
              border: dark
                ? "1px solid rgb(55,65,81)"
                : "1px solid rgb(229,231,235)",
            },
          },
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon
              fontSize="small"
              sx={{
                color: dark ? "rgb(249,250,251)" : "rgb(17,24,39)",
              }}
            />
          </ListItemIcon>
          Edit
        </MenuItem>

        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <ShareIcon
              fontSize="small"
              sx={{
                color: dark ? "rgb(249,250,251)" : "rgb(17,24,39)",
              }}
            />
          </ListItemIcon>
          Share
        </MenuItem>

        <MenuItem onClick={handleMenuClose} sx={{ color: "#ef4444" }}>
          <ListItemIcon>
            <DeleteOutlineRoundedIcon
              fontSize="small"
              sx={{ color: "#ef4444" }}
            />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>

      <div className="flex flex-col gap-6">
        {/* Meta */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-[var(--border-color)] p-4">
            <p className="text-sm text-[var(--text-secondary)]">Priority</p>
            <p className="font-medium text-[var(--text-primary)]">{task.priority}</p>
          </div>

          <div className="rounded-xl border border-[var(--border-color)] p-4">
            <p className="text-sm text-[var(--text-secondary)]">Deadline</p>
            <p className="font-medium text-[var(--text-primary)]">
              {task.deadline}
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border-color)] p-4">
            <p className="text-sm text-[var(--text-secondary)]">
              Estimated Time
            </p>
            <p className="font-medium text-[var(--text-primary)]">
              {task.duration}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-xl border border-[var(--border-color)] p-5">
          <h2 className="mb-3 text-lg font-semibold text-[var(--text-primary)]">
            Description
          </h2>
          <p className="whitespace-pre-wrap text-[var(--text-secondary)]">
            {task.description}
          </p>
        </div>

        {/* Tags */}
        <div className="rounded-xl border border-[var(--border-color)] p-5">
          <h2 className="mb-3 text-lg font-semibold text-[var(--text-primary)]">
            Tags
          </h2>

          <div className="flex flex-wrap gap-2">
            {task.tags?.map((tag) => (
              <span
                key={tag.id || tag.name || tag}
                className="rounded-full bg-[var(--bg-hover)] px-3 py-1 text-sm text-[var(--text-primary)]"
              >
                {tag.name || tag}
              </span>
            ))}
          </div>
        </div>

        {/* Subtasks */}
        <div className="rounded-xl border border-[var(--border-color)] p-5">
          <h2 className="mb-3 text-lg font-semibold text-[var(--text-primary)]">
            Subtasks
          </h2>

          <div className="flex flex-col gap-3">
            {sortedSubtasks.length > 0 ? (
              sortedSubtasks.map((subtask) => (
                <label key={subtask.id} className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => {
                      onToggleSubtask && onToggleSubtask(subtask.id, !subtask.completed);
                    }}
                    className="accent-[var(--accent)] cursor-pointer"
                  />

                  <span
                    className={
                      subtask.completed
                        ? "text-[var(--text-secondary)] line-through"
                        : "text-[var(--text-primary)]"
                    }
                  >
                    {subtask.title}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-sm text-[var(--text-secondary)] italic">No subtasks for this task.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaskDesc