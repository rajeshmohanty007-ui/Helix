import Card1 from "@/components/ui/Card1";
import FolderIcon from "@mui/icons-material/Folder";
import Activity from "@/components/ui/Activity";
import Card2 from "@/components/ui/Card2";


export default function ProjectsPage() {
  return <div className="flex-1 overflow-y-auto helix-scroll">
          <div className="m-4 flex flex-col gap-8 rounded-2xl border border-(--border-color) bg-(--bg-card) p-4 shadow-md">
            {/* Greetings */}
            <div className="flex flex-col gap-2 justify-between md:flex-row md:items-center">
              <div>
                <p className="text-2xl font-semibold text-(--text-primary)">
                  Hello User
                </p>
                <p className="text-xl text-(--text-primary)">
                  You have 4 tasks remaining
                </p>
                <p className="text-gray-600">Date : 24 Mar 2026</p>
              </div>
              <div>
                <p className="rounded-2xl border border-(--border-color) px-4 py-2 shadow-sm">
                  <b className="text-(--text-primary)">2</b> days Streak 🔥
                </p>
                <p className="mt-2 rounded-2xl border border-(--border-color) px-4 py-2 shadow-sm">
                  Productivty Score : <b>200</b>
                </p>
              </div>
            </div>
            {/* {Stats} */}
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card1
                title="Active Projects"
                value="12"
                growth="18"
                icon={<FolderIcon fontSize="medium" />}
              />
              <Card1
                title="Completed Projects"
                value="4"
                growth="200"
                icon={<FolderIcon fontSize="medium" />}
              />
              <Card1
                title="Upcoming Projects"
                value="8"
                growth="0"
                icon={<FolderIcon fontSize="medium" />}
              />
            </div>
            <div>
              <Activity
                progress={72}
                completedTasks={8}
                totalTasks={11}
                deadlineTask="Complete Activity Panel"
                deadlineTime="6:30 PM"
                upcomingEvents={[
                  {
                    title: "Team Standup Meeting",
                    time: "4:00 PM",
                  },
                  {
                    title: "UI Review Session",
                    time: "7:30 PM",
                  },
                ]}
              />
            </div>
            <h1 className="font-bold text-2xl text-(--accent)">Recent Activities</h1>
            <div className="flex flex-col gap-4">
              <Card2
                profile="https://i.pravatar.cc/150?img=12"
                username="Alex Morgan"
                relation="UI Designer • Team Member"
                action="Completed Dashboard Redesign"
                description="Updated the analytics section with new responsive layouts and improved spacing."
                time="2 min ago"
              />
              <Card2
                profile="https://i.pravatar.cc/150?img=12"
                username="H Rajesh"
                relation="Web Devloper • Team Member"
                action="Completed Dashboard Redesign"
                description="Updated the analytics section with new responsive layouts and improved spacing."
                time="2 min ago"
              />
            </div>
            <div className="flex justify-center">
              <button className="cursor-pointer rounded-xl px-4 py-2 text-(--accent) bg-purple-200">See All</button>
            </div>
          </div>
        </div>;
}