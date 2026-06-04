import Card3 from "../ui/Card3";

const UpdatesSec = () => {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-(--border-color) p-2">
        <h1 className="p-3 text-center text-lg font-semibold text-(--accent)">
          Updates
        </h1>

        <button className="rounded-lg w-full bg-(--accent) p-2 text-white">
          Add an Update
        </button>
      </div>

      <div className="helix-scroll min-h-0 flex-1 overflow-y-auto p-2">
        <div className="flex flex-col gap-2">
          <Card3
            profile="https://i.pravatar.cc/100?img=5"
            username="Rajesh"
            action="completed"
            timestamp="5 minutes ago"
            content="Implemented JWT authentication and protected routes."
          />

          <Card3
            profile="https://i.pravatar.cc/100?img=8"
            username="Aman"
            action="started"
            timestamp="20 minutes ago"
            content="Started building the real-time chat system."
          />

          <Card3
            profile="https://i.pravatar.cc/100?img=11"
            username="Sarah"
            action="blocked"
            timestamp="1 hour ago"
            content="Waiting for database migration approval."
          />

          <Card3
            profile="https://i.pravatar.cc/100?img=15"
            username="John"
            action="updated"
            timestamp="2 hours ago"
            content="Updated the project roadmap and sprint goals."
          />
        </div>
      </div>
    </div>
  );
};

export default UpdatesSec;