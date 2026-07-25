
import { registerUser } from "@/services/auth/registerUser"

export async function registerHandler(req) {
  try {
    const body = await req.json()

    const result = await registerUser(body)

    return Response.json(result, {
      status: 201,
    })
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 400 }
    )
  }
}