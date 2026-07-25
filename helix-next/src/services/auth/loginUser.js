
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function loginUser({ username, password }) {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    throw new Error("User not found")
  }

  const validPassword = await bcrypt.compare(
    password,
    user.passwordHash
  )

  if (!validPassword) {
    throw new Error("Invalid password")
  }

  return {
    id: user.id,
    username: user.username,
    role: user.role,
  }
}