import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { createTaskHandler } from "@/handlers/create/createTaskHandler"
import { recalculateProductivityScore } from "@/lib/dashboard"

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const listName = searchParams.get("list")

    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
        ...(listName ? { taskList: listName } : {}),
      },
      include: {
        tags: true,
        subtasks: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return Response.json(tasks)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    return await createTaskHandler(req)
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

    // Handle Subtask update
    if (body.subtaskId) {
      const subtask = await prisma.subtask.findUnique({
        where: { id: body.subtaskId },
        include: { task: true }
      })

      if (!subtask || subtask.task.userId !== session.user.id) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
      }

      const updatedSubtask = await prisma.subtask.update({
        where: { id: body.subtaskId },
        data: { completed: !!body.completed },
      })

      await recalculateProductivityScore(session.user.id)

      return Response.json({ success: true, subtask: updatedSubtask })
    }

    // Handle Task update
    const { id, completed, title, description, priority, deadline, duration } = body
    if (!id) {
      return Response.json({ error: "Task ID is required" }, { status: 400 })
    }

    const updateData = {}
    if (completed !== undefined) updateData.completed = !!completed
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (priority !== undefined) updateData.priority = priority
    if (deadline !== undefined) updateData.deadline = deadline
    if (duration !== undefined) updateData.duration = duration

    const updatedTask = await prisma.task.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: updateData,
    })

    await recalculateProductivityScore(session.user.id)

    return Response.json({ success: true, task: updatedTask })
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
    const listName = searchParams.get("list")
    const taskId = searchParams.get("id")

    // Delete single task if id is provided
    if (taskId) {
      await prisma.task.delete({
        where: {
          id: taskId,
          userId: session.user.id,
        },
      })
      return Response.json({ success: true })
    }

    if (!listName) {
      return Response.json({ error: "List or ID parameter is required" }, { status: 400 })
    }
    if (listName === "Quick Tasks") {
      return Response.json({ error: "Cannot delete Quick Tasks list" }, { status: 400 })
    }

    // Delete all tasks under this listName for the authenticated user
    const deleteCount = await prisma.task.deleteMany({
      where: {
        userId: session.user.id,
        taskList: listName,
      },
    })

    return Response.json({
      success: true,
      count: deleteCount.count,
    })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
