"use client";
import MobMonth from "@/components/calender/MobMonth";
import MonthCalendar from "@/components/calender/Month";
import AgendaCard from "@/components/calender/AgendaCard";
import DayView from "@/components/calender/DayView";

export default function ProjectsPage() {
  return <div className="h-full min-h-0 flex-1">
          <div className="hidden h-full w-full lg:flex">
            <div className="helix-scroll h-full w-[60%] overflow-y-auto p-4">
              <MonthCalendar />
            </div>
            <div className="helix-scroll h-full flex-1 overflow-y-auto p-4">
              <DayView />
            </div>
          </div>

          <div className="helix-scroll flex h-full w-full flex-col gap-2 overflow-y-auto p-4 lg:hidden">
            <MobMonth />
            <AgendaCard
              title="Launch Helix Calendar"
              startTime="10:00"
              endTime="12:00"
              type="deadline"
              priority="high"
              status="in-progress"
              assignees={["Rajesh", "Ankit"]}
            />
          </div>
        </div>;
}