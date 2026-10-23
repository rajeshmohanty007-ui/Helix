import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

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
        admins: {
          select: {
            id: true,
            username: true,
          },
        },
        managers: {
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

    const isMember = project.members.some((m) => m.id === session.user.id)
    const isCreator = project.creatorId === session.user.id
    if (!isMember && !isCreator) {
      return Response.json({ error: "Access denied" }, { status: 403 })
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

    const { name, description, status, addMemberUsername, addMemberRole, removeMemberUserId, changeMemberRoleUserId, newRole } = body

    // 1. Handle member role change
    if (changeMemberRoleUserId && newRole) {
      const proj = await prisma.project.findUnique({
        where: { id },
        include: {
          admins: { select: { id: true } },
          managers: { select: { id: true } }
        }
      })

      if (!proj) {
        return Response.json({ error: "Project not found" }, { status: 404 })
      }

      const isCallerAdmin = proj.creatorId === session.user.id || proj.admins.some((a) => a.id === session.user.id)
      const isCallerManager = proj.managers.some((m) => m.id === session.user.id)

      if (!isCallerAdmin && !isCallerManager) {
        return Response.json({ error: "Forbidden: Only admins and managers can change roles" }, { status: 403 })
      }

      if (proj.creatorId === changeMemberRoleUserId) {
        return Response.json({ error: "Cannot change the role of the project creator" }, { status: 400 })
      }

      const isTargetAdmin = proj.admins.some((a) => a.id === changeMemberRoleUserId)
      if (isCallerManager && (newRole === "admin" || isTargetAdmin)) {
        return Response.json({ error: "Forbidden: Managers cannot promote to Admin or modify Admin roles" }, { status: 403 })
      }

      // Disconnect from current role lists
      await prisma.project.update({
        where: { id },
        data: {
          admins: { disconnect: { id: changeMemberRoleUserId } },
          managers: { disconnect: { id: changeMemberRoleUserId } }
        }
      })

      let roleUpdate = {}
      if (newRole === "admin") {
        roleUpdate = { admins: { connect: { id: changeMemberRoleUserId } } }
      } else if (newRole === "manager") {
        roleUpdate = { managers: { connect: { id: changeMemberRoleUserId } } }
      }

      const updated = await prisma.project.update({
        where: { id },
        data: roleUpdate,
        include: {
          members: { select: { id: true, username: true } },
          admins: { select: { id: true, username: true } },
          managers: { select: { id: true, username: true } }
        }
      })
      return Response.json(updated)
    }

    // 2. Handle add member by username
    if (addMemberUsername) {
      const user = await prisma.user.findUnique({
        where: { username: addMemberUsername },
      })
      if (!user) {
        return Response.json({ error: `User "${addMemberUsername}" not found.` }, { status: 404 })
      }

      const proj = await prisma.project.findUnique({
        where: { id },
        include: {
          members: { select: { id: true } },
          admins: { select: { id: true } },
          managers: { select: { id: true } }
        }
      })

      if (!proj) {
        return Response.json({ error: "Project not found" }, { status: 404 })
      }

      const isCallerAdmin = proj.creatorId === session.user.id || proj.admins.some((a) => a.id === session.user.id)
      const isCallerManager = proj.managers.some((m) => m.id === session.user.id)

      if (!isCallerAdmin && !isCallerManager) {
        return Response.json({ error: "Forbidden: Only admins and managers can add members" }, { status: 403 })
      }

      if (proj.members.some((m) => m.id === user.id)) {
        return Response.json({ error: `@${addMemberUsername} is already a member of this project.` }, { status: 400 })
      }

      const updateData = {
        members: {
          connect: { id: user.id },
        },
      }

      if (addMemberRole === "admin") {
        if (isCallerManager) {
          return Response.json({ error: "Forbidden: Managers cannot add users as Administrators" }, { status: 403 })
        }
        updateData.admins = { connect: { id: user.id } }
      } else if (addMemberRole === "manager") {
        updateData.managers = { connect: { id: user.id } }
      }

      const updated = await prisma.project.update({
        where: { id },
        data: updateData,
        include: {
          members: { select: { id: true, username: true } },
          admins: { select: { id: true, username: true } },
          managers: { select: { id: true, username: true } }
        },
      })

      const adder = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { username: true }
      })

      await prisma.recentActivity.create({
        data: {
          userId: session.user.id,
          username: adder?.username || "Admin",
          projectId: id,
          projectName: updated.name,
          action: "added collaborator",
          description: `@${user.username} joined the project as ${addMemberRole || "member"}`,
        }
      })

      return Response.json(updated)
    }

    // 3. Handle remove member by user ID
    if (removeMemberUserId) {
      const updated = await prisma.project.update({
        where: { id },
        data: {
          members: {
            disconnect: { id: removeMemberUserId },
          },
          admins: {
            disconnect: { id: removeMemberUserId },
          },
          managers: {
            disconnect: { id: removeMemberUserId },
          },
        },
        include: {
          members: { select: { id: true, username: true } },
          admins: { select: { id: true, username: true } },
          managers: { select: { id: true, username: true } }
        },
      })
      return Response.json(updated)
    }

    // 4. Handle general project updates (name, description, status)
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
        members: { select: { id: true, username: true } },
        admins: { select: { id: true, username: true } },
        managers: { select: { id: true, username: true } }
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

    const project = await prisma.project.findUnique({
      where: { id },
      select: { creatorId: true }
    })

    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.creatorId && project.creatorId !== session.user.id) {
      return Response.json({ error: "Only the creator can delete this project." }, { status: 403 })
    }

    await prisma.project.delete({
      where: { id },
    })

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
