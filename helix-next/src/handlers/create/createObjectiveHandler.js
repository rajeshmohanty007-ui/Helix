import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { createObjective } from "@/services/create/createObjective"
import { addRecentActivity } from "@/lib/dashboard"
import { prisma } from "@/lib/prisma"

export async function createObjectiveHandler(req, projectIdFromParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const projectId = projectIdFromParams || body.projectId

    const objective = await createObjective({
      projectId,
      title: body.title,
      deadline: body.deadline,
      status: body.status,
      memberIds: body.memberIds,
    })

    // Log recent activity for the project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { name: true },
    })

    if (project) {
      await addRecentActivity({
        userId: session.user.id,
        username: session.user.username,
        projectId,
        projectName: project.name,
        action: `Created Objective: ${body.title}`,
        description: `Deadline: ${body.deadline} • Status: ${body.status || "pending"}`,
      })
    }

    return Response.json({
      success: true,
      objective,
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}
