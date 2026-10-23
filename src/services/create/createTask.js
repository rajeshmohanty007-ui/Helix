import { prisma } from "@/lib/prisma"

export async function createTask({
  title,
  description,
  priority,
  deadline,
  duration,
  taskList,
  userId,
  subtasks = [],
  tags = [],
}) {
  if (!title) {
    throw new Error("Task title is required")
  }
  if (!userId) {
    throw new Error("userId is required")
  }

  const tagsData = tags && tags.length > 0 ? {
    connectOrCreate: tags.map(name => ({
      where: { name },
      create: { name },
    })),
  } : undefined

  const subtasksData = subtasks && subtasks.length > 0 ? {
    create: subtasks.map(t => ({
      title: t,
      completed: false,
    })),
  } : undefined

  return await prisma.task.create({
    data: {
      title,
      description: description || "",
      priority: priority || "Medium",
      deadline: deadline || "No deadline",
      duration: duration || "0 hrs",
      taskList: taskList || "Daily",
      userId,
      completed: false,
      tags: tagsData,
      subtasks: subtasksData,
    },
    include: {
      tags: true,
      subtasks: true,
    },
  })
}
