"use client";

import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";

export default function SettingsSidebar({
  activeTab,
  setActiveTab,
  mobileShowActions,
  setMobileShowActions,
}) {
  const sidebarItems = [
    { id: "profile", label: "Profile & Account", icon: PersonRoundedIcon },
    { id: "appearance", label: "Appearance & Theme", icon: PaletteRoundedIcon },
    { id: "notifications", label: "Notification Settings", icon: NotificationsRoundedIcon },
  ];

  return (
    <div
      className={`h-full w-full flex-col border-r border-[var(--border-color)] bg-[var(--bg-sidebar)] md:flex md:w-[30%] shrink-0 ${
        mobileShowActions ? "hidden" : "flex"
      }`}
    >
      <div className="p-4 border-b border-[var(--border-color)]">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          Helix Settings
        </h2>
      </div>
      <div className="flex-1 space-y-1 p-2 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isSelected = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileShowActions(true);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition text-sm font-medium cursor-pointer ${
                isSelected
                  ? "text-[var(--text-primary)] hover:bg-[var(--bg-hover)] md:bg-[var(--accent)] md:text-white md:shadow-sm md:hover:bg-[var(--accent)] md:hover:text-white"
                  : "text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              <Icon fontSize="small" />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
