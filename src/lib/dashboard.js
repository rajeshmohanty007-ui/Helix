import { prisma } from "@/lib/prisma"

export async function recalculateProductivityScore(userId) {
  try {
    if (!userId) return;

    // 1. Get user details along with completed tasks and updates
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tasks: {
          where: { completed: true },
        },
        updates: true,
      },
    });

    if (!user) return;

    // 2. Sum the parsed hours of completed tasks to get total spent time
    let totalSpentHours = 0;
    user.tasks.forEach((task) => {
      if (task.duration) {
        // e.g. "4 hrs" or "2 hours" or "5.5 hrs" -> extract number
        const match = task.duration.match(/([\d.]+)\s*hrs?/i);
        if (match) {
          totalSpentHours += parseFloat(match[1]);
        }
      }
    });

    // 3. Apply gamified productivity score formula
    // Completed Tasks: 15 pts, Updates: 10 pts, Streak: 25 pts, Hours: 5 pts
    const completedTasksCount = user.tasks.length;
    const updatesCount = user.updates.length;
    const streak = user.streak || 0;

    const score = (completedTasksCount * 15) + (updatesCount * 10) + (streak * 25) + Math.round(totalSpentHours * 5);

    // 4. Update the user database
    await prisma.user.update({
      where: { id: userId },
      data: {
        productivityScore: score,
        spentTime: Math.round(totalSpentHours * 60), // store in minutes
      },
    });
  } catch (error) {
    console.error("Error recalculating productivity score:", error);
  }
}

export async function addRecentActivity({ userId, username, projectId, projectName, action, description }) {
  try {
    if (!projectId || !userId) return;

    // 1. Create the new activity log
    await prisma.recentActivity.create({
      data: {
        userId,
        username,
        projectId,
        projectName,
        action,
        description: description || null,
      },
    });

    // 2. Fetch all activities for this project sorted by newest
    const projectActivities = await prisma.recentActivity.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });

    // 3. Keep only 10 recent activities for this project, prune older ones
    if (projectActivities.length > 10) {
      const toDelete = projectActivities.slice(10).map((act) => act.id);
      await prisma.recentActivity.deleteMany({
        where: { id: { in: toDelete } },
      });
    }
  } catch (error) {
    console.error("Error adding recent activity:", error);
  }
}
