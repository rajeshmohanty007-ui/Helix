import Card4 from "../ui/Card4";

const ObjectivesSec = () => {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-(--border-color) p-2">
        <h1 className="p-3 text-center text-lg font-semibold text-(--accent)">
          Objectives
        </h1>

        <button className="rounded-lg w-full bg-(--accent) p-2 text-white">
          Add an Objective
        </button>
      </div>

      <div className="helix-scroll min-h-0 flex-1 overflow-y-auto p-2">
        <div className="flex flex-col gap-2">
          <Card4
            title="Complete Authentication System"
            deadline="June 15, 2026"
            status="progress"
            members={[
              {
                name: "Rajesh",
                avatar: "https://i.pravatar.cc/100?img=5",
              },
              {
                name: "Aman",
                avatar: "https://i.pravatar.cc/100?img=8",
              },
            ]}
          />

          <Card4
            title="Launch Beta Version"
            deadline="July 1, 2026"
            status="pending"
            members={[
              {
                name: "Sarah",
                avatar: "https://i.pravatar.cc/100?img=11",
              },
            ]}
          />

          <Card4
            title="Real-time Chat Module"
            deadline="June 10, 2026"
            status="blocked"
            members={[
              {
                name: "John",
                avatar: "https://i.pravatar.cc/100?img=15",
              },
              {
                name: "Rajesh",
                avatar: "https://i.pravatar.cc/100?img=5",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default ObjectivesSec;