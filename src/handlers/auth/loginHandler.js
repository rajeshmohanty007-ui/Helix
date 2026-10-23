import { loginUser } from "@/services/auth/loginUser"

export async function loginHandler(req) {
  try {
    const body = await req.json()

    const user = await loginUser(body)

    return Response.json({
      success: true,
      user,
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 401 }
    )
  }
}