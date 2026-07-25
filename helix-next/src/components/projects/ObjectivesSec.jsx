import Card4 from "../ui/Card4";
import CircularProgress from "@mui/material/CircularProgress";

const ObjectivesSec = ({ objectives = [], loading = false, onAddClick }) => {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-(--border-color) p-2">
        <h1 className="p-3 text-center text-lg font-semibold text-(--accent)">
          Objectives
        </h1>

        <button
          onClick={onAddClick}
          className="rounded-lg w-full bg-(--accent) p-2 text-white hover:opacity-90 transition active:scale-98"
        >
          Add an Objective
        </button>
      </div>

      <div className="helix-scroll min-h-0 flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex justify-center p-4">
            <CircularProgress size={24} />
          </div>
        ) : objectives.length === 0 ? (
          <p className="text-center text-sm text-[var(--text-secondary)] py-8">
            No objectives yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {objectives.map((obj) => (
              <Card4
                key={obj.id}
                title={obj.title}
                deadline={obj.deadline}
                status={obj.status}
                members={obj.members.map((m) => ({
                  name: m.username,
                  avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${m.username}`,
                }))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ObjectivesSec;