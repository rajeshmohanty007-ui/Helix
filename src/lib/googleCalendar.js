import { prisma } from "@/lib/prisma";
import { getEventStatus, formatDateString, getTodayString } from "@/ScriptFunc/calendar";
import { isRecurrenceStillActive } from "@/lib/recurrence";

/**
 * Ensures a fresh and valid Google Access Token for the user.
 * Automatically exchanges the refresh token if expired.
 */
export async function getValidGoogleAccessToken(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      googleAccessToken: true,
      googleRefreshToken: true,
      googleTokenExpiry: true,
    },
  });

  if (!user || (!user.googleAccessToken && !user.googleRefreshToken)) {
    return null;
  }

  const isExpired =
    !user.googleAccessToken ||
    !user.googleTokenExpiry ||
    new Date(user.googleTokenExpiry).getTime() <= Date.now() + 5 * 60 * 1000;

  if (isExpired && user.googleRefreshToken) {
    try {
      const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID || "",
          client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
          grant_type: "refresh_token",
          refresh_token: user.googleRefreshToken,
        }),
      });

      const data = await res.json();
      if (res.ok && data.access_token) {
        const newExpiry = new Date(Date.now() + (data.expires_in || 3600) * 1000);
        await prisma.user.update({
          where: { id: userId },
          data: {
            googleAccessToken: data.access_token,
            googleTokenExpiry: newExpiry,
          },
        });
        return data.access_token;
      } else {
        console.warn("Failed to refresh Google token:", data);
      }
    } catch (err) {
      console.error("Error refreshing Google Access Token:", err);
    }
  }

  return user.googleAccessToken || null;
}

/**
 * Format a Helix event into Google Calendar event resource payload
 */
function toGoogleEventPayload(event) {
  const dateStr = formatDateString(event.date);
  const startTime = event.startTime || "09:00";
  const endTime = event.endTime || "10:00";

  // Build ISO-8601 strings
  const startDateTime = new Date(`${dateStr}T${startTime}:00`).toISOString();
  const endDateTime = new Date(`${dateStr}T${endTime}:00`).toISOString();

  const payload = {
    summary: event.title,
    description: event.description || "",
    start: {
      dateTime: startDateTime,
    },
    end: {
      dateTime: endDateTime,
    },
  };

  if (event.recurrenceRule) {
    let rule = event.recurrenceRule;
    if (event.repeatUntil && !rule.toUpperCase().includes("UNTIL=")) {
      const untilStr = new Date(event.repeatUntil).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      rule += `;UNTIL=${untilStr}`;
    }
    payload.recurrence = [rule];
  } else if (event.repeat && event.repeat !== "none") {
    const freq = event.repeat.toUpperCase();
    let rule = `RRULE:FREQ=${freq}`;
    if (event.repeatUntil) {
      const untilStr = new Date(event.repeatUntil).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      rule += `;UNTIL=${untilStr}`;
    }
    payload.recurrence = [rule];
  }

  return payload;
}

/**
 * Create a new event on Google Calendar
 */
export async function createGoogleCalendarEvent(accessToken, event) {
  if (!accessToken) return null;
  try {
    const payload = toGoogleEventPayload(event);
    const res = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.warn("Google Calendar create error:", err);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("createGoogleCalendarEvent error:", err);
    return null;
  }
}

/**
 * Update an existing event on Google Calendar
 */
export async function updateGoogleCalendarEvent(accessToken, googleEventId, event) {
  if (!accessToken || !googleEventId) return null;
  try {
    const payload = toGoogleEventPayload(event);
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(googleEventId)}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.warn("Google Calendar update error:", err);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("updateGoogleCalendarEvent error:", err);
    return null;
  }
}

/**
 * Delete an event on Google Calendar
 */
export async function deleteGoogleCalendarEvent(accessToken, googleEventId) {
  if (!accessToken || !googleEventId) return false;
  try {
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(googleEventId)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return res.ok || res.status === 404; // 404 means already deleted
  } catch (err) {
    console.error("deleteGoogleCalendarEvent error:", err);
    return false;
  }
}

/**
 * Bidirectional Sync between Google Calendar and Helix Calendar
 */
