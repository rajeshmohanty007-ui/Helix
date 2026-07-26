import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // 1. Fetch Tasks (Uncompleted)
    const tasks = await prisma.task.findMany({
      where: { userId, completed: false },
      orderBy: { createdAt: "desc" },
      take: 15,
    })

    // 2. Fetch Calendar Events
    const events = await prisma.calendarEvent.findMany({
      where: { creatorId: userId },
      orderBy: { date: "desc" },
      take: 15,
    })

    // 3. Fetch Projects that user belongs to, then retrieve their RecentActivity updates
    const projects = await prisma.project.findMany({
      where: { members: { some: { id: userId } } },
      select: { id: true },
    })
    
    const projectIds = projects.map((p) => p.id)

    const activities = await prisma.recentActivity.findMany({
      where: { projectId: { in: projectIds } },
      orderBy: { createdAt: "desc" },
      take: 15,
    })

    // 4. Combine and normalize to Unified Notification Objects
    const notifications = []

    // Map tasks
    tasks.forEach((t) => {
      notifications.push({
        id: `task-${t.id}`,
        type: "task",
        title: `Task Deadline Alert`,
        message: `Task: "${t.title}" is due on ${t.deadline}. Priority: ${t.priority}`,
        createdAt: t.createdAt,
        actionUrl: "/tasks",
      })
    })

    // Map events
    events.forEach((e) => {
      notifications.push({
        id: `event-${e.id}`,
        type: "event",
        title: `Calendar Event Reminders`,
        message: `Event: "${e.title}" is scheduled on ${new Date(e.date).toLocaleDateString()} at ${e.startTime} - ${e.endTime}.`,
        createdAt: e.date,
        actionUrl: "/calendar",
      })
    })

    // Map project updates
    activities.forEach((act) => {
      // Don't show system activity notifications if the action was done by the logged-in user itself
      // unless relevant (e.g. standard project logs). Let's keep it visible so they have updates.
      notifications.push({
        id: `activity-${act.id}`,
        type: "project",
        title: `Project Activity in "${act.projectName}"`,
        message: `@${act.username} performed: ${act.action}${act.description ? ` (${act.description})` : ""}`,
        createdAt: act.createdAt,
        actionUrl: `/projects`,
      })
    })

    // 5. Add default system notification to make page populated on first signup
    notifications.push({
      id: "system-welcome",
      type: "system",
      title: "Welcome to Helix!",
      message: "Start organizing your objectives, logging tasks, chatting in project channels, and customization settings.",
      createdAt: session.user.createdAt || new Date(Date.now() - 3600000 * 2), // default 2 hours ago
      actionUrl: "/dashboard",
    })

    // Sort combined notifications by date descending
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return Response.json(notifications)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
