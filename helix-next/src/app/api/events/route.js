import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

function getEventStatus(eventDateVal, startTime, endTime) {
  const now = new Date()
  const eventDate = new Date(eventDateVal)
  
  const y = eventDate.getUTCFullYear()
  const m = String(eventDate.getUTCMonth() + 1).padStart(2, "0")
  const d = String(eventDate.getUTCDate()).padStart(2, "0")
  const eventDateStr = `${y}-${m}-${d}`

  const todayY = now.getFullYear()
  const todayM = String(now.getMonth() + 1).padStart(2, "0")
  const todayD = String(now.getDate()).padStart(2, "0")
  const todayStr = `${todayY}-${todayM}-${todayD}`

  if (eventDateStr < todayStr) {
    return "completed"
  } else if (eventDateStr > todayStr) {
    return "pending"
  } else {
    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    
    const parseTimeToMinutes = (timeStr) => {
      if (!timeStr) return 0
      const [h, min] = timeStr.split(":").map(Number)
      return (h || 0) * 60 + (min || 0)
    }

    const startMinutes = parseTimeToMinutes(startTime)
    const endMinutes = parseTimeToMinutes(endTime)

    if (currentMinutes < startMinutes) {
      return "pending"
    } else if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
      return "in-progress"
    } else {
      return "completed"
    }
  }
}

function addDays(date, days) {
  const result = new Date(date)
  result.setUTCDate(result.getUTCDate() + days)
  return result
}

function addMonths(date, months) {
  const result = new Date(date)
  result.setUTCMonth(result.getUTCMonth() + months)
  return result
}

