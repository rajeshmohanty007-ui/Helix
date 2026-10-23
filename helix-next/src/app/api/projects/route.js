import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { creatorId: session.user.id },
          { members: { some: { id: session.user.id } } }
        ]
      },
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
        creator: {
          select: {
            id: true,
            username: true,
          }
        }
      },
      orderBy: {
        name: "asc",
      },
    })
    return Response.json(projects)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, usernames } = body

    if (!name || !name.trim()) {
      return Response.json({ error: "Project name is required" }, { status: 400 })
    }

    let memberConnect = [{ id: session.user.id }]

    if (Array.isArray(usernames) && usernames.length > 0) {
      // Find matching users in database
      const dbUsers = await prisma.user.findMany({
        where: {
          username: { in: usernames },
        },
        select: {
          id: true,
          username: true,
        },
      })

      const foundUsernames = dbUsers.map((u) => u.username)
      const missingUsernames = usernames.filter((un) => !foundUsernames.includes(un))

      if (missingUsernames.length > 0) {
        return Response.json(
          { error: `User(s) not found: ${missingUsernames.join(", ")}` },
          { status: 400 }
        )
      }

      // Connect these users (avoiding duplicates if session.user.id is already in dbUsers)
      dbUsers.forEach((user) => {
        if (user.id !== session.user.id) {
          memberConnect.push({ id: user.id })
        }
      })
    }

    // Create the Project
    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        status: "active",
        creatorId: session.user.id,
        members: {
          connect: memberConnect,
        },
        admins: {
          connect: [{ id: session.user.id }]
        },
        channels: {
          create: [
            {
              name: "general",
              type: "general",
              status: "active",
            },
          ],
        },
      },
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

    // Create notification activity alerts for each added teammate
    if (typeof dbUsers !== "undefined" && Array.isArray(dbUsers) && dbUsers.length > 0) {
      const creator = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { username: true }
      })
      const creatorUsername = creator?.username || "Admin"

      const activityPromises = dbUsers
        .filter((u) => u.id !== session.user.id)
        .map((u) => {
          return prisma.recentActivity.create({
            data: {
              userId: session.user.id,
              username: creatorUsername,
              projectId: project.id,
              projectName: project.name,
              action: "added collaborator",
              description: `@${u.username} joined the project`,
            },
          })
        })
      await Promise.all(activityPromises)
    }

    return Response.json(project)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
