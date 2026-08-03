import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await req.json()
    const { sleepingHours, unavailableHours, workHoursPerDay } = body

    // 1. Get the list of dates for the next 7 days (including today)
    const dates = []
    const now = new Date()
    for (let i = 0; i < 7; i++) {
      const d = new Date(now.getTime() + i * 24 * 60 * 60 * 1000)
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, "0")
      const day = String(d.getDate()).padStart(2, "0")
      dates.push(`${y}-${m}-${day}`)
    }

    // 2. Fetch all uncompleted tasks for the user
    const tasks = await prisma.task.findMany({
      where: {
        userId,
        completed: false,
      },
    })

    // 3. Filter tasks: identify next 7 days vs beyond 7 days
    let hasMoreThan7Days = false
    const tasksWithin7Days = []

    for (const task of tasks) {
      if (task.deadline && task.deadline !== "No deadline") {
        const deadlineDateStr = task.deadline.split("T")[0]
        const deadlineDate = new Date(deadlineDateStr + "T00:00:00")
        const todayDate = new Date(dates[0] + "T00:00:00")
        const diffTime = deadlineDate.getTime() - todayDate.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays > 6) {
          hasMoreThan7Days = true
        } else {
          tasksWithin7Days.push(task)
        }
      } else {
        // No deadline tasks are included in next 7 days optimization
        tasksWithin7Days.push(task)
      }
    }

    // 4. Fetch existing calendar events for the next 7 days
    const startDate = new Date(dates[0] + "T00:00:00Z")
    const endDate = new Date(dates[6] + "T23:59:59Z")

    const calendarEvents = await prisma.calendarEvent.findMany({
      where: {
        creatorId: userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    // Exclude previously AI-scheduled events from busy slots calculation
    const existingBusyEvents = calendarEvents
      .filter(evt => !evt.description || !evt.description.includes("[AI Scheduled]"))
      .map(evt => {
        // Extract YYYY-MM-DD from DateTime object
        const dObj = new Date(evt.date)
        const y = dObj.getUTCFullYear()
        const m = String(dObj.getUTCMonth() + 1).padStart(2, "0")
        const d = String(dObj.getUTCDate()).padStart(2, "0")
        return {
          id: evt.id,
          title: evt.title,
          date: `${y}-${m}-${d}`,
          startTime: evt.startTime,
          endTime: evt.endTime,
        }
      })

    // 5. Make the prompt for Gemini
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return Response.json({ error: "Gemini API key is not configured on the server." }, { status: 500 })
    }

    const currentLocalTime = new Date().toISOString()

    const promptText = `
You are an expert AI productivity assistant. Optimize the user's task schedule for the next 7 days.
You must schedule as many tasks as possible into the free time slots of the next 7 days, respecting the user's daily work limits, sleeping hours, unavailable hours, and existing calendar events.

Context:
- Current Local Time is: ${currentLocalTime}
- Next 7 Days Dates: ${JSON.stringify(dates)}
- User Constraints:
  * Sleeping Hours: "${sleepingHours || "22:00 - 06:00"}" (No tasks should be scheduled during this interval of any day. Note: e.g. 22:00-06:00 means 22:00 of Day X to 06:00 of Day X+1)
  * Unavailable Hours: "${unavailableHours || "None"}" (No tasks should be scheduled during these intervals)
  * Maximum Work Hours Per Day: ${workHoursPerDay || 8} hours
- Existing Calendar Events (Fixed commitments - DO NOT overlap tasks here):
${JSON.stringify(existingBusyEvents, null, 2)}
- Tasks to Schedule:
${JSON.stringify(
  tasksWithin7Days.map(t => ({
    id: t.id,
    title: t.title,
    description: t.description || "",
    priority: t.priority,
    duration: t.duration, // E.g., "2 hrs", "30 mins", "1.5 hrs"
    deadline: t.deadline, // Target deadline date/time or "No deadline"
  })),
  null,
  2
)}

Scheduling Constraints & Rules:
1. Do not schedule tasks during sleeping hours, unavailable hours, or existing busy calendar events.
2. The total scheduled duration on any day MUST NOT exceed the maximum work hours per day limit.
3. Tasks MUST NOT overlap.
4. Schedule tasks chronologically within the 7-day dates array. If a task has a deadline, it MUST be scheduled on or before its deadline date.
5. Prioritize High priority tasks to be scheduled earlier in the week or day.
6. **Task Splitting**: If a task has a long duration (e.g. 3 hours or more) or if a contiguous block is unavailable, you CAN split it into smaller slots (e.g., "Create Presentation (Part 1)" for 2 hrs, "Create Presentation (Part 2)" for 1 hr) on the same day or across different days. The sum of durations of all split slots must equal the task's original duration.
7. Return a list of events to insert.
8. If a task cannot be scheduled at all due to constraints, add its ID to the "unscheduledTaskIds" array.

Output format MUST be a JSON object with this schema:
{
  "scheduledEvents": [
    {
      "taskId": string,
      "title": string,
      "description": string, // Include "[AI Scheduled]" prefix or suffix here, e.g. "Description detail [AI Scheduled]"
      "date": "YYYY-MM-DD",
      "startTime": "HH:MM", // 24hr format
      "endTime": "HH:MM", // 24hr format
      "priority": "low" | "medium" | "high",
      "type": "task"
    }
  ],
  "unscheduledTaskIds": [string]
}

Respond ONLY with raw JSON. Do not wrap it in markdown code blocks or add any comments.
`

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: promptText,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    )

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to call Gemini API")
    }

    let textResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!textResponse) {
      throw new Error("Empty response from AI scheduler.")
    }

    textResponse = textResponse.trim()
    if (textResponse.startsWith("```")) {
      textResponse = textResponse
        .replace(/^```json\s*/, "")
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "")
    }

    const { scheduledEvents = [], unscheduledTaskIds = [] } = JSON.parse(textResponse)

    // 6. Delete all previously AI-scheduled calendar events in the 7-day range
    // AI scheduled events contain [AI Scheduled] in their description.
    await prisma.calendarEvent.deleteMany({
      where: {
        creatorId: userId,
        description: {
          contains: "[AI Scheduled]",
        },
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    // 7. Write the newly generated events to the DB
    if (scheduledEvents.length > 0) {
      const dbEventsData = scheduledEvents.map(evt => {
        // Ensure description contains the AI marker
        let desc = evt.description || ""
        if (!desc.includes("[AI Scheduled]")) {
          desc = desc ? `${desc} [AI Scheduled]` : "[AI Scheduled]"
        }

        return {
          title: evt.title,
          description: desc,
          date: new Date(evt.date + "T00:00:00Z"),
          startTime: evt.startTime,
          endTime: evt.endTime,
          type: "task",
          priority: evt.priority || "medium",
          status: "pending",
          repeat: "none",
          creatorId: userId,
        }
      })

      await prisma.calendarEvent.createMany({
        data: dbEventsData,
      })
    }

    // Determine the alert message to send to the client
    const hasUnscheduled = unscheduledTaskIds.length > 0 || hasMoreThan7Days
    const alertMessage = hasUnscheduled
      ? " You have too many tasks. Only next seven days tasks are shown. Prioritise deadlines first. You can edit any tasks as you like."
      : "Your optimized schedule has been created, you can view it in the calender section. You are free to edit any tasks as you like."

    return Response.json({
      success: true,
      alertMessage,
      scheduledCount: scheduledEvents.length,
      unscheduledCount: unscheduledTaskIds.length,
    })

  } catch (error) {
    console.error("AI scheduler error:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
