"use client";
import { useTheme } from "@/context/ThemeContext";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";


const ThemeToggle = () => {
    const { dark, toggleTheme, mounted} = useTheme();
    if (!mounted) return null;
  return (
    <div onClick={toggleTheme}>
      {dark ? <DarkModeRoundedIcon /> : <WbSunnyRoundedIcon />}
    </div>
  );
};

export default ThemeToggle;
