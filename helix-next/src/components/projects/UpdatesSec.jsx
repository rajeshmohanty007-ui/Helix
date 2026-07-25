import Card3 from "../ui/Card3";
import CircularProgress from "@mui/material/CircularProgress";

const UpdatesSec = ({ updates = [], loading = false, onAddClick }) => {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-(--border-color) p-2">
        <h1 className="p-3 text-center text-lg font-semibold text-(--accent)">
          Updates
        </h1>

        <button
          onClick={onAddClick}
          className="rounded-lg w-full bg-(--accent) p-2 text-white hover:opacity-90 transition active:scale-98"
        >
          Add an Update
        </button>
      </div>

      <div className="helix-scroll min-h-0 flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex justify-center p-4">
            <CircularProgress size={24} />
          </div>
        ) : updates.length === 0 ? (
          <p className="text-center text-sm text-[var(--text-secondary)] py-8">
            No updates yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {updates.map((update) => (
              <Card3
                key={update.id}
                profile={`https://api.dicebear.com/7.x/initials/svg?seed=${update.user.username}`}
                username={update.user.username}
                action={update.action}
                timestamp={
                  new Date(update.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }) +
                  " - " +
                  new Date(update.createdAt).toLocaleDateString()
                }
                content={update.content}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdatesSec;