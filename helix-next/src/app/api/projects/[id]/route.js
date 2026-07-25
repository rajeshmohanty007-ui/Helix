import { prisma } from "@/lib/prisma"

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
