import { RRule, rrulestr } from "rrule";
import { formatDateString, getEventStatus } from "../ScriptFunc/calendar.js";

/**
 * Maps simple repeat strings to standard iCal RRULE strings
 */
export function getRecurrenceRule(repeat) {
  switch (repeat) {
    case "daily":
      return "RRULE:FREQ=DAILY";
    case "weekly":
      return "RRULE:FREQ=WEEKLY";
    case "monthly":
      return "RRULE:FREQ=MONTHLY";
    case "yearly":
      return "RRULE:FREQ=YEARLY";
    default:
      return null;
  }
}

/**
 * Parses an RRULE string into our simple repeat string ("daily", "weekly", etc.)
 */
export function parseRecurrenceRule(ruleStr) {
  if (!ruleStr) return "none";
  const upper = ruleStr.toUpperCase();
  if (upper.includes("FREQ=DAILY")) return "daily";
  if (upper.includes("FREQ=WEEKLY")) return "weekly";
  if (upper.includes("FREQ=MONTHLY")) return "monthly";
  if (upper.includes("FREQ=YEARLY")) return "yearly";
  return "none";
}

/**
 * Checks whether a recurring event is still repeating on or after the current time.
 */
export function isRecurrenceStillActive(recurrenceRule, startDate, repeatUntil = null) {
  const now = new Date();

  if (repeatUntil && new Date(repeatUntil) < now) {
    return false;
  }

  if (!recurrenceRule) {
    // If repeat is active without a rule or until, it repeats indefinitely
    return true;
  }

  try {
    const dtstart = startDate ? new Date(startDate) : now;
    const rule = rrulestr(recurrenceRule, { dtstart });
    const nextOccurrence = rule.after(now, true);
    return nextOccurrence !== null;
  } catch {
    const match = recurrenceRule.match(/UNTIL=(\d{4})(\d{2})(\d{2})/);
    if (match) {
      const untilDate = new Date(`${match[1]}-${match[2]}-${match[3]}T23:59:59Z`);
      return untilDate >= now;
    }
    return true;
  }
}

const FREQ_MAP = {
  daily: RRule.DAILY,
  weekly: RRule.WEEKLY,
  monthly: RRule.MONTHLY,
  yearly: RRule.YEARLY,
};

/**
 * Expands recurring events within a given date window [start, end].
 * Non-recurring events within the window are passed through.
 * 
 * @param {Array} events - Array of Prisma CalendarEvent records
 * @param {Object} options - { start?: Date, end?: Date }
 * @returns {Array} Expanded list of events with virtual occurrences
 */
export function expandEvents(events, options = {}) {
  const now = new Date();
  // Default window: 6 months past to 18 months future
  const windowStart = options.start
    ? new Date(options.start)
    : new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
  const windowEnd = options.end
    ? new Date(options.end)
    : new Date(now.getTime() + 540 * 24 * 60 * 60 * 1000);

  const results = [];

  for (const event of events) {
    const isRepeating = event.repeat && event.repeat !== "none";

    if (!isRepeating) {
      // Non-repeating event: add if within window
      const eventDate = new Date(event.date);
      if (eventDate >= windowStart && eventDate <= windowEnd) {
        results.push({
          ...event,
          baseEventId: event.id,
          status: getEventStatus(event.date, event.startTime, event.endTime),
        });
      }
      continue;
    }

    // It is a repeating event
    try {
      const dtstart = new Date(event.date);
      const untilDate = event.repeatUntil ? new Date(event.repeatUntil) : null;

      // Parse excluded dates
      let excludedDatesSet = new Set();
      if (event.excludedDates) {
        try {
          const parsed = typeof event.excludedDates === "string"
            ? JSON.parse(event.excludedDates)
            : event.excludedDates;
          if (Array.isArray(parsed)) {
            excludedDatesSet = new Set(parsed);
          }
        } catch (e) {
          console.warn("Failed to parse excludedDates for event:", event.id, e);
        }
      }

      let occurrences = [];

      if (event.recurrenceRule && event.recurrenceRule.startsWith("RRULE:")) {
        try {
          const rule = rrulestr(event.recurrenceRule, {
            dtstart,
          });
          const effectiveEnd = untilDate && untilDate < windowEnd ? untilDate : windowEnd;
          occurrences = rule.between(windowStart, effectiveEnd, true);
        } catch {
          // Fallback if rrulestr parsing fails
          const freq = FREQ_MAP[event.repeat] || RRule.WEEKLY;
          const rule = new RRule({
            freq,
            dtstart,
            until: untilDate || undefined,
          });
          occurrences = rule.between(windowStart, windowEnd, true);
        }
      } else {
        const freq = FREQ_MAP[event.repeat] || RRule.WEEKLY;
        const rule = new RRule({
          freq,
          dtstart,
          until: untilDate || undefined,
        });
        occurrences = rule.between(windowStart, windowEnd, true);
      }

      // If original start date is within window and not already present, ensure it's evaluated
      const origDateStr = formatDateString(dtstart);
      const hasOrigDate = occurrences.some((d) => formatDateString(d) === origDateStr);
      if (!hasOrigDate && dtstart >= windowStart && dtstart <= windowEnd) {
        occurrences.unshift(dtstart);
      }

      for (const occDate of occurrences) {
        const dateStr = formatDateString(occDate);
        if (excludedDatesSet.has(dateStr)) {
          // Occurrence is excluded/deleted
          continue;
        }

        const calculatedStatus = getEventStatus(occDate, event.startTime, event.endTime);

        results.push({
          ...event,
          id: `${event.id}_${dateStr}`, // Virtual unique ID for frontend rendering
          baseEventId: event.id,        // Reference to master database event
          date: occDate,
          isRecurringInstance: true,
          status: calculatedStatus,
        });
      }
    } catch (err) {
      console.error(`Error expanding recurring event ${event.id}:`, err);
      // Fallback: include the base event
      results.push({
        ...event,
        baseEventId: event.id,
        status: getEventStatus(event.date, event.startTime, event.endTime),
      });
    }
  }

  // Sort by date and startTime
  results.sort((a, b) => {
    const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (diff !== 0) return diff;
    return (a.startTime || "").localeCompare(b.startTime || "");
  });

  return results;
}
