import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import TagIcon from "@mui/icons-material/Tag";
import CircleIcon from "@mui/icons-material/Circle";
import Link from "next/link";

const Chats = ({ data, activeProj }) => {
  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Sidebar */}
      <aside className="flex w-14 flex-col items-center min-h-0 border-r border-(--border-color) overflow-y-auto helix-scroll">
        {/* Channels */}
        <div className="mt-2 flex flex-col gap-2">
          {data.channels.map((channel) => (
            <button
              key={channel.id}
              className="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-(--bg-card) transition hover:bg-(--accent)"
            >
              <TagIcon fontSize="small" />

              {channel.unread > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-(--accent) px-1 text-[10px] text-white">
                  {channel.unread}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="my-3 h-px w-8 bg-(--border-color)" />

        {/* DMs */}
        <div className="flex flex-col gap-2">
          {data.dms.map((dm) => (
            <div
              key={dm.id}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-(--bg-card)"
            >
              <span className="text-xs font-semibold">
                {dm.name[0]}
              </span>

              <CircleIcon
                sx={{
                  fontSize: 10,
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  color: dm.online ? "#22c55e" : "#64748b",
                }}
              />
            </div>
          ))}
        </div>
      </aside>

      {/* Chat */}
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-(--border-color) px-3 py-2">
          <h2 className="truncate text-sm font-semibold">
            # {data.activeChat.name}
          </h2>

          {activeProj?.id ? (
            <Link
              href={`/projects/${activeProj.id}/chat`}
              target="_blank"
              className="rounded-md p-1 transition hover:bg-(--bg-hover) flex items-center justify-center"
            >
              <OpenInFullIcon fontSize="small" />
            </Link>
          ) : (
            <button className="rounded-md p-1 transition hover:bg-(--bg-hover) opacity-50 cursor-not-allowed" disabled>
              <OpenInFullIcon fontSize="small" />
            </button>
          )}
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto p-3">
          {data.activeChat.messages.map((msg) => (
            <div key={msg.id}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold">
                  {msg.sender}
                </span>

                <span className="text-[10px] text-(--text-secondary)">
                  {msg.time}
                </span>
              </div>

              <p className="mt-1 text-[13px] text-(--text-secondary)">
                {msg.text}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-(--border-color) p-2">
          <input
            disabled
            placeholder="Chat preview..."
            className="w-full rounded-lg bg-(--bg-card) px-3 py-2 text-xs outline-none"
          />
        </div>
      </section>
    </div>
  );
};

export default Chats;