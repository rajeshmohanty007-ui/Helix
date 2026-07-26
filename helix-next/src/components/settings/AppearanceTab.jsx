"use client";

import { useTheme, ACCENT_PRESETS } from "@/context/ThemeContext";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import FormatSizeRoundedIcon from "@mui/icons-material/FormatSizeRounded";
import ColorLensRoundedIcon from "@mui/icons-material/ColorLensRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

export default function AppearanceTab() {
  const {
    dark,
    setDark,
    fontSize,
    setFontSize,
    accentPreset,
    setAccentPreset,
    customAccent,
    setCustomAccent,
  } = useTheme();

  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <h3 className="text-lg font-bold text-[var(--text-primary)]">Appearance & Theme</h3>
        <p className="text-xs text-[var(--text-secondary)]">Customize theme mode, fonts, and unique highlight colors</p>
      </div>

      {/* Theme selection mode cards */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-[var(--text-primary)]">Interface Theme</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Light Theme Card */}
          <button
            type="button"
            onClick={() => setDark(false)}
            className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition cursor-pointer select-none ${
              !dark
                ? "border-[var(--accent)] bg-[var(--bg-hover)] text-[var(--accent)] font-semibold shadow-sm"
                : "border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            <WbSunnyRoundedIcon className="mb-2" />
            <span className="text-sm">Light Mode</span>
          </button>

          {/* Dark Theme Card */}
          <button
            type="button"
            onClick={() => setDark(true)}
            className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition cursor-pointer select-none ${
              dark
                ? "border-[var(--accent)] bg-[var(--bg-hover)] text-[var(--accent)] font-semibold shadow-sm"
                : "border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            <DarkModeRoundedIcon className="mb-2" />
            <span className="text-sm">Dark Mode</span>
          </button>
        </div>
      </div>

      {/* Font Size Settings */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <FormatSizeRoundedIcon fontSize="small" className="text-[var(--text-secondary)]" />
          <h4 className="text-sm font-semibold text-[var(--text-primary)]">Text Font Size</h4>
        </div>
        <div className="flex gap-2 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] p-1">
          {["small", "medium", "large"].map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setFontSize(sz)}
              className={`flex-1 rounded-xl py-2.5 text-xs font-semibold capitalize transition text-center cursor-pointer select-none ${
                fontSize === sz
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Color Theme Selector Grid */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <ColorLensRoundedIcon fontSize="small" className="text-[var(--text-secondary)]" />
          <h4 className="text-sm font-semibold text-[var(--text-primary)]">Accent Highlight Color</h4>
        </div>

        {/* Presets and Custom grid selector */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {Object.keys(ACCENT_PRESETS).map((key) => {
            const preset = ACCENT_PRESETS[key];
            const activeColor = dark ? preset.dark : preset.light;
            const isSelected = accentPreset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setAccentPreset(key)}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-3 transition text-center cursor-pointer ${
                  isSelected
                    ? "border-[var(--accent)] bg-[var(--bg-hover)] font-semibold shadow-sm"
                    : "border-[var(--border-color)] bg-[var(--bg-main)] hover:bg-[var(--bg-hover)]"
                }`}
              >
                <span
                  className="h-6 w-6 rounded-full border border-black/10 shadow-inner flex items-center justify-center text-white"
                  style={{ backgroundColor: activeColor }}
                >
                  {isSelected && <CheckRoundedIcon sx={{ fontSize: 14 }} />}
                </span>
                <span className="text-[10px] text-[var(--text-primary)] truncate max-w-full">
                  {preset.name}
                </span>
              </button>
            );
          })}

          {/* Custom color preset toggle */}
          <button
            type="button"
            onClick={() => {
              setAccentPreset("custom");
              if (!customAccent) {
                setCustomAccent(dark ? "#8b5cf6" : "#7c3aed");
              }
            }}
            className={`flex flex-col items-center gap-2 rounded-2xl border p-3 transition text-center cursor-pointer ${
              accentPreset === "custom"
                ? "border-[var(--accent)] bg-[var(--bg-hover)] font-semibold shadow-sm"
                : "border-[var(--border-color)] bg-[var(--bg-main)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            <span
              className="h-6 w-6 rounded-full border border-black/10 shadow-inner flex items-center justify-center text-white overflow-hidden bg-gradient-to-tr from-purple-500 via-blue-500 to-green-500"
            >
              {accentPreset === "custom" && <CheckRoundedIcon sx={{ fontSize: 14 }} />}
            </span>
            <span className="text-[10px] text-[var(--text-primary)]">Custom Accent</span>
          </button>
        </div>

        {/* Show color picker details if custom accent is selected */}
        {accentPreset === "custom" && (
          <div className="mt-4 flex items-center gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] p-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-[var(--border-color)] cursor-pointer">
              <input
                type="color"
                value={customAccent || (dark ? "#8b5cf6" : "#7c3aed")}
                onChange={(e) => setCustomAccent(e.target.value)}
                className="absolute inset-0 h-full w-full border-none p-0 cursor-pointer"
                style={{ transform: "scale(1.4)" }}
              />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[var(--text-primary)]">Pick a Highlight Color</h4>
              <p className="font-mono text-xs text-[var(--text-secondary)]">{customAccent || (dark ? "#8b5cf6" : "#7c3aed")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
