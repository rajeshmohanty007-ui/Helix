
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function registerUser({
  username,
  email,
  password,
}) {
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { username },
        { email },
      ],
    },
  })

  if (existing) {
    throw new Error("User already exists")
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
    },
  })

  return {
    success: true,
    userId: user.id,
  }
}