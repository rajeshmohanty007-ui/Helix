export const dismissNotification = (id, dismissedIds, setDismissedIds) => {
  const updatedDismissed = [...dismissedIds, id];
  setDismissedIds(updatedDismissed);
  if (typeof window !== "undefined") {
    localStorage.setItem("dismissed-notifications", JSON.stringify(updatedDismissed));
  }
};

export const clearAllNotifications = (filteredNotifications, dismissedIds, setDismissedIds) => {
  const allVisibleIds = filteredNotifications.map((n) => n.id);
  const updatedDismissed = [...dismissedIds, ...allVisibleIds];
  setDismissedIds(updatedDismissed);
  if (typeof window !== "undefined") {
    localStorage.setItem("dismissed-notifications", JSON.stringify(updatedDismissed));
  }
};
