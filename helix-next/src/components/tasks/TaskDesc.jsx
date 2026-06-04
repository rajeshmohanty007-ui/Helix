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


const TaskDesc = ({ task }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { dark } = useTheme();
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (!task) {
    return (
      <section className="hidden flex-1 items-center justify-center md:flex">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            No Task Selected
          </h2>

          <p className="mt-2 text-[var(--text-secondary)]">
            Select a task from the list to view its details.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="helix-scroll hidden h-full flex-1 overflow-y-auto p-6 md:block">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-(--text-primary)">
              {task.title}
            </h1>

            <p className="mt-2 text-(--text-secondary)">
              {task.completed ? "Completed" : "In Progress"}
            </p>
          </div>

          <div>
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                color: "var(--text-primary)",
              }}
            >
              <MoreVertIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              slotProps={{
                paper: {
                  sx: {
                    backgroundColor: dark
                      ? "rgb(17,24,39)"
                      : "rgb(255,255,255)",
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
                    sx={{ color: dark ? "rgb(249,250,251)" : "rgb(17,24,39)" }}
                  />
                </ListItemIcon>
                Edit
              </MenuItem>

              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <ShareIcon
                    fontSize="small"
                    sx={{ color: dark ? "rgb(249,250,251)" : "rgb(17,24,39)" }}
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
          </div>
        </div>

        {/* Meta */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-(--border-color) p-4">
            <p className="text-sm text-(--text-secondary)">Priority</p>
            <p className="font-medium text-(--text-primary)">{task.priority}</p>
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
        <div className="mb-6 rounded-xl border border-[var(--border-color)] p-5">
          <h2 className="mb-3 text-lg font-semibold text-[var(--text-primary)]">
            Description
          </h2>

          <p className="whitespace-pre-wrap text-[var(--text-secondary)]">
            {task.description}
          </p>
        </div>

        {/* Tags */}
        <div className="mb-6 rounded-xl border border-[var(--border-color)] p-5">
          <h2 className="mb-3 text-lg font-semibold text-[var(--text-primary)]">
            Tags
          </h2>

          <div className="flex flex-wrap gap-2">
            {task.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--bg-hover)] px-3 py-1 text-sm text-[var(--text-primary)]"
              >
                {tag}
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
            {task.subtasks?.map((subtask) => (
              <label key={subtask.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  readOnly
                  className="accent-[var(--accent)]"
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaskDesc