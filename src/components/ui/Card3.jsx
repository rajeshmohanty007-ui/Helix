import {
  CheckCircleRounded,
  PlayCircleRounded,
  ErrorRounded,
  EditRounded,
  AccessTimeRounded,
} from "@mui/icons-material";

const actionConfig = {
  completed: {
    icon: CheckCircleRounded,
    color: "#22c55e",
    label: "Completed",
  },

  started: {
    icon: PlayCircleRounded,
    color: "#3b82f6",
    label: "Started",
  },

  blocked: {
    icon: ErrorRounded,
    color: "#ef4444",
    label: "Blocked",
  },

  updated: {
    icon: EditRounded,
    color: "var(--accent)",
    label: "Updated",
  },
};


const Card3 = ({
  profile,
  username,
  action = "updated",
  content,
  timestamp,
}) => {
  const currentAction =
    actionConfig[action] || actionConfig.updated;

  const ActionIcon = currentAction.icon;

  return (
    <div
      className="
        w-full
        rounded-xl
        border
        border-(--border-color)
        bg-(--bg-card)
        p-4
        transition-all
        duration-200
        hover:bg-(--bg-hover)
      "
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        {profile && <img
          src={profile}
          alt={username}
          className="
            h-10
            w-10
            rounded-full
            object-cover
            border
            border-(--border-color)
            shrink-0
          "
        />}
        {!profile && <span className={`
            h-10
            w-10
            rounded-full
            object-cover
            border
            border-(--border-color)
            shrink-0
            flex justify-center items-center
          `}> {username[0]}
            </span>}

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="
                font-semibold
                text-(--text-primary)
              "
            >
              {username}
            </span>

            <div
              className="
                flex
                items-center
                gap-1
                rounded-full
                px-2
                py-0.5
                text-xs
                font-medium
              "
              style={{
                color: currentAction.color,
                backgroundColor: `${currentAction.color}20`,
              }}
            >
              <ActionIcon sx={{ fontSize: 14 }} />
              {currentAction.label}
            </div>
          </div>

          <div className="mt-1 flex items-center gap-1">
            <AccessTimeRounded
              sx={{
                fontSize: 14,
                color: "var(--text-secondary)",
              }}
            />

            <span
              className="
                text-xs
                text-(--text-secondary)
              "
            >
              {timestamp}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      {content && (
        <p
          className="
            mt-3
            text-sm
            leading-relaxed
            text-(--text-secondary)
          "
        >
          {content}
        </p>
      )}
    </div>
  );
};

export default Card3;