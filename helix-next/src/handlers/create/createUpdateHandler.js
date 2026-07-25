import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { createUpdate } from "@/services/create/createUpdate"

export async function createUpdateHandler(req, projectIdFromParams) {
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

    const update = await createUpdate({
      projectId,
      userId: session.user.id,
      action: body.action,
      content: body.content,
    })

    return Response.json({
      success: true,
      update,
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
