import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const Card1 = ({ title, value, icon, growth }) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-(--border-color) bg-(--bg-card) p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      {/* Content */}
      <div className="relative flex items-center justify-between">
        
        {/* Left */}
        <div>
          <p className="text-sm font-medium text-(--text-secondary)">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-(--text-primary)">
            {value}
          </h2>
        </div>

        {/* Right Icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 transition-all duration-300 group-hover:scale-110">
          {icon}
        </div>
      </div>

      {/* Bottom */}
      <div className="relative mt-6 flex items-center gap-2 text-sm">
        
        <div className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-emerald-600">
          <TrendingUpIcon style={{ fontSize: "16px" }} />
          <span>{growth}%</span>
        </div>

        <span className="text-(--text-secondary)">
          Compared to last week
        </span>
      </div>
    </div>
  );
};

export default Card1;