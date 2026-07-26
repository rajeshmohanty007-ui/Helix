import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        username: {},
        password: {},
      },

      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {
            username: credentials.username,
          },
        })

        if (!user) {
          return null
        }

        const valid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!valid) {
          return null
        }

        return {
          id: user.id,
          username: user.username,
          role: user.role,
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 1 week
    updateAge: 24 * 60 * 60, // Recycle/extend session max age every 24 hours
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.username = user.username
      }

      if (trigger === "update" && session?.username) {
        token.username = session.username
      }

      return token
    },

    async session({ session, token }) {
      session.user.id = token.id
      session.user.role = token.role
      session.user.username = token.username

      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}