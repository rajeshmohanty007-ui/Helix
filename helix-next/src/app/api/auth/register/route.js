
import { registerHandler } from "@/handlers/auth/registerHandler"

export async function POST(req) {
  return registerHandler(req)
}