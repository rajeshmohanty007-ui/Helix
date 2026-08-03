import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await params
    const projectId = resolvedParams.id
    const objectiveId = resolvedParams.objectiveId

    // Verify user is project admin or creator
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        admins: { select: { id: true } }
      }
    })

    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 })
    }

    const isCreator = project.creatorId === session.user.id
    const isAdmin = isCreator || project.admins.some((a) => a.id === session.user.id)

    if (!isAdmin) {
      return Response.json({ error: "Forbidden: Only admins can manage objectives" }, { status: 403 })
    }

    const body = await req.json()
    const { status, deadline, memberIds } = body

    const updateData = {}
    if (status !== undefined) updateData.status = status
    if (deadline !== undefined) updateData.deadline = deadline
    
    if (memberIds !== undefined) {
      updateData.members = {
        set: memberIds.map((id) => ({ id })),
      }
    }

    const updatedObjective = await prisma.projectObjective.update({
      where: { id: objectiveId },
      data: updateData,
      include: {
        members: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    return Response.json({ success: true, objective: updatedObjective })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await params
    const projectId = resolvedParams.id
    const objectiveId = resolvedParams.objectiveId

    // Verify user is project admin or creator
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        admins: { select: { id: true } }
      }
    })

    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 })
    }

    const isCreator = project.creatorId === session.user.id
    const isAdmin = isCreator || project.admins.some((a) => a.id === session.user.id)

    if (!isAdmin) {
      return Response.json({ error: "Forbidden: Only admins can delete objectives" }, { status: 403 })
    }

    await prisma.projectObjective.delete({
      where: { id: objectiveId },
    })

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
