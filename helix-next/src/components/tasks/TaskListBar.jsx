"use client";

import { useState } from "react";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import { Menu, MenuItem, ListItemIcon } from "@mui/material";
import { useTheme } from "@/context/ThemeContext";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ClearAllRoundedIcon from "@mui/icons-material/ClearAllRounded";

const TaskListBar = ({
  tasklists,
  active,
  setActive,
  onAddListClick,
  onClearList,
  onDeleteList,
}) => {
  const { dark } = useTheme();
  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (event, listName) => {
    if (listName === "Quick Tasks") return; // Refrain Quick Tasks
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
          mouseX: event.clientX - 2,
          mouseY: event.clientY - 4,
          listName,
        }
        : null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleClear = () => {
    if (onClearList && contextMenu) {
      onClearList(contextMenu.listName);
    }
    handleClose();
  };

  const handleDelete = () => {
    if (onDeleteList && contextMenu) {
      onDeleteList(contextMenu.listName);
    }
    handleClose();
  };

  return (
    <div className="helix-scroll flex items-center gap-2 overflow-x-auto overflow-y-hidden border-b border-b-(--border-color) p-2">
      {tasklists.map((TL) => (
        <button
          key={TL}
          onClick={() => {
            setActive(TL);
          }}
          onContextMenu={(e) => handleContextMenu(e, TL)}
          className={`rounded-2xl border border-(--border-color) bg-(--bg-card) px-4 py-2 shadow-md transition cursor-pointer select-none ${active === TL ? `bg-[var(--accent)] text-white` : `hover:bg-[var(--accent)]/25 text-(--text-primary)`
            }`}
        >
          {TL}
        </button>
      ))}
      <button
        onClick={onAddListClick}
        className={`flex rounded-2xl border border-(--border-color) bg-(--bg-card) px-4 py-2 shadow-md hover:bg-[var(--bg-hover)] active:scale-98 transition cursor-pointer`}
      >
        <PlaylistAddRoundedIcon /> <p className="text-nowrap">Add New</p>
      </button>

      {/* Right-click Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        slotProps={{
          paper: {
            sx: {
              backgroundColor: dark ? "rgb(17,24,39)" : "rgb(255,255,255)",
              color: dark ? "rgb(249,250,251)" : "rgb(17,24,39)",
              border: dark
                ? "1px solid rgb(55,65,81)"
                : "1px solid rgb(229,231,235)",
              borderRadius: "1rem",
              padding: "0.25rem",
            },
          },
        }}
      >
        <MenuItem onClick={handleClear} sx={{ fontSize: "0.875rem", borderRadius: "0.5rem" }}>
          <ListItemIcon>
            <ClearAllRoundedIcon fontSize="small" sx={{ color: dark ? "rgb(249,250,251)" : "rgb(17,24,39)" }} />
          </ListItemIcon>
          Clear tasks
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "#ef4444", fontSize: "0.875rem", borderRadius: "0.5rem" }}>
          <ListItemIcon>
            <DeleteOutlineRoundedIcon fontSize="small" sx={{ color: "#ef4444" }} />
          </ListItemIcon>
          Delete list
        </MenuItem>
      </Menu>
    </div>
  );
};

export default TaskListBar;