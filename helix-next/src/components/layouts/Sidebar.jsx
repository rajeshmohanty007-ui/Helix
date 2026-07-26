import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import Btn1 from "../ui/Btn1";
import ThemeToggle from "./ThemeToggle";

const Sidebar = ({ collapsed, setCollapsed, sec, onProfileClick }) => {
  const [btn, setBtn] = useState(sec);
  const { dark, toggleTheme } = useTheme();
  return (
    <div
      className={`workspace-height fixed top-16 left-0 z-50 flex flex-col border-r border-[var(--border-color)] bg-[var(--bg-sidebar)] backdrop-blur-2xl transition-all duration-300 ease-in-out md:relative md:top-0 ${collapsed ? "-translate-x-full md:w-20 md:translate-x-0" : "w-72 translate-x-0"} `}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`absolute top-1/2 -right-3 z-50 flex h-10 w-6 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-r-xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-lg transition hover:bg-[var(--bg-hover)] md:translate-x-0`}
      >
        <ChevronRightRoundedIcon
          className={`transition-transform duration-300 ${
            collapsed ? "" : "rotate-180"
          }`}
        />
      </button>
      <div className="flex flex-col gap-2 p-2 overflow-y-auto helix-scroll"
      style={{height: 'calc(100% - 42px)'}}
      >
        <Btn1
          path="/dashboard"
          icon={<HomeRoundedIcon />}
          label="Home"
          coll={collapsed}
          active={btn === "Home"}
          hClick={() => {
            setBtn("Home");
          }}
        />
        <Btn1
          path="/projects"
          icon={<FolderRoundedIcon />}
          label="Projects"
          coll={collapsed}
          active={btn === "proj"}
          hClick={() => {
            setBtn("proj");
          }}
        />
        <Btn1
          path="/tasks"
          icon={<CheckBoxRoundedIcon />}
          label="Tasks"
          coll={collapsed}
          active={btn === "task"}
          hClick={() => {
            setBtn("task");
          }}
        />
        <Btn1
          path="/calendar"
          icon={<TodayRoundedIcon />}
          label="Calender"
          coll={collapsed}
          active={btn === "cal"}
          hClick={() => {
            setBtn("cal");
          }}
        />
      </div>
      <div className={`absolute bottom-0 left-0 z-51 flex w-full border-t border-[var(--border-color)] bg-[var(--bg-main)] transition-all duration-300 ${collapsed ? "flex-col items-center gap-4 py-4 px-2" : "items-center justify-between p-3"}`}>
        <div className="flex items-center gap-2">
          <Link href="/settings" className="flex items-center justify-center p-1 rounded-lg hover:bg-[var(--bg-hover)] transition" title="Settings">
            <SettingsRoundedIcon className="cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)]" />
          </Link>
          {!collapsed && <ThemeToggle />}
        </div>
        <button
          onClick={onProfileClick}
          type="button"
          className="flex items-center justify-center rounded-full p-1 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition"
        >
          <AccountCircleRoundedIcon />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
