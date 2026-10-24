export const HARDCODED_OFFSET_MINUTES = 330; // +05:30 (IST)
export const HARDCODED_OFFSET_STRING = "+05:30";
export const HARDCODED_TIMEZONE_NAME = "Asia/Kolkata";

export const getTodayString = (offsetMinutes = HARDCODED_OFFSET_MINUTES) => {
  const now = new Date();
  const target = new Date(now.getTime() + offsetMinutes * 60 * 1000);
  const year = target.getUTCFullYear();
  const month = String(target.getUTCMonth() + 1).padStart(2, "0");
  const day = String(target.getUTCDate()).padStart(2, "0");
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

export const getEventStatus = (eventDateVal, startTime, endTime, offsetMinutes = HARDCODED_OFFSET_MINUTES) => {
  const now = new Date();
  const targetNow = new Date(now.getTime() + offsetMinutes * 60 * 1000);

  const todayY = targetNow.getUTCFullYear();
  const todayM = String(targetNow.getUTCMonth() + 1).padStart(2, "0");
  const todayD = String(targetNow.getUTCDate()).padStart(2, "0");
  const todayStr = `${todayY}-${todayM}-${todayD}`;

  const eventDate = new Date(eventDateVal);
  const y = eventDate.getUTCFullYear();
  const m = String(eventDate.getUTCMonth() + 1).padStart(2, "0");
  const d = String(eventDate.getUTCDate()).padStart(2, "0");
  const eventDateStr = `${y}-${m}-${d}`;

  if (eventDateStr < todayStr) {
    return "completed";
  } else if (eventDateStr > todayStr) {
    return "pending";
  } else {
    const currentMinutes = targetNow.getUTCHours() * 60 + targetNow.getUTCMinutes();

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
