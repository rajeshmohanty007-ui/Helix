"use client";
import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Type from "@/components/landing/Type";
import Footer from "@/components/landing/Footer";
import RegisterForm from "@/components/landing/RegisterForm";
import LoginForm from "@/components/landing/LoginForm";

const Home = () => {
  const [regVisible, setRegVisible] = useState(false);
  const [logVisible, setLogVisible] = useState(false);
  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-[#0b1020] via-[#151b3b] to-[#1c2942] text-white">
      <Navbar onReg={()=> setRegVisible(true)} onLog={()=> setLogVisible(true)}/>
      {/* Hero Section */}
      <section className="relative mx-auto grid grid-cols-1 gap-4 mb-4 lg:grid-cols-2 place-items-center min-h-screen max-w-7xl px-6 pt-24 py-auto">
        <div className="absolute left-[-100px] top-[-100px] h-[400px] w-[400px] rounded-full bg-violet-600/20 blur-3xl" />

        {/* Left */}
        <div className="relative z-10 max-w-2xl">
          <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur">
            Collaboration Reimagined
          </div>
          <div className="flex flex-col gap-2 md:gap-4">
            <Type text="Build Together" />
            <Type text="Learn Faster" delay={1} />
          </div>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-300">
            Helix helps creators and developers collaborate, manage projects,
            and organize workflows inside one unified productivity ecosystem.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button className="rounded-2xl bg-violet-600 px-8 py-4 font-semibold transition-all duration-300 hover:scale-105 hover:bg-violet-500" onClick={()=> setRegVisible(true)}>
              Start Free
            </button>

            <button className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 backdrop-blur transition hover:bg-white/10">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="relative">
          <div className="absolute inset-0 rounded-[40px] bg-violet-600/20 blur-3xl" />

          <div className="relative w-full max-w-[500px] rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            {/* Fake Dashboard */}
            <div className="mb-5 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-white/5 py-4 px-8">
                📁 Project Workspace
              </div>

              <div className="rounded-2xl bg-violet-500/20 py-4 px-8">
                ⚡ Live Team Collaboration
              </div>

              <div className="rounded-2xl bg-white/5 py-4 px-8">
                ✅ Smart Task Management
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-32 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="mb-5 text-4xl">⚡</div>

          <h3 className="text-2xl font-bold">Real-Time Collaboration</h3>

          <p className="mt-4 text-gray-300">
            Work together with your team instantly using live updates and shared
            workspaces.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="mb-5 text-4xl">📁</div>

          <h3 className="text-2xl font-bold">Project Management</h3>

          <p className="mt-4 text-gray-300">
            Organize tasks, milestones, files, and workflows in one place.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="mb-5 text-4xl">🧑‍💻</div>
          <h3 className="text-2xl font-bold">Creator Focused</h3>
          <p className="mt-4 text-gray-300">
            Built specifically for creators, developers, and collaborative
            teams.
          </p>
        </div>
        {regVisible && (
            <div className="fixed inset-0 z-10 flex items-center justify-center bg-zinc-900/60" >
              <RegisterForm  onClose={() => setRegVisible(false)}/>
            </div>
          )}
        {logVisible && (
            <div className="fixed inset-0 z-10 flex items-center justify-center bg-zinc-900/60" >
              <LoginForm  onClose={() => setLogVisible(false)}/>
            </div>
          )}
      </section>
      <Footer />
    </main>
  );
};

export default Home;
