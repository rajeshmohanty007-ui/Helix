import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";

const TaskListBar = ({ tasklists, active }) => {
  return (
    <div className="helix-scroll flex items-center gap-2 overflow-x-auto overflow-y-hidden border-b border-b-(--border-color) p-2">
      {tasklists.map((TL) => (
        <button
          key={TL}
          className={`rounded-2xl border border-(--border-color) bg-(--bg-card) px-4 py-2 ${active === TL ? `bg-[var(--accent)] text-white` : `text-(--text-primary)`}`}
        >
          {TL}
        </button>
      ))}
      <button
        className={`flex rounded-2xl border border-(--border-color) bg-(--bg-card) px-4 py-2`}
      >
        <PlaylistAddRoundedIcon /> <p className="text-nowrap">Add New</p>
      </button>
    </div>
  );
};

export default TaskListBar;