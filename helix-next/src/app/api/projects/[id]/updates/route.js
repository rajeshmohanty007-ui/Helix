import { prisma } from "@/lib/prisma"
import { createUpdateHandler } from "@/handlers/create/createUpdateHandler"

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params
    const projectId = resolvedParams.id

    const updates = await prisma.projectUpdate.findMany({
      where: {
        projectId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return Response.json(updates)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req, { params }) {
  try {
    const resolvedParams = await params
    const projectId = resolvedParams.id
    return await createUpdateHandler(req, projectId)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
