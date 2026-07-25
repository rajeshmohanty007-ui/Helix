import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { createTask } from "@/services/create/createTask"
import { aiCooldowns, COOLDOWN_DURATION_MS } from "@/lib/aiCooldown"

export async function createTaskHandler(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const body = await req.json()

    let subtasks = body.subtasks || []
    let tags = body.tags || []

    const hasPreGenerated = (subtasks.length > 0 || tags.length > 0)

    // Respect the 2-minute cooldown before calling Gemini LLM (only call if not pre-generated)
    let shouldGenerateAI = !hasPreGenerated
    if (shouldGenerateAI && aiCooldowns.has(userId)) {
      const lastRequestTime = aiCooldowns.get(userId)
      const elapsed = Date.now() - lastRequestTime
      if (elapsed < COOLDOWN_DURATION_MS) {
        shouldGenerateAI = false
      }
    }

    if (shouldGenerateAI && body.title && body.title.trim()) {
      try {
        const apiKey = process.env.GEMINI_API_KEY
        if (apiKey) {
          const promptText = `
You are a task organizer. Generate 3 to 5 clear, actionable subtask titles and 2 to 3 relevant single-word tags for this task.

Task Title: "${body.title}"
Task Description: "${body.description || ""}"

Output MUST be a JSON object with this exact schema:
{
  "subtasks": ["subtask title 1", "subtask title 2", ...],
  "tags": ["tag1", "tag2", ...]
}

Respond ONLY with the raw JSON string. Do not add markdown code blocks or styling.
`
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [{ text: promptText }],
                  },
                ],
                generationConfig: {
                  responseMimeType: "application/json",
                },
              }),
            }
          )

          if (response.ok) {
            const result = await response.json()
            let text = result?.candidates?.[0]?.content?.parts?.[0]?.text
            if (text) {
              text = text.trim()
              if (text.startsWith("```")) {
                text = text
                  .replace(/^```json\s*/, "")
                  .replace(/^```\s*/, "")
                  .replace(/\s*```$/, "")
              }
              const parsed = JSON.parse(text)
              if (Array.isArray(parsed.subtasks)) subtasks = parsed.subtasks
              if (Array.isArray(parsed.tags)) tags = parsed.tags

              // Save cooldown since LLM was successfully triggered
              aiCooldowns.set(userId, Date.now())
            }
          }
        }
      } catch (err) {
        console.error("Failed to generate subtasks/tags via Gemini:", err)
      }
    }

    const task = await createTask({
      title: body.title,
      description: body.description,
      priority: body.priority,
      deadline: body.deadline,
      duration: body.duration,
      taskList: body.taskList,
      userId,
      subtasks,
      tags,
    })

    return Response.json({
      success: true,
      task,
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}
