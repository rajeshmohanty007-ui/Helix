import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

import { aiCooldowns, COOLDOWN_DURATION_MS } from "@/lib/aiCooldown"

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const now = Date.now()

    // Enforce 2-minute cooldown
    if (aiCooldowns.has(userId)) {
      const lastRequestTime = aiCooldowns.get(userId)
      const elapsed = now - lastRequestTime
      if (elapsed < COOLDOWN_DURATION_MS) {
        const remainingSeconds = Math.ceil((COOLDOWN_DURATION_MS - elapsed) / 1000)
        return Response.json(
          { error: `AI is cooling down. Please wait another ${remainingSeconds}s.` },
          { status: 429 }
        )
      }
    }

    const { title, description } = await req.json()
    if (!title || !title.trim()) {
      return Response.json({ error: "Task title is required to generate metadata." }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return Response.json({ error: "Gemini API key is not configured on the server." }, { status: 500 })
    }

    // Set context time to make deadline estimates logical
    const currentLocalTime = new Date().toISOString()

    const promptText = `
You are a task management AI assistant. Analyze the task title and optional existing description below.
Based on the task's nature, predict/generate suitable metadata, subtasks, and tags.

Context:
- Current Local Time is: ${currentLocalTime}
- Task Title: "${title}"
- Task Description: "${description || "None provided"}"

Generate:
1. "description": A concise, actionable description of what the task entails. If a description is already provided, keep, refine, or expand it.
2. "priority": High, Medium, or Low.
3. "duration": An estimated time to complete, e.g. "2 hrs", "4 hrs", "1 day", "3 days".
4. "subtasks": An array of 3 to 5 clear, actionable subtask titles (strings) to help break down the task.
5. "tags": An array of 2 to 3 single-word relevant tags (strings) for the task.

Your output MUST be a JSON object matching this schema:
{
  "description": string,
  "priority": "High" | "Medium" | "Low",
  "duration": string,
  "subtasks": [string],
  "tags": [string]
}

Respond ONLY with the raw JSON string. Do not wrap it in markdown code blocks or add any other text.
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
              parts: [
                {
                  text: promptText,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    )

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to generate metadata from Gemini")
    }

    let textResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!textResponse) {
      throw new Error("Empty response received from AI model.")
    }

    // Parse safety check: remove codeblock wrappers if model mistakenly generated them
    textResponse = textResponse.trim()
    if (textResponse.startsWith("```")) {
      textResponse = textResponse
        .replace(/^```json\s*/, "")
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "")
    }

    const metadata = JSON.parse(textResponse)

    // Save cooldown only after successful request execution
    aiCooldowns.set(userId, Date.now())

    return Response.json({ success: true, metadata })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
