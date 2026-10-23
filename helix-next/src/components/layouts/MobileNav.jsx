import CampaignIcon from "@mui/icons-material/Campaign";
import FlagIcon from "@mui/icons-material/Flag";
import ForumIcon from "@mui/icons-material/Forum";

const tabs = [
  {
    key: "updates",
    label: "Updates",
    icon: <CampaignIcon fontSize="small" />,
  },
  {
    key: "objectives",
    label: "Objectives",
    icon: <FlagIcon fontSize="small" />,
  },
  {
    key: "chats",
    label: "Chats",
    icon: <ForumIcon fontSize="small" />,
  },
];

const MobileNav = ({ active, setActive }) => {
  return (
    <nav className="flex border-t border-(--border-color) bg-(--bg-card) w-full rounded-t-2xl">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActive(tab.key)}
          className={`flex flex-1 flex-col items-center gap-1 py-2 text-xs transition
          ${
            active === tab.key
              ? "text-(--accent)"
              : "text-(--text-secondary)"
          }`}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default MobileNav;