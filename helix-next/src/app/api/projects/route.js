import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        members: {
          select: {
            id: true,
            username: true,
          },
        },
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
