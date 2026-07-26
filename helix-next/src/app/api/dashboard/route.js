import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { recalculateProductivityScore } from "@/lib/dashboard"

export async function GET() {
  try {
    // 1. Authenticate user session
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = session.user.id

    // 2. Fetch User to manage/check streak
    let user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    const now = new Date()
    let streakUpdated = false

    if (!user.lastActive) {
      // First time setting lastActive/streak
      user = await prisma.user.update({
        where: { id: userId },
        data: {
          streak: 1,
          lastActive: now,
        },
      })
      streakUpdated = true
    } else {
      const lastActiveDate = new Date(user.lastActive)
      const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const lastActiveMidnight = new Date(lastActiveDate.getFullYear(), lastActiveDate.getMonth(), lastActiveDate.getDate())
      
      const diffTime = todayMidnight.getTime() - lastActiveMidnight.getTime()
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        // Streak continues!
        user = await prisma.user.update({
          where: { id: userId },
          data: {
            streak: user.streak + 1,
            lastActive: now,
          },
        })
        streakUpdated = true
      } else if (diffDays > 1) {
        // Streak broken
        user = await prisma.user.update({
          where: { id: userId },
          data: {
            streak: 1,
            lastActive: now,
          },
        })
        streakUpdated = true
      } else if (diffDays === 0) {
        // Already active today, just update exact timestamp
        user = await prisma.user.update({
          where: { id: userId },
          data: {
            lastActive: now,
          },
        })
      }
    }

    // Recalculate score if streak changed
    if (streakUpdated) {
      await recalculateProductivityScore(userId)
      // Refetch user to get updated productivity score
      user = await prisma.user.findUnique({
        where: { id: userId },
      })
    }

    // 3. Query projects list user is member of
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: { id: userId },
        },
      },
      select: {
        id: true,
        status: true,
      },
    })

    const activeProjectsCount = projects.filter((p) => p.status !== "completed").length
    const completedProjectsCount = projects.filter((p) => p.status === "completed").length

    // 4. Query tasks
    const tasks = await prisma.task.findMany({
      where: { userId },
    })

    const totalTasks = tasks.length
    const completedTasks = tasks.filter((t) => t.completed).length
    const remainingTasks = totalTasks - completedTasks

    // 5. Calculate Daily Progress (percentage)
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // 6. Nearest deadline task
    const nearestTask = await prisma.task.findFirst({
      where: {
        userId,
        completed: false,
        deadline: { not: "" },
      },
      orderBy: {
        deadline: "asc",
      },
    })

    // 7. Upcoming Calendar Events (Today/Future)
    // Order events by date and select top 3
    const upcomingEvents = await prisma.calendarEvent.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { assignees: { some: { id: userId } } },
        ],
      },
      orderBy: {
        date: "asc",
      },
      take: 3,
    })

    const formattedEvents = upcomingEvents.map((evt) => ({
      title: evt.title,
      time: `${evt.startTime} - ${evt.endTime} (${new Date(evt.date).toLocaleDateString()})`,
    }))

    // 8. Recent Activities (from user's joined projects)
    const projectIds = projects.map((p) => p.id)
    const recentActivities = await prisma.recentActivity.findMany({
      where: {
        projectId: { in: projectIds },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    })

    return Response.json({
      user: {
        username: user.username,
        streak: user.streak,
        productivityScore: user.productivityScore,
      },
      stats: {
        activeProjects: activeProjectsCount,
        completedProjects: completedProjectsCount,
        remainingTasks,
      },
      activity: {
        progress,
        completedTasks,
        totalTasks,
        deadlineTask: nearestTask ? nearestTask.title : "No upcoming deadlines",
        deadlineTime: nearestTask ? nearestTask.deadline : "-",
        upcomingEvents: formattedEvents,
      },
      recentActivities,
    })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
