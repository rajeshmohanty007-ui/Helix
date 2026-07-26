import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        streak: true,
        productivityScore: true,
        spentTime: true,
        createdAt: true,
      },
    })

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    return Response.json(user)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { username, email, currentPassword, newPassword } = body

    // 1. Fetch current user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    const updateData = {}

    // 2. Validate and handle Username change
    if (username && username !== user.username) {
      const cleanUsername = username.trim()
      if (cleanUsername.length < 3) {
        return Response.json({ error: "Username must be at least 3 characters long" }, { status: 400 })
      }
      // Check if username is already taken
      const existingUser = await prisma.user.findUnique({
        where: { username: cleanUsername },
      })
      if (existingUser) {
        return Response.json({ error: "Username is already taken" }, { status: 400 })
      }
      updateData.username = cleanUsername
    }

    // 3. Validate and handle Email change
    if (email && email !== user.email) {
      const cleanEmail = email.trim()
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(cleanEmail)) {
        return Response.json({ error: "Invalid email format" }, { status: 400 })
      }
      // Check if email is already taken
      const existingEmail = await prisma.user.findUnique({
        where: { email: cleanEmail },
      })
      if (existingEmail) {
        return Response.json({ error: "Email is already taken" }, { status: 400 })
      }
      updateData.email = cleanEmail
    }

    // 4. Validate and handle Password change
    if (newPassword) {
      if (!currentPassword) {
        return Response.json({ error: "Current password is required to set a new password" }, { status: 400 })
      }
      if (newPassword.length < 6) {
        return Response.json({ error: "New password must be at least 6 characters long" }, { status: 400 })
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash)
      if (!isPasswordValid) {
        return Response.json({ error: "Incorrect current password" }, { status: 400 })
      }

      // Hash and set new password
      updateData.passwordHash = await bcrypt.hash(newPassword, 10)
    }

    // 5. If no changes, return early
    if (Object.keys(updateData).length === 0) {
      return Response.json({ message: "No changes to update" })
    }

    // 6. Update user in the database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    })

    return Response.json({
      success: true,
      user: updatedUser,
    })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
