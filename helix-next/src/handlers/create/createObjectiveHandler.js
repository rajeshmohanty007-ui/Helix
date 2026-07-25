import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { createObjective } from "@/services/create/createObjective"

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
