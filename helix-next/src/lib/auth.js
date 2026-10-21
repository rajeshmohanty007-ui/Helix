import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar.events",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { username: credentials.username },
              { email: credentials.username },
            ],
          },
        })

        if (!user || !user.passwordHash) {
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
          email: user.email,
          role: user.role,
          image: user.avatar,
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
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user?.email) {
          return false
        }

        try {
          // Check if user already exists in DB
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email },
          })

          const tokenData = {
            googleAccessToken: account.access_token || null,
            ...(account.refresh_token
              ? { googleRefreshToken: account.refresh_token }
              : {}),
            googleTokenExpiry: account.expires_at
              ? new Date(account.expires_at * 1000)
              : null,
          }

          if (!dbUser) {
            // Auto sign-up: generate a clean, unique username
            let baseUsername = (user.name || user.email.split("@")[0])
              .toLowerCase()
              .replace(/[^a-z0-9_]/g, "")
              .slice(0, 15)

            if (!baseUsername || baseUsername.length < 3) {
              baseUsername = "user"
            }

            let candidateUsername = baseUsername
            let counter = 1

            while (
              await prisma.user.findUnique({
                where: { username: candidateUsername },
              })
            ) {
              const suffix = String(counter)
              candidateUsername = `${baseUsername.slice(
                0,
                15 - suffix.length
              )}${suffix}`
              counter++
            }

            dbUser = await prisma.user.create({
              data: {
                email: user.email,
                username: candidateUsername,
                avatar: user.image || null,
                role: "member",
                ...tokenData,
              },
            })
          } else {
            // Update user tokens & avatar
            dbUser = await prisma.user.update({
              where: { id: dbUser.id },
              data: {
                avatar: user.image || dbUser.avatar,
                ...tokenData,
              },
            })
          }

          // Attach user properties so jwt callback has access
          user.id = dbUser.id
          user.username = dbUser.username
          user.role = dbUser.role
          user.image = dbUser.avatar || user.image
          user.hasGoogleCalendar = Boolean(
            dbUser.googleRefreshToken || dbUser.googleAccessToken
          )

          return true
        } catch (error) {
          console.error("Error signing in with Google:", error)
          return false
        }
      }

      return true
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.username = user.username
        if (user.image) {
          token.picture = user.image
        }
        token.hasGoogleCalendar = user.hasGoogleCalendar
      }

      // Safeguard for OAuth: fetch DB user if id or username is missing
      if (token?.email && (!token?.id || !token?.username || token?.hasGoogleCalendar === undefined)) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
          })
          if (dbUser) {
            token.id = dbUser.id
            token.role = dbUser.role
            token.username = dbUser.username
            token.hasGoogleCalendar = Boolean(
              dbUser.googleRefreshToken || dbUser.googleAccessToken
            )
            if (dbUser.avatar) {
              token.picture = dbUser.avatar
            }
          }
        } catch (err) {
          console.error("Error fetching db user in jwt callback:", err)
        }
      }

      if (trigger === "update" && session?.username) {
        token.username = session.username
      }

      return token
    },

    async session({ session, token }) {
      if (token && session?.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.username = token.username
        session.user.hasGoogleCalendar = Boolean(token.hasGoogleCalendar)
        if (token.picture) {
          session.user.image = token.picture
        }
      }

      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}