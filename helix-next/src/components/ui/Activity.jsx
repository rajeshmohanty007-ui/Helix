import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import EventIcon from "@mui/icons-material/Event";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

const Activity = ({
  progress = 75,
  completedTasks = 9,
  totalTasks = 12,

  deadlineTask = "Finalize Dashboard UI",
  deadlineTime = "5:00 PM",

  upcomingEvents = [],
}) => {
  return (
    <div className="flex h-full w-full flex-col gap-5 rounded-3xl border border-(--border-color) shadow-lg bg-(--bg-card) p-6 text-(--text-primary)">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold">
          Today's Activity
        </h2>

        <p className="mt-1 text-sm text-(--text-primary)">
          Track your daily workflow
        </p>
      </div>

      {/* Progress Section */}
      <div className="rounded-2xl border border-(--border-color) bg-(--bg-card) p-4">

        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium text-(--text-primary)">
            Daily Progress
          </h3>

          <span className="text-sm text-violet-400">
            {completedTasks}/{totalTasks} Tasks
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full overflow-hidden rounded-full bg-(--bg-card)">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-3 text-sm text-(--text-primary)">
          {progress}% completed today
        </p>
      </div>

      {/* Nearest Deadline */}
      <div className="rounded-2xl border border-(--border-color) bg-(--bg-card) p-4">

        <div className="mb-3 flex items-center gap-2">
          <AccessTimeFilledIcon
            style={{ fontSize: "20px" }}
            className="text-orange-400"
          />

          <h3 className="font-medium">
            Nearest Deadline
          </h3>
        </div>

        <p className="text-lg font-semibold">
          {deadlineTask}
        </p>

        <p className="mt-1 text-sm text-(--text-primary)">
          Due Today • {deadlineTime}
        </p>
      </div>

      {/* Upcoming Events */}
      <div className="flex flex-col gap-3 rounded-2xl border border-(--border-color) backdrop-blur-lg bg-(--bg-card) p-4">

        <div className="flex items-center gap-2">
          <EventIcon
            style={{ fontSize: "20px" }}
            className="text-violet-400"
          />

          <h3 className="font-medium">
            Upcoming Events
          </h3>
        </div>

        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event, index) => (
            <div
              key={index}
              className="flex items-start justify-between rounded-xl border border-(--border-color) shadow-md bg-(--bg-card) p-3 transition-all duration-300 hover:bg-(--bg-hover)"
            >
              <div>
                <p className="font-medium">
                  {event.title}
                </p>

                <p className="mt-1 text-sm text-(--text-primary)">
                  {event.time}
                </p>
              </div>

              <TaskAltIcon
                style={{ fontSize: "20px" }}
                className="text-emerald-400"
              />
            </div>
          ))
        ) : (
          <p className="text-sm text-(--text-primary)">
            No events scheduled today
          </p>
        )}
      </div>

    </div>
  );
};

export default Activity;