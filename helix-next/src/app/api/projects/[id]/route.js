import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params
    const id = resolvedParams.id

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        members: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 })
    }

    return Response.json(project)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await params
    const id = resolvedParams.id

    const body = await req.json()
    const { name, description, status, addMemberUsername, removeMemberUserId } = body

    // 1. Handle add member by username
    if (addMemberUsername) {
      const user = await prisma.user.findUnique({
        where: { username: addMemberUsername },
      })
      if (!user) {
        return Response.json({ error: `User "${addMemberUsername}" not found.` }, { status: 404 })
      }

      const updated = await prisma.project.update({
        where: { id },
        data: {
          members: {
            connect: { id: user.id },
          },
        },
        include: {
          members: {
            select: { id: true, username: true },
          },
        },
      })
      return Response.json(updated)
    }

    // 2. Handle remove member by user ID
    if (removeMemberUserId) {
      const updated = await prisma.project.update({
        where: { id },
        data: {
          members: {
            disconnect: { id: removeMemberUserId },
          },
        },
        include: {
          members: {
            select: { id: true, username: true },
          },
        },
      })
      return Response.json(updated)
    }

    // 3. Handle general project updates (name, description, status)
    const updateData = {}
    if (name !== undefined) {
      if (!name.trim()) {
        return Response.json({ error: "Project name cannot be empty." }, { status: 400 })
      }
      updateData.name = name.trim()
    }
    if (description !== undefined) {
      updateData.description = description.trim() || null
    }
    if (status !== undefined) {
      updateData.status = status
    }

    const updatedProject = await prisma.project.update({
      where: { id },
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

    return Response.json(updatedProject)
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
    const id = resolvedParams.id

    await prisma.project.delete({
      where: { id },
    })

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
