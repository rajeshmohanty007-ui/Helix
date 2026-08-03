"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import RegisterForm from "@/components/landing/RegisterForm";
import LoginForm from "@/components/landing/LoginForm";
import LoadingScreen from "@/components/ui/LoadingScreen";
import {
  DashboardRounded,
  AssignmentTurnedInRounded,
  ForumRounded,
  CalendarMonthRounded,
  NotificationsActiveRounded,
  ChevronRightRounded,
  BoltRounded,
  AutoAwesomeRounded,
  CheckCircleOutlineRounded,
} from "@mui/icons-material";

export default function AboutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [regVisible, setRegVisible] = useState(false);
  const [logVisible, setLogVisible] = useState(false);

  // Page title
  useEffect(() => {
    document.title = "About Helix | Feature Breakdown & Guides";
  }, []);

  // Redirect if authenticated (similar to landing page behavior if they click "Get Started" when logged in)
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  // Workspace Simulator State
  const [selectedWorkspace, setSelectedWorkspace] = useState("Helix Team");
  const workspacesData = {
    "Helix Team": [
      { name: "Alpha Release", category: "Core App" },
      { name: "Design System V2", category: "Brand Design" },
      { name: "CI/CD Pipeline Setup", category: "DevOps" },
    ],
    "Freelance Clients": [
      { name: "E-Commerce Landing", category: "Marketing" },
      { name: "Payment Gateway Integration", category: "Backend" },
    ],
    "Personal Projects": [
      { name: "Indie Hacker Journal", category: "Blog" },
      { name: "Home Smart Dashboard", category: "IoT" },
    ],
  };

  // Kanban Board Simulator State
  const [kanbanTasks, setKanbanTasks] = useState([
    { id: 1, title: "Implement Auth Flow", column: "To Do", priority: "High" },
    { id: 2, title: "Optimize DB Indexing", column: "In Progress", priority: "Medium" },
    { id: 3, title: "Deploy Staging Server", column: "Done", priority: "High" },
  ]);

  const advanceTask = (taskId) => {
    setKanbanTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id === taskId) {
          const nextCols = { "To Do": "In Progress", "In Progress": "Done", "Done": "To Do" };
          return { ...t, column: nextCols[t.column] };
        }
        return t;
      })
    );
  };

  // Chat Topic Simulator State
  const [activeChatChannel, setActiveChatChannel] = useState("#general");
  const chatMessages = {
    "#general": [
      { sender: "Alice", msg: "Hey team! Staging server is up. Let me know if you run into any build issues." },
      { sender: "Bob", msg: "Looks solid here. Logging system works perfectly." },
    ],
    "#design-assets": [
      { sender: "Bob", msg: "Just uploaded the new glassmorphic card asset files to our workspace folder." },
      { sender: "Alice", msg: "Love the rounded corners and glow effects!" },
    ],
    "#sprint-planning": [
      { sender: "Charlie", msg: "Let's plan to complete the visual Kanban task cards by Thursday." },
    ],
  };

  // Calendar Day Selector State
  const [selectedDay, setSelectedDay] = useState("Mon");
  const calendarEvents = {
    Mon: { title: "Sprint Sync Meeting", time: "10:00 AM", category: "Discussion" },
    Wed: { title: "Backend API Freeze", time: "2:00 PM", category: "Deadline" },
    Fri: { title: "Demo & Retro Session", time: "4:00 PM", category: "Milestone" },
  };

  // Notification Toast Simulator State
  const [toastMessage, setToastMessage] = useState(null);
  const triggerNotification = () => {
    const alerts = [
      "🔔 Bob assigned you task: 'Review Landing Page Copy'",
      "💬 Alice left a comment in #design-assets",
      "📅 Event Reminder: Sprint Sync starts in 15 minutes",
      "🚀 Project 'Alpha Release' progress reached 80%",
    ];
    const randomIndex = Math.floor(Math.random() * alerts.length);
    setToastMessage(alerts[randomIndex]);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Workflow Stepper Guide State
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    {
      title: "Initialize Your Workspace",
      icon: <DashboardRounded className="text-violet-400" />,
      tagline: "Set up a centralized command center for your projects.",
      desc: "Sign up and create an organization workspace. A workspace keeps all your files, projects, teams, and billing information in one neat, accessible compartment.",
      tip: "💡 Tip: Separate your consulting/freelance workspaces from internal personal projects to segment billing, teams, and chat notifications cleanly.",
      mock: (
        <div className="rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs text-gray-300">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[10px] text-gray-500">
            <span>Helix Terminal Shell</span>
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
          </div>
          <p className="mt-2 text-violet-400">$ helix workspace init --name "Innovators Hub"</p>
          <p className="text-gray-400">✔ Created workspace configuration metadata</p>
          <p className="text-gray-400">✔ Initialized 3 core channels: #general, #roadmap, #bugs</p>
          <p className="text-cyan-400">✔ Ready! Invite teammates via: https://helix.app/join/t8d29k</p>
        </div>
      ),
    },
    {
      title: "Structure Task Workflows",
      icon: <AssignmentTurnedInRounded className="text-cyan-400" />,
      tagline: "Visualize task lifecycles with Smart Kanban boards.",
      desc: "Create specific task lists (e.g. Daily, Marketing, Code Release). Set high/medium/low priority tags, deadlines, and assign tasks to teammates. Add sub-tasks to larger projects.",
      tip: "💡 Tip: Leverage sub-tasks to divide major tasks. Helix's central progress bar automatically monitors completion percentages based on sub-task checks.",
      mock: (
        <div className="space-y-2 rounded-xl border border-white/10 bg-black/40 p-4 text-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-gray-400">
            <span>TASK CHECKLIST</span>
            <span className="text-cyan-400">2 / 3 Complete</span>
          </div>
          <div className="space-y-1.5 text-gray-300">
            <div className="flex items-center gap-2 line-through text-gray-500">
              <input type="checkbox" checked disabled className="accent-cyan-500" />
              <span>Implement NextAuth configuration</span>
            </div>
            <div className="flex items-center gap-2 line-through text-gray-500">
              <input type="checkbox" checked disabled className="accent-cyan-500" />
              <span>Design database schemas using Prisma</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" disabled className="accent-cyan-500 animate-pulse" />
              <span className="font-semibold text-white">Perform end-to-end integration tests</span>
            </div>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-2/3 bg-cyan-400 transition-all duration-500" />
          </div>
        </div>
      ),
    },
    {
      title: "Real-Time Collaboration",
      icon: <ForumRounded className="text-pink-400" />,
      tagline: "Connect chat discussions with ongoing project tasks.",
      desc: "Inside each project, open a dedicated split-panel chat layout. Keep context sidebars open showing real-time updates and active objectives, so chats stay focused on current tasks.",
      tip: "💡 Tip: Click on any active chat user profile to view their currently assigned tasks and bandwidth availability.",
      mock: (
        <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-xs">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <span className="h-2 w-2 rounded-full bg-pink-500 animate-ping"></span>
            <span className="font-bold text-white">#alpha-release</span>
            <span className="text-[10px] text-gray-500">Active Discussion</span>
          </div>
          <div className="mt-2 space-y-2 text-gray-300">
            <p><b className="text-violet-400">Alice:</b> Just resolved the layout rendering issues.</p>
            <p><b className="text-cyan-400">Bob:</b> Nice! Merging the pull request on calendar events.</p>
          </div>
          <div className="mt-3 flex gap-1 rounded-lg border border-white/10 bg-white/5 p-1.5 text-[10px] text-gray-400">
            <span>🔗 Tied Context:</span>
            <span className="font-medium text-white underline cursor-pointer">Milestone - Staging Deployment</span>
          </div>
        </div>
      ),
    },
  ];

  if (status === "loading") {
    return <LoadingScreen fullScreen={true} />;
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0b1020] via-[#151b3b] to-[#1c2942] text-white">
      <Navbar onReg={() => setRegVisible(true)} onLog={() => setLogVisible(true)} />

      {/* Hero Section */}
      <section className="relative mx-auto flex flex-col items-center justify-center max-w-7xl px-6 pt-32 pb-16 text-center">
        {/* Glow Effects */}
        <div className="absolute left-1/4 top-1/4 h-[350px] w-[350px] rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-10 h-[300px] w-[300px] rounded-full bg-cyan-600/10 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm backdrop-blur text-violet-300">
            <AutoAwesomeRounded sx={{ fontSize: 16 }} /> Discover Helix Features
          </div>
          <h1 className="bg-gradient-to-r from-violet-300 via-violet-400 to-cyan-300 bg-clip-text text-4xl font-extrabold text-transparent sm:text-6xl md:text-7xl leading-tight">
            How Helix Drives <br />
            Productivity
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-gray-300 sm:text-lg md:text-xl leading-relaxed">
            Helix unites smart kanbans, modular workspaces, visual schedule calendars, and team context channels 
            into one highly aligned workspace environment. Here is how you can get the most out of it.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row justify-center">
            <button
              onClick={() => setRegVisible(true)}
              className="rounded-2xl bg-violet-600 px-8 py-4 font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:bg-violet-500 cursor-pointer"
            >
              Get Started Now
            </button>
            <a
              href="#guides"
              className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 backdrop-blur transition hover:bg-white/10 flex items-center justify-center gap-2"
            >
              Read Usage Guides <ChevronRightRounded />
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Bento Grid Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-center md:text-5xl mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Explore the Features
        </h2>
        <p className="text-center text-gray-400 max-w-lg mx-auto mb-12 text-sm sm:text-base">
          Click elements within these cards to interact with the simulations. Experience Helix before signing up.
        </p>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Card 1: Workspace Command Hub (Large - Spans 2 Cols) */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/30 hover:shadow-2xl md:col-span-2 flex flex-col justify-between min-h-[350px]">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                  <DashboardRounded />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-violet-400">Central Hub</span>
                  <h3 className="text-xl font-bold">Workspace Command Center</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-300 max-w-xl">
                Helix organizes your work into segmented Workspaces. Each workspace handles unique channels, projects, and permissions. Swap context without changing browsers.
              </p>
            </div>

            {/* Interactive Workspace Switcher */}
            <div className="relative mt-6 rounded-2xl bg-black/40 border border-white/5 p-4 flex flex-col sm:flex-row gap-4">
              <div className="flex flex-row sm:flex-col gap-2 shrink-0 border-b sm:border-b-0 sm:border-r border-white/5 pb-2 sm:pb-0 sm:pr-4 overflow-x-auto">
                {Object.keys(workspacesData).map((ws) => (
                  <button
                    key={ws}
                    onClick={() => setSelectedWorkspace(ws)}
                    className={`rounded-lg px-3 py-1.5 text-xs text-left font-medium transition cursor-pointer whitespace-nowrap ${
                      selectedWorkspace === ws
                        ? "bg-violet-600 text-white"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    💼 {ws}
                  </button>
                ))}
              </div>
              <div className="flex-1 space-y-2">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Active Workspace Projects</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {workspacesData[selectedWorkspace].map((proj) => (
                    <div key={proj.name} className="flex flex-col p-2.5 rounded-xl border border-white/10 bg-white/5">
                      <span className="text-xs font-bold text-white">📁 {proj.name}</span>
                      <span className="text-[9px] text-violet-400 mt-1">{proj.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Kanban Boards (Standard) */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/30 hover:shadow-2xl flex flex-col justify-between min-h-[350px]">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                  <AssignmentTurnedInRounded />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">Task Control</span>
                  <h3 className="text-xl font-bold">Visual Kanban Boards</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-300">
                Track statuses seamlessly. Set high/medium priority levels, and map detailed checklist tasks to milestones.
              </p>
            </div>

            {/* Kanban Card Simulation */}
            <div className="relative mt-6 space-y-2.5">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider flex justify-between">
                <span>Interactive Board</span>
                <span className="text-cyan-400 animate-pulse">Click cards to advance</span>
              </div>
              
              <div className="space-y-2">
                {kanbanTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => advanceTask(task.id)}
                    className="p-3 rounded-xl border border-white/10 bg-black/30 hover:bg-black/50 transition cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-white">{task.title}</h4>
                      <span className={`inline-block text-[8px] font-bold px-1.5 py-0.5 rounded mt-1.5 ${
                        task.priority === "High" ? "bg-red-500/20 text-red-300" : "bg-yellow-500/20 text-yellow-300"
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] bg-white/5 border border-white/15 px-2 py-1 rounded-full text-cyan-300">
                        {task.column}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Real-Time Chat (Standard) */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-pink-500/30 hover:shadow-2xl flex flex-col justify-between min-h-[350px]">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400">
                  <ForumRounded />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-pink-400">Discussions</span>
                  <h3 className="text-xl font-bold">Topic-Focused Chat</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-300">
                Prevent clutter. Create project topics specifically for designs, dev tasks, and server maintenance feeds.
              </p>
            </div>

            {/* Mini Chat Simulation */}
            <div className="relative mt-6 bg-black/40 border border-white/5 rounded-2xl p-3.5 flex flex-col h-44">
              <div className="flex gap-1.5 border-b border-white/5 pb-2 overflow-x-auto">
                {Object.keys(chatMessages).map((channel) => (
                  <button
                    key={channel}
                    onClick={() => setActiveChatChannel(channel)}
                    className={`text-[10px] font-bold px-2 py-1 rounded transition cursor-pointer whitespace-nowrap ${
                      activeChatChannel === channel ? "bg-pink-600 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {channel}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto mt-2 space-y-1.5 helix-scroll pr-1 text-[10px]">
                {chatMessages[activeChatChannel].map((msg, i) => (
                  <div key={i} className="bg-white/5 p-1.5 rounded-lg border border-white/5">
                    <span className="font-bold text-pink-400 mr-1">{msg.sender}:</span>
                    <span className="text-gray-300">{msg.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 4: Event Calendar (Large - Spans 2 Cols) */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-amber-500/30 hover:shadow-2xl md:col-span-2 flex flex-col justify-between min-h-[350px]">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
                  <CalendarMonthRounded />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Scheduler</span>
                  <h3 className="text-xl font-bold">Unified Project Calendars</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-300 max-w-xl">
                Keep the team aligned on dates. Track sprint timelines and demo slots on a clean monthly calendar layout synced directly to task items.
              </p>
            </div>

            {/* Interactive Schedule Box */}
            <div className="relative mt-6 bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0 justify-center">
                {["Mon", "Wed", "Fri"].map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer text-center ${
                      selectedDay === day ? "bg-amber-600 text-white" : "bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <div className="flex-1 w-full bg-white/5 p-3 rounded-xl border border-white/10 flex flex-col justify-center">
                <span className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold">Scheduled Agenda</span>
                <h4 className="text-sm font-bold text-white mt-1">{calendarEvents[selectedDay].title}</h4>
                <div className="mt-2.5 flex items-center justify-between text-xs text-gray-400">
                  <span>⏰ {calendarEvents[selectedDay].time}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] text-white">
                    {calendarEvents[selectedDay].category}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Smart Notifications (Standard) */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/30 hover:shadow-2xl flex flex-col justify-between min-h-[350px]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <NotificationsActiveRounded />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Alert Center</span>
                  <h3 className="text-xl font-bold">Activity Notifications</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-300">
                Never lose track. Receive real-time toast alerts on assignees, updates, and messages instantly.
              </p>
            </div>

            {/* Smart Notification Simulator */}
            <div className="relative mt-6 flex flex-col items-center gap-3 justify-center min-h-[140px] bg-black/20 rounded-2xl p-4 border border-white/5">
              {toastMessage ? (
                <div className="w-full text-center py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-semibold text-xs animate-bounce shadow-lg">
                  {toastMessage}
                </div>
              ) : (
                <div className="text-[11px] text-gray-400 italic text-center">
                  No active notifications. Click the button to test.
                </div>
              )}
              <button
                onClick={triggerNotification}
                className="w-full text-center rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500 hover:text-white transition duration-200 cursor-pointer active:scale-95"
              >
                🔔 Trigger Alert Test
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Guides Section */}
      <section id="guides" className="mx-auto max-w-7xl px-6 py-20 border-t border-white/10">
        <div className="text-center mb-12">
          <div className="inline-block text-cyan-400 text-xs font-bold tracking-widest uppercase border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 rounded-full mb-3">
            Usage Guides
          </div>
          <h2 className="text-3xl font-extrabold sm:text-5xl bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            How to Use Helix Efficiently
          </h2>
          <p className="text-gray-400 mt-3 max-w-md mx-auto text-sm sm:text-base">
            Follow this simple three-phase workflow to align your team inside the platform.
          </p>
        </div>

        {/* Stepper split view */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Stepper Selection Column (Left) */}
          <div className="lg:col-span-5 flex flex-col gap-3 justify-center">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`w-full text-left p-5 rounded-2xl border transition duration-300 cursor-pointer flex gap-4 items-start ${
                  activeStep === idx
                    ? "bg-white/10 border-violet-500/30 shadow-lg"
                    : "bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/8"
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${activeStep === idx ? "bg-violet-600/20" : "bg-white/5"}`}>
                  {step.icon}
                </div>
                <div>
                  <h3 className={`text-base font-bold transition-colors ${activeStep === idx ? "text-violet-300" : "text-white"}`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                    {step.tagline}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Stepper Preview Content Column (Right) */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-violet-600/30 text-violet-300 text-[10px] font-bold">
                  PHASE 0{activeStep + 1}
                </span>
                <span className="text-gray-500 text-xs">•</span>
                <span className="text-gray-400 text-xs font-medium">{steps[activeStep].title}</span>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {steps[activeStep].tagline}
              </h3>
              
              <p className="text-sm leading-relaxed text-gray-300">
                {steps[activeStep].desc}
              </p>

              <div className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300">
                {steps[activeStep].tip}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Simulated Live Preview</div>
              {steps[activeStep].mock}
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="relative mx-auto max-w-7xl px-6 py-20 text-center border-t border-white/10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-violet-600/10 blur-3xl" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold sm:text-5xl">
            Ready to Organize Your Workflows?
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Create an account today and build workspaces that elevate productivity. Empower your team with real-time updates and clear objectives.
          </p>
          <div className="pt-4">
            <button
              onClick={() => setRegVisible(true)}
              className="rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 px-10 py-5 text-sm font-extrabold transition-all duration-300 hover:scale-105 hover:opacity-95 shadow-xl hover:shadow-violet-600/20 cursor-pointer"
            >
              🚀 Register Free Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Auth Modals */}
      {regVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm">
          <RegisterForm onClose={() => setRegVisible(false)} />
        </div>
      )}
      {logVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm">
          <LoginForm onClose={() => setLogVisible(false)} />
        </div>
      )}
    </main>
  );
}
