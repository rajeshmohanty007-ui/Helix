import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

const Topbar = ({title}) => {

  return (
    <nav className="fixed top-0 left-0 w-full h-16 border-b border-[var(--border-color)] backdrop-blur-xl shadow-lg bg-(--bg-sidebar) z-50">
      <div className="mx-auto flex justify-between items-center max-w-8xl px-6 h-full">
        <div className="flex items-center gap-2">
        <DashboardRoundedIcon />
        <h1 className="font-Saira text-3xl text-[var(--accent)] font-bold">
          {title}
        </h1>
        </div>
        <div className="flex items-center gap-4">
          <SearchRoundedIcon/>
          <NotificationsRoundedIcon/>
          <AccountCircleRoundedIcon/>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
