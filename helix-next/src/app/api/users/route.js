import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
      },
      orderBy: {
        username: "asc",
      },
    })
    return Response.json(users)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
