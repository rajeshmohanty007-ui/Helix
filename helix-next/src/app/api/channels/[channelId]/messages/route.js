import { prisma } from "@/lib/prisma"
import { redisClient } from "@/lib/redis"

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params
    const channelId = resolvedParams.channelId
    const cacheKey = `channel:${channelId}:messages`

    // Try to get from Redis cache
    try {
      const cached = await redisClient.get(cacheKey)
      if (cached) {
        return Response.json(JSON.parse(cached))
      }
    } catch (cacheErr) {
      console.warn("Redis GET error inside messages route:", cacheErr.message)
    }

    const messages = await prisma.message.findMany({
      where: { channelId },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    })

    // Parse the SQLite JSON strings back to objects before returning/caching
    const formattedMessages = messages.map((m) => ({
      ...m,
      reactions: m.reactions ? JSON.parse(m.reactions) : {},
      replyTo: m.replyTo ? JSON.parse(m.replyTo) : null,
    }))

    // Save to Redis cache (expires in 1 hour)
    try {
      await redisClient.set(cacheKey, JSON.stringify(formattedMessages), { EX: 3600 })
    } catch (cacheErr) {
      console.warn("Redis SET error inside messages route:", cacheErr.message)
    }

    return Response.json(formattedMessages)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
