"use client";

import { useState, useEffect } from "react";
import { useDialog } from "@/components/providers/DialogProvider";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import BedRoundedIcon from "@mui/icons-material/BedRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const loaderStyles = `
  @keyframes breathe {
    0%, 100% {
      transform: scale(1);
      opacity: 0.45;
      filter: blur(25px);
    }
    50% {
      transform: scale(1.15);
      opacity: 0.75;
      filter: blur(35px);
    }
  }
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(180deg);
    }
  }
  @keyframes float-reverse {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(20px) rotate(-180deg);
    }
  }
  .soothing-orb-1 {
    animation: breathe 5s ease-in-out infinite, float 12s ease-in-out infinite;
  }
  .soothing-orb-2 {
    animation: breathe 6s ease-in-out infinite alternate, float-reverse 15s ease-in-out infinite;
  }
`;

export default function AiSchedulerModal({ isOpen, onClose, onScheduleCreated }) {
  const { showAlert } = useDialog();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Input states
  const [sleepStart, setSleepStart] = useState("22:00");
  const [sleepEnd, setSleepEnd] = useState("06:00");
  const [unavailableStart, setUnavailableStart] = useState("");
  const [unavailableEnd, setUnavailableEnd] = useState("");
  const [workHours, setWorkHours] = useState(8);

  // Status message text
  const [statusText, setStatusText] = useState("Initializing schedule solver...");

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setError("");
      setLoading(false);
      setSleepStart("22:00");
      setSleepEnd("06:00");
      setUnavailableStart("");
      setUnavailableEnd("");
      setWorkHours(8);
    }
  }, [isOpen]);

  // Loading animation status transitions
  useEffect(() => {
    if (step !== 3) return;

    const statuses = [
      { text: "Analyzing your uncompleted tasks and deadlines...", delay: 0 },
      { text: "Mapping out existing busy slots in your calendar...", delay: 2500 },
      { text: "Calculating optimal sleep and work intervals...", delay: 5000 },
      { text: "Invoking Gemini AI to split and optimize slots...", delay: 7500 },
      { text: "Writing newly scheduled events to your database...", delay: 11000 },
    ];

    const timers = statuses.map((status) => {
      return setTimeout(() => {
        setStatusText(status.text);
      }, status.delay);
    });

    return () => timers.forEach(clearTimeout);
  }, [step]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = async () => {
    setStep(3);
    setLoading(true);
    setError("");

    // Construct constraint strings
    const sleepingHours = `${sleepStart} - ${sleepEnd}`;
    const unavailableHours =
      unavailableStart && unavailableEnd
        ? `${unavailableStart} - ${unavailableEnd}`
        : "None";

    try {
      const res = await fetch("/api/events/ai-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sleepingHours,
          unavailableHours,
          workHoursPerDay: Number(workHours),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate optimized schedule.");
      }

      // Save last run timestamp in localStorage to enforce "once a day"
      localStorage.setItem("lastAiScheduleRun", new Date().toISOString());

      // Show alert & close
      onClose();
      await showAlert(data.alertMessage, "AI Task Scheduler");
      
      if (onScheduleCreated) {
        onScheduleCreated();
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setStep(2); // Go back to inputs to allow retry
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <style dangerouslySetInnerHTML={{ __html: loaderStyles }} />
      <div className="absolute inset-0" onClick={!loading ? onClose : undefined} />
      
      <div className="relative w-[90%] max-w-md rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-[var(--text-primary)]">
        
        {/* Glowing Background blobs during Loading */}
        {step === 3 && (
          <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
            <div className="soothing-orb-1 absolute -top-12 -left-12 w-48 h-48 rounded-full bg-[var(--accent)]" style={{ transformOrigin: "center" }} />
            <div className="soothing-orb-2 absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-cyan-500" style={{ transformOrigin: "center" }} />
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 relative z-10">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)]/15 text-[var(--accent)]">
              <AutoAwesomeRoundedIcon fontSize="small" />
            </div>
            <h2 className="text-lg font-bold">AI Task Scheduler</h2>
          </div>
          {!loading && (
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <CloseRoundedIcon fontSize="small" />
            </button>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400 relative z-10">
            {error}
          </div>
        )}

        {/* Wizard Steps */}
        <div className="mt-6 relative z-10 min-h-[220px] flex flex-col justify-between">
          
          {/* STEP 1: Sleeping and Unavailable Hours */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-1">
                  <BedRoundedIcon className="text-[var(--text-secondary)]" fontSize="small" />
                  When do you typically sleep?
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)] mb-2">
                  We won't schedule any tasks during your sleep hours.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] mb-1 block">Sleep Start</label>
                    <input
                      type="time"
                      value={sleepStart}
                      onChange={(e) => setSleepStart(e.target.value)}
                      className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-3 py-2 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)] [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] mb-1 block">Wake Up</label>
                    <input
                      type="time"
                      value={sleepEnd}
                      onChange={(e) => setSleepEnd(e.target.value)}
                      className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-3 py-2 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)] [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-1">
                  <AccessTimeRoundedIcon className="text-[var(--text-secondary)]" fontSize="small" />
                  Other unavailable hours? <span className="text-[11px] font-normal text-[var(--text-secondary)]">(Optional)</span>
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)] mb-2">
                  E.g., class times, lunch break, recurring obligations.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] mb-1 block">Start Time</label>
                    <input
                      type="time"
                      value={unavailableStart}
                      onChange={(e) => setUnavailableStart(e.target.value)}
                      className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-3 py-2 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)] [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] mb-1 block">End Time</label>
                    <input
                      type="time"
                      value={unavailableEnd}
                      onChange={(e) => setUnavailableEnd(e.target.value)}
                      className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-3 py-2 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)] [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Max Work Hours */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-1">
                  <WorkRoundedIcon className="text-[var(--text-secondary)]" fontSize="small" />
                  Maximum work capacity per day
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)] mb-4">
                  How many hours can you dedicate to working on tasks in a single day?
                </p>
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="16"
                      value={workHours}
                      onChange={(e) => setWorkHours(Number(e.target.value))}
                      className="w-48 accent-[var(--accent)] cursor-pointer"
                    />
                    <span className="text-2xl font-bold w-12 text-center text-[var(--accent)]">
                      {workHours}h
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--text-secondary)] mt-3">
                    Recommended: 6-8 hours for optimal focus and preventing burnout.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Soothing Loader */}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center flex-1 py-8 relative">
              {/* Pulsing Central Core */}
              <div className="relative flex items-center justify-center w-24 h-24 mb-6">
                <div className="absolute inset-0 rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/30 animate-ping opacity-75" />
                <div className="absolute w-16 h-16 rounded-full bg-gradient-to-tr from-[var(--accent)] to-cyan-400 opacity-20 blur-md animate-pulse" />
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--accent)] text-white shadow-lg relative z-10 animate-pulse">
                  <AutoAwesomeRoundedIcon fontSize="medium" className="animate-spin-slow" />
                </div>
              </div>
              <p className="text-sm font-bold text-center text-[var(--text-primary)]">
                AI Scheduling in Progress
              </p>
              <p className="text-xs text-center text-[var(--text-secondary)] mt-2 max-w-[80%] animate-pulse">
                {statusText}
              </p>
            </div>
          )}

          {/* Footer Controls */}
          {step !== 3 && (
            <div className="mt-8 flex justify-between border-t border-[var(--border-color)] pt-4">
              {step === 2 ? (
                <button
                  onClick={handleBack}
                  className="rounded-xl border border-[var(--border-color)] px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowBackRoundedIcon fontSize="inherit" /> Back
                </button>
              ) : (
                <div />
              )}

              {step === 1 ? (
                <button
                  onClick={handleNext}
                  className="rounded-xl bg-[var(--accent)] text-white px-5 py-2.5 text-xs font-semibold hover:bg-[var(--accent)]/95 transition flex items-center gap-1.5 ml-auto cursor-pointer"
                >
                  Next <ArrowForwardRoundedIcon fontSize="inherit" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="rounded-xl bg-[var(--accent)] text-white px-5 py-2.5 text-xs font-semibold hover:bg-[var(--accent)]/95 transition flex items-center gap-1.5 ml-auto cursor-pointer"
                >
                  Solve Schedule ✨
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
