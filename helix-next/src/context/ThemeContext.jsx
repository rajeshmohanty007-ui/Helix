"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export const ACCENT_PRESETS = {
  purple: { light: "#7c3aed", dark: "#8b5cf6", name: "Helix Purple" },
  blue: { light: "#2563eb", dark: "#60a5fa", name: "Ocean Blue" },
  green: { light: "#16a34a", dark: "#4ade80", name: "Forest Green" },
  orange: { light: "#ea580c", dark: "#f97316", name: "Sunset Orange" },
  red: { light: "#dc2626", dark: "#f87171", name: "Crimson Red" },
  pink: { light: "#db2777", dark: "#f472b6", name: "Rose Pink" },
};

export const ThemeProvider = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return localStorage.getItem("theme") === "dark";
  });

  const [fontSize, setFontSize] = useState("medium");
  const [accentPreset, setAccentPreset] = useState("purple");
  const [customAccent, setCustomAccent] = useState("");

  // Load additional settings from localStorage once mounted
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFontSize = localStorage.getItem("font-size");
      if (storedFontSize) setFontSize(storedFontSize);

      const storedPreset = localStorage.getItem("accent-preset");
      if (storedPreset) setAccentPreset(storedPreset);

      const storedCustom = localStorage.getItem("custom-accent");
      if (storedCustom) setCustomAccent(storedCustom);
    }
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // Apply font size class
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.remove("font-size-small", "font-size-medium", "font-size-large");
    document.documentElement.classList.add(`font-size-${fontSize}`);
    localStorage.setItem("font-size", fontSize);
  }, [fontSize, mounted]);

  // Apply accent colors
  useEffect(() => {
    if (!mounted) return;
    if (accentPreset === "custom" && customAccent) {
      document.documentElement.style.setProperty("--accent", customAccent);
    } else {
      const preset = ACCENT_PRESETS[accentPreset] || ACCENT_PRESETS.purple;
      const color = dark ? preset.dark : preset.light;
      document.documentElement.style.setProperty("--accent", color);
    }
    localStorage.setItem("accent-preset", accentPreset);
    localStorage.setItem("custom-accent", customAccent);
  }, [accentPreset, customAccent, dark, mounted]);

  const toggleTheme = () => {
    setDark((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        dark,
        setDark,
        toggleTheme,
        fontSize,
        setFontSize,
        accentPreset,
        setAccentPreset,
        customAccent,
        setCustomAccent,
        mounted
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
};

