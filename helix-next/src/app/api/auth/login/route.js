// app/api/auth/login/route.js

import { loginHandler } from "@/handlers/auth/loginHandler"

export async function POST(req) {
  return loginHandler(req)
}