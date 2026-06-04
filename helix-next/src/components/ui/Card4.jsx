import {
  CalendarMonthRounded,
  CheckCircleRounded,
  PlayCircleRounded,
  ScheduleRounded,
  ErrorRounded,
} from "@mui/icons-material";

const statusConfig = {
  completed: {
    icon: CheckCircleRounded,
    color: "#22c55e",
    text: "Completed",
  },

  progress: {
    icon: PlayCircleRounded,
    color: "#3b82f6",
    text: "In Progress",
  },

  pending: {
    icon: ScheduleRounded,
    color: "#f59e0b",
    text: "Pending",
  },

  blocked: {
    icon: ErrorRounded,
    color: "#ef4444",
    text: "Blocked",
  },
};

const Card4 = ({
  title,
  deadline,
  status = "pending",
  members = [],
}) => {
  const currentStatus =
    statusConfig[status] || statusConfig.pending;

  const StatusIcon = currentStatus.icon;

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
      {/* Title */}
      <h2
        className="
          text-base
          font-semibold
          text-(--text-primary)
        "
      >
        {title}
      </h2>

      {/* Deadline */}
      <div className="mt-3 flex items-center gap-2">
        <CalendarMonthRounded
          sx={{
            fontSize: 18,
            color: "var(--text-secondary)",
          }}
        />

        <span
          className="
            text-sm
            text-(--text-secondary)
          "
        >
          {deadline}
        </span>
      </div>

      {/* Status */}
      <div
        className="
          mt-3
          inline-flex
          items-center
          gap-1
          rounded-full
          px-3
          py-1
          text-sm
          font-medium
        "
        style={{
          color: currentStatus.color,
          backgroundColor: `${currentStatus.color}20`,
        }}
      >
        <StatusIcon sx={{ fontSize: 16 }} />
        {currentStatus.text}
      </div>

      {/* Team Members */}
      <div className="mt-4">
        <p
          className="
            mb-2
            text-xs
            font-medium
            uppercase
            tracking-wide
            text-(--text-secondary)
          "
        >
          Working On It
        </p>

        <div className="flex items-center">
          {members.map((member, index) => (
            <img
              key={index}
              src={member.avatar}
              alt={member.name}
              title={member.name}
              className="
                h-8
                w-8
                rounded-full
                border-2
                border-(--bg-card)
                object-cover
                -ml-2
                first:ml-0
              "
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card4;