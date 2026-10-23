"use client";

import Image from "next/image";

export default function LoadingScreen({ fullScreen = true }) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-(--bg-main) gap-6 animate-in fade-in duration-300 ${
        fullScreen ? "h-screen w-screen" : "h-full w-full flex-1"
      }`}
    >
      <div className="relative flex items-center justify-center h-20 w-20">
        {/* Glow behind the logo */}
        <div className="absolute inset-0 bg-[var(--accent)]/15 blur-xl rounded-full animate-pulse" />

        {/* Pulsing Helix Logo */}
        <Image
          src="/helix_logo.svg"
          alt="Helix Loading"
          width={64}
          height={64}
          className="relative object-contain animate-[pulse_2s_infinite]"
        />
      </div>

      {/* Loading progress bar */}
      <div className="w-28 h-1 bg-[var(--border-color)] rounded-full overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-[var(--accent)] rounded-full animate-progress" />
      </div>
    </div>
  );
}