export async function syncGoogleCalendar(userId) {
  const accessToken = await getValidGoogleAccessToken(userId);
  if (!accessToken) {
    throw new Error("GOOGLE_CALENDAR_NOT_CONNECTED");
  }

  // 1. Fetch all master events from Google Calendar (without restrictive timeMin cutoff so past repeating events are included)
  const googleEvents = [];
  let pageToken = null;

  do {
    const googleUrl = new URL(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events"
    );
    googleUrl.searchParams.set("singleEvents", "false");
    googleUrl.searchParams.set("maxResults", "250");
    if (pageToken) {
      googleUrl.searchParams.set("pageToken", pageToken);
    }

    const gRes = await fetch(googleUrl.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!gRes.ok) {
      const err = await gRes.json();
      throw new Error(err?.error?.message || "Failed to fetch Google Calendar events");
    }

    const gData = await gRes.json();
    if (Array.isArray(gData.items)) {
      googleEvents.push(...gData.items);
    }
    pageToken = gData.nextPageToken;
  } while (pageToken);

  let pulledCount = 0;
  let pushedCount = 0;
  const todayStr = getTodayString();

  // 2. Pull Google events into Helix
  for (const gEvt of googleEvents) {
    if (gEvt.status === "cancelled") {
      // If deleted on Google, remove from Helix if present
      await prisma.calendarEvent.deleteMany({
        where: {
          googleEventId: gEvt.id,
          creatorId: userId,
        },
      });
      continue;
    }

    let dateStr = "";
    let startTime = "09:00";
    let endTime = "10:00";

    if (gEvt.start?.dateTime) {
      const startD = new Date(gEvt.start.dateTime);
      const endD = gEvt.end?.dateTime ? new Date(gEvt.end.dateTime) : startD;

      const y = startD.getFullYear();
      const m = String(startD.getMonth() + 1).padStart(2, "0");
      const d = String(startD.getDate()).padStart(2, "0");
      dateStr = `${y}-${m}-${d}`;

      startTime = `${String(startD.getHours()).padStart(2, "0")}:${String(startD.getMinutes()).padStart(2, "0")}`;
      endTime = `${String(endD.getHours()).padStart(2, "0")}:${String(endD.getMinutes()).padStart(2, "0")}`;
    } else if (gEvt.start?.date) {
      // All day event
      dateStr = gEvt.start.date;
      startTime = "09:00";
      endTime = "18:00";
    }

    if (!dateStr) continue;

    const isRepeating = Array.isArray(gEvt.recurrence) && gEvt.recurrence.length > 0;
    const eventDate = new Date(dateStr + "T00:00:00Z");

    // Filter rule:
    // If non-repeating event created in past and has passed: SKIP IT!
    if (!isRepeating) {
      if (dateStr < todayStr) {
        continue;
      }
    } else {
      // If repeating event created in past: only include if STILL repeating!
      const rawRecurrenceRule = gEvt.recurrence[0];
      const stillActive = isRecurrenceStillActive(rawRecurrenceRule, eventDate);
      if (!stillActive) {
        continue;
      }
    }

    const status = getEventStatus(eventDate, startTime, endTime);
    const title = gEvt.summary || "Google Calendar Event";
    const description = gEvt.description || "";

    // Parse recurrence rule from Google event
    let repeat = "none";
    let recurrenceRule = null;
    if (isRepeating) {
      recurrenceRule = gEvt.recurrence[0];
      const upper = recurrenceRule.toUpperCase();
      if (upper.includes("FREQ=DAILY")) repeat = "daily";
      else if (upper.includes("FREQ=WEEKLY")) repeat = "weekly";
      else if (upper.includes("FREQ=MONTHLY")) repeat = "monthly";
      else if (upper.includes("FREQ=YEARLY")) repeat = "yearly";
    }

    const existing = await prisma.calendarEvent.findFirst({
      where: {
        googleEventId: gEvt.id,
        creatorId: userId,
      },
    });

    if (existing) {
      await prisma.calendarEvent.update({
        where: { id: existing.id },
        data: {
          title,
          description,
          date: eventDate,
          startTime,
          endTime,
          repeat,
          recurrenceRule,
          status,
        },
      });
    } else {
      await prisma.calendarEvent.create({
        data: {
          title,
          description,
          date: eventDate,
          startTime,
          endTime,
          type: "meeting",
          priority: "medium",
          status,
          repeat,
          recurrenceRule,
          googleEventId: gEvt.id,
          creatorId: userId,
        },
      });
    }

    pulledCount++;
  }

  // 3. Push unsynced Helix events to Google Calendar
  // Only push:
  // - Still repeating events (even if created in the past)
  // - Active/future non-repeating events (skip passed single events)
  const unsyncedHelixEvents = await prisma.calendarEvent.findMany({
    where: {
      creatorId: userId,
      googleEventId: null,
    },
  });

  for (const hEvt of unsyncedHelixEvents) {
    const isRepeating = hEvt.repeat && hEvt.repeat !== "none";
    const hDateStr = formatDateString(hEvt.date);

    if (!isRepeating) {
      // Skip non-repeating event created in past that has passed
      if (hDateStr < todayStr) {
        continue;
      }
    } else {
      // Repeating event: check if still repeating
      const stillActive = isRecurrenceStillActive(
        hEvt.recurrenceRule,
        hEvt.date,
        hEvt.repeatUntil
      );
      if (!stillActive) {
        continue;
      }
    }

    const createdGoogleEvt = await createGoogleCalendarEvent(accessToken, hEvt);
    if (createdGoogleEvt?.id) {
      await prisma.calendarEvent.update({
        where: { id: hEvt.id },
        data: {
          googleEventId: createdGoogleEvt.id,
        },
      });
      pushedCount++;
    }
  }

  // 4. Update sync timestamp on User
  const nowSync = new Date();
  await prisma.user.update({
    where: { id: userId },
    data: {
      lastGoogleCalendarSync: nowSync,
    },
  });

  return {
    success: true,
    pulledCount,
    pushedCount,
    lastSync: nowSync,
  };
}
