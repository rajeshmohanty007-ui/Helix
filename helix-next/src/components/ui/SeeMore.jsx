import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const SeeMore = ({ onClick, children = "See More" }) => {
  return (
    <button
      onClick={onClick}
      className="
        flex items-center gap-1
        rounded-lg
        border border-(--border-color)
        bg-(--bg-card)
        px-3 py-1.5
        text-sm font-medium
        text-(--text-primary)
        transition-all duration-200
        hover:border-(--accent)
        hover:text-(--accent)
        hover:shadow-sm
        active:scale-95
      "
    >
      {children}
      <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
    </button>
  );
};

export default SeeMore;