function addYears(date, years) {
  const result = new Date(date)
  result.setUTCFullYear(result.getUTCFullYear() + years)
  return result
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const events = await prisma.calendarEvent.findMany({
      where: {
        creatorId: session.user.id,
      },
      orderBy: [
        { date: "asc" },
        { startTime: "asc" }
      ],
    })

    const updatedEvents = events.map(event => ({
      ...event,
      status: getEventStatus(event.date, event.startTime, event.endTime)
    }))

    return Response.json(updatedEvents)
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

    const repeatGroupId = repeat !== "none" ? `group-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` : null
    const datesToCreate = []

    // Efficient long recurrence ranges (approximating forever)
    // Daily: 2 years (730 days)
    // Weekly: 2 years (104 weeks)
    // Monthly: 5 years (60 months)
    // Yearly: 10 years (10 years)
    if (repeat === "none") {
      datesToCreate.push(dateObj)
    } else if (repeat === "daily") {
      for (let i = 0; i < 730; i++) {
        datesToCreate.push(addDays(dateObj, i))
      }
    } else if (repeat === "weekly") {
      for (let i = 0; i < 104; i++) {
        datesToCreate.push(addDays(dateObj, i * 7))
      }
    } else if (repeat === "monthly") {
      for (let i = 0; i < 60; i++) {
        datesToCreate.push(addMonths(dateObj, i))
      }
    } else if (repeat === "yearly") {
      for (let i = 0; i < 10; i++) {
        datesToCreate.push(addYears(dateObj, i))
      }
    }

    const eventsData = datesToCreate.map((d) => {
      const calculatedStatus = getEventStatus(d, startTime, endTime)
      return {
        title: body.title,
        description: body.description || "",
        date: d,
        startTime,
        endTime,
        type: body.type || "task",
        priority: body.priority || "medium",
        status: calculatedStatus,
        repeat,
        repeatGroupId,
        creatorId: session.user.id,
      }
    })

    // Insert events using createMany in Postgres database for high efficiency
    await prisma.calendarEvent.createMany({
      data: eventsData,
    })

    return Response.json({ success: true })
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
    const { id, title, description, date, startTime, endTime, type, priority, stopRepeating } = body

    if (!id) {
      return Response.json({ error: "Event ID is required" }, { status: 400 })
    }

    // Retrieve target event first to verify permissions and get recurrence meta
    const targetEvent = await prisma.calendarEvent.findUnique({
      where: {
        id,
        creatorId: session.user.id,
      },
    })

    if (!targetEvent) {
      return Response.json({ error: "Event not found" }, { status: 404 })
    }

    const dateObj = date ? new Date(date + "T00:00:00Z") : undefined
    const calculatedStatus = dateObj ? getEventStatus(dateObj, startTime || "09:00", endTime || "10:00") : undefined

    if (targetEvent.repeatGroupId) {
      if (stopRepeating) {
        // Delete all other occurrences in the group
        await prisma.calendarEvent.deleteMany({
          where: {
            repeatGroupId: targetEvent.repeatGroupId,
            id: { not: id },
            creatorId: session.user.id
          }
        })

        // Update target event to stop repeating and stand alone
        const updatedEvent = await prisma.calendarEvent.update({
          where: { id, creatorId: session.user.id },
          data: {
            title: title !== undefined ? title : targetEvent.title,
            description: description !== undefined ? description : targetEvent.description,
            date: dateObj !== undefined ? dateObj : targetEvent.date,
            startTime: startTime !== undefined ? startTime : targetEvent.startTime,
            endTime: endTime !== undefined ? endTime : targetEvent.endTime,
            type: type !== undefined ? type : targetEvent.type,
            priority: priority !== undefined ? priority : targetEvent.priority,
            status: calculatedStatus !== undefined ? calculatedStatus : targetEvent.status,
            repeat: "none",
            repeatGroupId: null
          }
        })
        return Response.json({ success: true, event: updatedEvent })
      } else {
        // Calculate date shift
        const oldDate = new Date(targetEvent.date)
        const newDate = dateObj || oldDate
        const diffTime = newDate.getTime() - oldDate.getTime()

        // Fetch all events in this group
        const groupEvents = await prisma.calendarEvent.findMany({
          where: {
            repeatGroupId: targetEvent.repeatGroupId,
            creatorId: session.user.id
          }
        })

        const updatePromises = groupEvents.map((evt) => {
          const currentEventDate = new Date(evt.date)
          const updatedEventDate = new Date(currentEventDate.getTime() + diffTime)
          const newStatus = getEventStatus(updatedEventDate, startTime || evt.startTime, endTime || evt.endTime)

          return prisma.calendarEvent.update({
            where: { id: evt.id },
            data: {
              title: title !== undefined ? title : evt.title,
              description: description !== undefined ? description : evt.description,
              startTime: startTime !== undefined ? startTime : evt.startTime,
              endTime: endTime !== undefined ? endTime : evt.endTime,
              type: type !== undefined ? type : evt.type,
              priority: priority !== undefined ? priority : evt.priority,
              date: updatedEventDate,
              status: newStatus
            }
          })
        })

        const results = await prisma.$transaction(updatePromises)
        const updatedEvent = results.find(r => r.id === id) || results[0]
        return Response.json({ success: true, event: updatedEvent })
      }
    } else {
      // Normal single event update
      const updatedEvent = await prisma.calendarEvent.update({
        where: {
          id,
          creatorId: session.user.id,
        },
        data: {
          title: title !== undefined ? title : targetEvent.title,
          description: description !== undefined ? description : targetEvent.description,
          date: dateObj !== undefined ? dateObj : targetEvent.date,
          startTime: startTime !== undefined ? startTime : targetEvent.startTime,
          endTime: endTime !== undefined ? endTime : targetEvent.endTime,
          type: type !== undefined ? type : targetEvent.type,
          priority: priority !== undefined ? priority : targetEvent.priority,
          status: calculatedStatus !== undefined ? calculatedStatus : targetEvent.status,
        },
      })
      return Response.json({ success: true, event: updatedEvent })
    }
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

    if (!id) {
      return Response.json({ error: "Event ID is required" }, { status: 400 })
    }

    // Retrieve target event first to verify permissions and get recurrence meta
    const targetEvent = await prisma.calendarEvent.findUnique({
      where: {
        id,
        creatorId: session.user.id,
      },
    })

    if (!targetEvent) {
      return Response.json({ error: "Event not found" }, { status: 404 })
    }

    if (mode === "single" || !targetEvent.repeatGroupId) {
      await prisma.calendarEvent.delete({
        where: { id },
      })
    } else if (mode === "all") {
      await prisma.calendarEvent.deleteMany({
        where: {
          repeatGroupId: targetEvent.repeatGroupId,
          creatorId: session.user.id,
        },
      })
    } else if (mode === "following") {
      await prisma.calendarEvent.deleteMany({
        where: {
          repeatGroupId: targetEvent.repeatGroupId,
          creatorId: session.user.id,
          date: {
            gte: targetEvent.date,
          },
        },
      })
    }

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
