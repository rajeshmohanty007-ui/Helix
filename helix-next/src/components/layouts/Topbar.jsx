import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import Link from "next/link";
import Image from "next/image";

const Topbar = ({ title, onProfileClick }) => {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 border-b border-[var(--border-color)] backdrop-blur-xl shadow-lg bg-(--bg-sidebar) z-50">
      <div className="mx-auto flex justify-between items-center max-w-8xl px-6 h-full">
        <div className="flex items-center gap-2">
          <Image
            src="/helix_logo.svg"
            alt="Helix Logo"
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />
          <h1 className="font-Saira text-3xl text-[var(--accent)] font-bold ml-1">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/notifications" 
            className="flex items-center justify-center p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition cursor-pointer"
            title="Notifications"
          >
            <NotificationsRoundedIcon />
          </Link>
          <button
            onClick={onProfileClick}
            type="button"
            className="flex items-center justify-center p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition cursor-pointer"
            title="User Profile"
          >
            <AccountCircleRoundedIcon />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
