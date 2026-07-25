import { prisma } from "@/lib/prisma"

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

  return await prisma.projectUpdate.create({
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
}
