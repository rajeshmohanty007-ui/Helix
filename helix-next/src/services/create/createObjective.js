import { prisma } from "@/lib/prisma"

export async function createObjective({ projectId, title, deadline, status, memberIds }) {
  if (!projectId) {
    throw new Error("projectId is required")
  }
  if (!title) {
    throw new Error("title is required")
  }
  if (!deadline) {
    throw new Error("deadline is required")
  }

  const allowedStatuses = ["pending", "progress", "completed", "blocked"]
  const finalStatus = allowedStatuses.includes(status) ? status : "pending"

  // Handle member IDs if provided
  const connectMembers = Array.isArray(memberIds)
    ? memberIds.map((id) => ({ id }))
    : []

  return await prisma.projectObjective.create({
    data: {
      projectId,
      title,
      deadline,
      status: finalStatus,
      members: {
        connect: connectMembers,
      },
    },
    include: {
      members: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  })
}
