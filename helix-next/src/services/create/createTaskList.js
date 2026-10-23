export async function createTaskList({ name, userId }) {
  if (!name) {
    throw new Error("TaskList name is required")
  }
  if (!userId) {
    throw new Error("userId is required")
  }

  // Returns list name metadata
  return { name }
}
