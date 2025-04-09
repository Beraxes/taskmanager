import { type Task, TaskStatus } from "@/lib/types"

// Get the API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || ""

// API Task interface matching the backend format
export interface ApiTask {
  _id?: string
  title: string
  description: string
  userId?: string
  completed: boolean
  category: string
  isPublic: boolean
  __v?: number
}

// Convert local Task to API Task format
export function localTaskToApiTask(task: Task): ApiTask {
  // Map TaskStatus to category string
  let category = "none"
  switch (task.status) {
    case TaskStatus.IN_PROGRESS:
      category = "in-progress"
      break
    case TaskStatus.COMPLETED:
      category = "completed"
      break
    case TaskStatus.WONT_DO:
      category = "wont-do"
      break
    case TaskStatus.TO_DO:
      category = "to-do"
      break
  }

  return {
    title: task.title,
    description: task.description,
    completed: task.status === TaskStatus.COMPLETED,
    category,
    isPublic: false,
  }
}

// Convert API Task to local Task format
export function apiTaskToLocalTask(apiTask: ApiTask): Task {
  // Map category string to TaskStatus
  let status = TaskStatus.TO_DO
  switch (apiTask.category) {
    case "in-progress":
      status = TaskStatus.IN_PROGRESS
      break
    case "completed":
      status = TaskStatus.COMPLETED
      break
    case "wont-do":
      status = TaskStatus.WONT_DO
      break
    case "to-do":
      status = TaskStatus.TO_DO
      break
  }

  // If completed is true, override status to COMPLETED
  if (apiTask.completed) {
    status = TaskStatus.COMPLETED
  }

  // Determine icon based on status
  let icon = "file"
  switch (status) {
    case TaskStatus.IN_PROGRESS:
      icon = "clock"
      break
    case TaskStatus.COMPLETED:
      icon = "check"
      break
    case TaskStatus.WONT_DO:
      icon = "coffee"
      break
    case TaskStatus.TO_DO:
      icon = "file"
      break
  }

  return {
    id: apiTask._id || String(Date.now()),
    title: apiTask.title,
    description: apiTask.description,
    status,
    icon,
  }
}

// Get all tasks from the API
export async function fetchTasks(token: string): Promise<Task[]> {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to fetch tasks" }))
      throw new Error(errorData.message || "Failed to fetch tasks")
    }

    const apiTasks: ApiTask[] = await response.json()
    return apiTasks.map(apiTaskToLocalTask)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    throw error
  }
}

// Create a new task on the API
export async function createTask(task: Task, token: string): Promise<Task> {
  try {
    const apiTask = localTaskToApiTask(task)
    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(apiTask),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to create task" }))
      throw new Error(errorData.message || "Failed to create task")
    }

    const createdTask: ApiTask = await response.json()
    return apiTaskToLocalTask(createdTask)
  } catch (error) {
    console.error("Error creating task:", error)
    throw error
  }
}

// Update an existing task on the API
export async function updateTask(task: Task, token: string): Promise<Task> {
  try {
    const apiTask = localTaskToApiTask(task)
    const response = await fetch(`${API_URL}/tasks/${task.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(apiTask),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to update task" }))
      throw new Error(errorData.message || "Failed to update task")
    }

    const updatedTask: ApiTask = await response.json()
    return apiTaskToLocalTask(updatedTask)
  } catch (error) {
    console.error("Error updating task:", error)
    throw error
  }
}

// Delete a task from the API
export async function deleteTask(taskId: string, token: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to delete task" }))
      throw new Error(errorData.message || "Failed to delete task")
    }
  } catch (error) {
    console.error("Error deleting task:", error)
    throw error
  }
}

// Sync local tasks with the API
export async function syncTasks(localTasks: Task[], token: string): Promise<Task[]> {
  try {
    // Create all local tasks on the API
    const createPromises = localTasks.map((task) => createTask(task, token))
    await Promise.all(createPromises)

    // Fetch all tasks from the API
    return await fetchTasks(token)
  } catch (error) {
    console.error("Error syncing tasks:", error)
    throw error
  }
}
