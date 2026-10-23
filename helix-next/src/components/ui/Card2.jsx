const Card2 = ({
  profile,
  username,
  relation,
  action,
  description,
  time,
}) => {
  return (
    <div className="group flex items-start gap-4 rounded-3xl border border-(--border-color) bg-(--bg-card) p-4 transition-all duration-300 hover:border-violet-500/20 hover:bg-(--bg-hover)">

      {/* Profile Picture */}
      <img
        src={profile}
        alt={username}
        className="h-14 w-14 rounded-2xl object-cover"
      />

      {/* Content */}
      <div className="flex flex-1 flex-col">

        {/* Top */}
        <div className="flex items-start justify-between gap-4">

          <div>
            <h3 className="text-base font-semibold text-(--text-primary)">
              {username}
            </h3>

            <p className="text-sm text-(--text-secondary)">
              {relation}
            </p>
          </div>

          <span className="text-xs text-(--text-secondary)">
            {time}
          </span>
        </div>

        {/* Action */}
        <p className="mt-3 text-sm font-medium text-violet-400">
          {action}
        </p>

        {/* Description */}
        <p className="mt-1 text-sm leading-relaxed text-(--text-secondary)">
          {description}
        </p>
      </div>

    </div>
  );
};

export default Card2;