import { prisma } from "@/lib/prisma"
import { recalculateProductivityScore, addRecentActivity } from "@/lib/dashboard"

export async function createUpdate({ projectId, userId, action, content }) {
  if (!projectId) {
    throw new Error("projectId is required")
  }
  if (!userId) {
    throw new Error("userId is required")
  }
  if (!content) {
    throw new Error("content is required")
  }

  const allowedActions = ["completed", "started", "blocked", "updated"]
  const finalAction = allowedActions.includes(action) ? action : "updated"

  const createdUpdate = await prisma.projectUpdate.create({
    data: {
      projectId,
      userId,
      action: finalAction,
      content,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  })

  // Recalculate productivity score
  await recalculateProductivityScore(userId)

  // Fetch project details for logging
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { name: true },
  })

  if (project) {
    await addRecentActivity({
      userId,
      username: createdUpdate.user.username,
      projectId,
      projectName: project.name,
      action: `Added update: ${finalAction}`,
      description: content,
    })
  }

  return createdUpdate
}
