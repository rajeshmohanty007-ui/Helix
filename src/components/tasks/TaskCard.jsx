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

const TaskCard = ({
  task,
  selected,
  onToggleTask,
  onDeleteTask,
}) => {
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
  return (
    <div
      className={`group/task-card w-full rounded-xl border p-3 text-left transition-all ${
        selected
          ? "border-[var(--border-color)] bg-[var(--bg-card)] md:border-[var(--accent)] md:bg-[var(--bg-hover)]"
          : "border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)]"
      }`}
    >
      <div className="flex items-start gap-2 justify-between">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => {
              e.stopPropagation();
              onToggleTask && onToggleTask(task.id, !task.completed);
            }}
            className="mt-1 accent-[var(--accent)] cursor-pointer"
          />

          <h3
            className={`line-clamp-3 flex-1 text-sm cursor-pointer ${
              task.completed
                ? "text-[var(--text-secondary)] line-through"
                : "text-[var(--text-primary)]"
            }`}
          >
            {task.title}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          {/* Hover Delete Button for Completed Tasks */}
          {task.completed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTask && onDeleteTask(task.id);
              }}
              className="opacity-0 group-hover/task-card:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-500/10 text-red-500 hover:text-red-600 cursor-pointer self-start"
              title="Delete completed task"
            >
              <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
            </button>
          )}

          <span className="md:hidden">
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{
                color: "var(--text-primary)",
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </span>
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
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

    </div>
  );
};

export default TaskCard