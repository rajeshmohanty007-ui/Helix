const globalForAi = globalThis

if (!globalForAi.aiCooldowns) {
  globalForAi.aiCooldowns = new Map()
}

export const aiCooldowns = globalForAi.aiCooldowns
export const COOLDOWN_DURATION_MS = 2 * 60 * 1000 // 2 minutes
