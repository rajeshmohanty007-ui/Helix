import { prisma } from "@/lib/prisma"
import { redisClient } from "@/lib/redis"

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params
    const projectId = resolvedParams.id
    const cacheKey = `project:${projectId}:channels`

    // Try to get from Redis cache
    try {
      const cached = await redisClient.get(cacheKey)
      if (cached) {
        return Response.json(JSON.parse(cached))
      }
    } catch (cacheErr) {
      console.warn("Redis GET error inside channels route:", cacheErr.message)
    }

    // Find channels in DB
    let channels = await prisma.channel.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
    })

    // If no channels exist, create a default "general" channel
    if (channels.length === 0) {
      const defaultChannel = await prisma.channel.create({
        data: {
          name: "general",
          projectId,
          status: "active",
          type: "general",
        },
      })
      channels = [defaultChannel]
    }

    // Write to Redis cache (expires in 1 hour)
    try {
      await redisClient.set(cacheKey, JSON.stringify(channels), { EX: 3600 })
    } catch (cacheErr) {
      console.warn("Redis SET error inside channels route:", cacheErr.message)
    }

    return Response.json(channels)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req, { params }) {
  try {
    const resolvedParams = await params
    const projectId = resolvedParams.id
    const { name, type = "general", status = "active" } = await req.json()

    if (!name) {
      return Response.json({ error: "Topic title (name) is required" }, { status: 400 })
    }

    // Clean name to be standard display name (topics have display names, we can preserve casing or clean spaces)
    const cleanName = name.trim()

    if (!cleanName) {
      return Response.json({ error: "Invalid topic name" }, { status: 400 })
    }

    const newChannel = await prisma.channel.create({
      data: {
        name: cleanName,
        projectId,
        type,
        status,
      },
    })

    // Invalidate Redis cache
    try {
      const cacheKey = `project:${projectId}:channels`
      await redisClient.del(cacheKey)
    } catch (cacheErr) {
      console.warn("Redis DEL error inside channels route:", cacheErr.message)
    }

    return Response.json(newChannel)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
