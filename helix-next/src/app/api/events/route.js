import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

function getEventStatus(eventDateVal, startTime, endTime) {
  const now = new Date()
  const eventDate = new Date(eventDateVal)
  
  // Format event date as YYYY-MM-DD
  const y = eventDate.getUTCFullYear()
  const m = String(eventDate.getUTCMonth() + 1).padStart(2, "0")
  const d = String(eventDate.getUTCDate()).padStart(2, "0")
  const eventDateStr = `${y}-${m}-${d}`

  // Format today's date in local time as YYYY-MM-DD
  const todayY = now.getFullYear()
  const todayM = String(now.getMonth() + 1).padStart(2, "0")
  const todayD = String(now.getDate()).padStart(2, "0")
  const todayStr = `${todayY}-${todayM}-${todayD}`

  if (eventDateStr < todayStr) {
    return "completed"
  } else if (eventDateStr > todayStr) {
    return "pending"
  } else {
    // Same day: check starting and ending hours
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

    // Dynamically calculate status on request so it's always up-to-date with current time
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

    // Ensure the date is parsed correctly at midnight UTC
    const dateObj = new Date(body.date + "T00:00:00Z")
    const startTime = body.startTime || "09:00"
    const endTime = body.endTime || "10:00"

    const calculatedStatus = getEventStatus(dateObj, startTime, endTime)

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
        creatorId: session.user.id,
      },
    })

    return Response.json({ success: true, event: newEvent })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
