export const formatDate = () => {
  const options = { day: "numeric", month: "short", year: "numeric" };
  return new Date().toLocaleDateString("en-US", options); // e.g. "26 Jul 2026"
};

export const formatElapsed = (isoString) => {
  try {
    const elapsed = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(elapsed / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return new Date(isoString).toLocaleDateString();
  } catch (e) {
    return "";
  }
};
