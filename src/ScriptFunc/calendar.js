export const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDateString = (dateInput) => {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getEventStatus = (eventDateVal, startTime, endTime) => {
  const now = new Date();
  const eventDate = new Date(eventDateVal);

  const y = eventDate.getUTCFullYear();
  const m = String(eventDate.getUTCMonth() + 1).padStart(2, "0");
  const d = String(eventDate.getUTCDate()).padStart(2, "0");
  const eventDateStr = `${y}-${m}-${d}`;

  const todayY = now.getFullYear();
  const todayM = String(now.getMonth() + 1).padStart(2, "0");
  const todayD = String(now.getDate()).padStart(2, "0");
  const todayStr = `${todayY}-${todayM}-${todayD}`;

  if (eventDateStr < todayStr) {
    return "completed";
  } else if (eventDateStr > todayStr) {
    return "pending";
  } else {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const parseTimeToMinutes = (timeStr) => {
      if (!timeStr) return 0;
      const [h, min] = timeStr.split(":").map(Number);
      return (h || 0) * 60 + (min || 0);
    };

    const startMinutes = parseTimeToMinutes(startTime);
    const endMinutes = parseTimeToMinutes(endTime);

    if (currentMinutes < startMinutes) {
      return "pending";
    } else if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
      return "in-progress";
    } else {
      return "completed";
    }
  }
};

