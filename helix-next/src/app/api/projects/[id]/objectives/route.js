import { prisma } from "@/lib/prisma"
import { createObjectiveHandler } from "@/handlers/create/createObjectiveHandler"

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params
    const projectId = resolvedParams.id

    const objectives = await prisma.projectObjective.findMany({
      where: {
        projectId,
      },
      include: {
        members: {
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
    return Response.json(objectives)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req, { params }) {
  try {
    const resolvedParams = await params
    const projectId = resolvedParams.id
    return await createObjectiveHandler(req, projectId)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
