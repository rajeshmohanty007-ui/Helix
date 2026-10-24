import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import {
  getValidGoogleAccessToken,
  createGoogleCalendarEvent,
  updateGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
} from "@/lib/googleCalendar"
import { formatDateString, getEventStatus } from "@/ScriptFunc/calendar"
import { expandEvents, getRecurrenceRule } from "@/lib/recurrence"

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const startParam = searchParams.get("start")
    const endParam = searchParams.get("end")

    const events = await prisma.calendarEvent.findMany({
      where: {
        creatorId: session.user.id,
      },
      orderBy: [
        { date: "asc" },
        { startTime: "asc" },
      ],
    })

    // Expand recurring events dynamically into virtual occurrences
    const expandedEvents = expandEvents(events, {
      start: startParam ? new Date(startParam) : undefined,
      end: endParam ? new Date(endParam) : undefined,
    })

    return Response.json(expandedEvents)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    if (!body.title) {
      return Response.json({ error: "Title is required" }, { status: 400 })
    }
    if (!body.date) {
      return Response.json({ error: "Date is required" }, { status: 400 })
    }

    const dateObj = new Date(body.date + "T00:00:00Z")
    const startTime = body.startTime || "09:00"
    const endTime = body.endTime || "10:00"
    const repeat = body.repeat || "none"
    const recurrenceRule = getRecurrenceRule(repeat)

    let googleEventId = null

    // Sync with Google Calendar if connected (works for both single and recurring events natively)
    try {
      const accessToken = await getValidGoogleAccessToken(session.user.id)
      if (accessToken) {
        const gEvt = await createGoogleCalendarEvent(accessToken, {
          title: body.title,
          description: body.description,
          date: dateObj,
          startTime,
          endTime,
          repeat,
          recurrenceRule,
        })
        if (gEvt?.id) {
          googleEventId = gEvt.id
        }
      }
    } catch (err) {
      console.warn("Failed to push event to Google Calendar:", err)
    }

    const calculatedStatus = getEventStatus(dateObj, startTime, endTime)

    // Store exactly ONE event in database, containing recurrence rule
    const newEvent = await prisma.calendarEvent.create({
      data: {
        title: body.title,
        description: body.description || "",
        date: dateObj,
        startTime,
        endTime,
        type: body.type || "task",
        priority: body.priority || "medium",
        status: calculatedStatus,
        repeat,
        recurrenceRule,
        googleEventId,
        creatorId: session.user.id,
      },
    })

    return Response.json({ success: true, event: newEvent, googleEventId })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      id,
      title,
      description,
      date,
      startTime,
      endTime,
      type,
      priority,
      stopRepeating,
      isOccurrence,
    } = body

    if (!id) {
      return Response.json({ error: "Event ID is required" }, { status: 400 })
    }

    const targetEvent = await prisma.calendarEvent.findUnique({
      where: {
        id,
        creatorId: session.user.id,
      },
    })

    if (!targetEvent) {
      return Response.json({ error: "Event not found" }, { status: 404 })
    }

    const dateObj = date ? new Date(date + "T00:00:00Z") : targetEvent.date
    const newStartTime = startTime !== undefined ? startTime : targetEvent.startTime
    const newEndTime = endTime !== undefined ? endTime : targetEvent.endTime
    const calculatedStatus = getEventStatus(dateObj, newStartTime, newEndTime)

    // Case 1: User explicitly converts repeating event to a standalone event
    if (stopRepeating && targetEvent.repeat !== "none") {
      const updatedEvent = await prisma.calendarEvent.update({
        where: { id, creatorId: session.user.id },
        data: {
          title: title !== undefined ? title : targetEvent.title,
          description: description !== undefined ? description : targetEvent.description,
          date: dateObj,
          startTime: newStartTime,
          endTime: newEndTime,
          type: type !== undefined ? type : targetEvent.type,
          priority: priority !== undefined ? priority : targetEvent.priority,
          status: calculatedStatus,
          repeat: "none",
          recurrenceRule: null,
          repeatUntil: null,
          excludedDates: null,
          repeatGroupId: null,
        },
      })

      // Update in Google Calendar
      if (targetEvent.googleEventId) {
        try {
          const accessToken = await getValidGoogleAccessToken(session.user.id)
          if (accessToken) {
            await updateGoogleCalendarEvent(accessToken, targetEvent.googleEventId, updatedEvent)
          }
        } catch (err) {
          console.warn("Failed to update Google Calendar event:", err)
        }
      }

      return Response.json({ success: true, event: updatedEvent })
    }

    // Case 2: User edited only a single occurrence of a repeating event
    if (isOccurrence && targetEvent.repeat !== "none" && date) {
      const occurrenceDateStr = formatDateString(dateObj)
      
      // Add occurrence date to master event's excludedDates
      let excludedList = []
      if (targetEvent.excludedDates) {
        try {
          excludedList = JSON.parse(targetEvent.excludedDates)
        } catch {}
      }
      if (!excludedList.includes(occurrenceDateStr)) {
        excludedList.push(occurrenceDateStr)
        await prisma.calendarEvent.update({
          where: { id },
          data: {
            excludedDates: JSON.stringify(excludedList),
          },
        })
      }

      // Create a standalone override event for this day
      const standaloneEvent = await prisma.calendarEvent.create({
        data: {
          title: title !== undefined ? title : targetEvent.title,
          description: description !== undefined ? description : targetEvent.description,
          date: dateObj,
          startTime: newStartTime,
          endTime: newEndTime,
          type: type !== undefined ? type : targetEvent.type,
          priority: priority !== undefined ? priority : targetEvent.priority,
          status: calculatedStatus,
          repeat: "none",
          repeatGroupId: targetEvent.id, // linked to master
          creatorId: session.user.id,
        },
      })

      return Response.json({ success: true, event: standaloneEvent })
    }

    // Case 3: Standard update (either non-repeating, or updating the recurring master series)
    const updatedEvent = await prisma.calendarEvent.update({
      where: {
        id,
        creatorId: session.user.id,
      },
      data: {
        title: title !== undefined ? title : targetEvent.title,
        description: description !== undefined ? description : targetEvent.description,
        date: dateObj,
        startTime: newStartTime,
        endTime: newEndTime,
        type: type !== undefined ? type : targetEvent.type,
        priority: priority !== undefined ? priority : targetEvent.priority,
        status: calculatedStatus,
      },
    })

    // Update in Google Calendar if synced
    if (targetEvent.googleEventId) {
      try {
        const accessToken = await getValidGoogleAccessToken(session.user.id)
        if (accessToken) {
          await updateGoogleCalendarEvent(accessToken, targetEvent.googleEventId, updatedEvent)
        }
      } catch (err) {
        console.warn("Failed to update Google Calendar event:", err)
      }
    }

    return Response.json({ success: true, event: updatedEvent })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const mode = searchParams.get("mode") || "single" // "single", "following", "all"
    const dateParam = searchParams.get("date")

    if (!id) {
      return Response.json({ error: "Event ID is required" }, { status: 400 })
    }

    const targetEvent = await prisma.calendarEvent.findUnique({
      where: {
        id,
        creatorId: session.user.id,
      },
    })

    if (!targetEvent) {
      return Response.json({ error: "Event not found" }, { status: 404 })
    }

    const isRepeating = targetEvent.repeat && targetEvent.repeat !== "none"

    if (mode === "all" || !isRepeating) {
      // Delete Google Calendar event if synced
      if (targetEvent.googleEventId) {
        try {
          const accessToken = await getValidGoogleAccessToken(session.user.id)
          if (accessToken) {
            await deleteGoogleCalendarEvent(accessToken, targetEvent.googleEventId)
          }
        } catch (err) {
          console.warn("Failed to delete event from Google Calendar:", err)
        }
      }

      // Delete the master event
      await prisma.calendarEvent.delete({
        where: { id },
      })

      // Delete any associated overrides or legacy group events
      if (targetEvent.repeatGroupId || isRepeating) {
        await prisma.calendarEvent.deleteMany({
          where: {
            OR: [
              { repeatGroupId: id },
              targetEvent.repeatGroupId ? { repeatGroupId: targetEvent.repeatGroupId } : { id: "none" }
            ],
            creatorId: session.user.id,
          },
        })
      }
    } else if (mode === "single" && isRepeating && dateParam) {
      // Exclude only this specific occurrence
      let excludedList = []
      if (targetEvent.excludedDates) {
        try {
          excludedList = JSON.parse(targetEvent.excludedDates)
        } catch {}
      }

      if (!excludedList.includes(dateParam)) {
        excludedList.push(dateParam)
        await prisma.calendarEvent.update({
          where: { id },
          data: {
            excludedDates: JSON.stringify(excludedList),
          },
        })
      }
    } else if (mode === "following" && isRepeating && dateParam) {
      // End recurrence on the day before dateParam
      const cutoffDate = new Date(dateParam + "T00:00:00Z")
      cutoffDate.setUTCDate(cutoffDate.getUTCDate() - 1)

      const origDate = new Date(targetEvent.date)
      if (cutoffDate < origDate) {
        // Cutoff is before the series started, delete the whole event
        if (targetEvent.googleEventId) {
          try {
            const accessToken = await getValidGoogleAccessToken(session.user.id)
            if (accessToken) {
              await deleteGoogleCalendarEvent(accessToken, targetEvent.googleEventId)
            }
          } catch (err) {}
        }
        await prisma.calendarEvent.delete({ where: { id } })
      } else {
        await prisma.calendarEvent.update({
          where: { id },
          data: {
            repeatUntil: cutoffDate,
          },
        })
      }
    } else {
      // Default fallback
      await prisma.calendarEvent.delete({
        where: { id },
      })
    }

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
