"use client"

import { useEffect, useState } from "react"
import TaskCard from "@/components/task-card"
import AddTaskButton from "@/components/add-task-button"
import TaskForm from "@/components/task-form"
import { type Task, TaskStatus } from "@/lib/types"
import { Clock, CheckCircle2, Coffee, FileText, Pencil, Play, CheckCircle, X } from "lucide-react"
import Navbar from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { fetchTasks, createTask, updateTask, deleteTask, UnauthorizedError } from "@/lib/task-service"
import { useToast } from "@/components/ui/use-toast"

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<TaskStatus | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const { user, syncLocalTasks, shouldClearTasks, clearTasks, handleUnauthorized } = useAuth()
  const { toast } = useToast()

  // Load tasks on component mount and when user changes
  useEffect(() => {
    const loadTasks = async () => {
      try {
        if (user && user.token) {
          // If user is logged in, fetch tasks from API
          const apiTasks = await fetchTasks(user.token)
          setTasks(apiTasks)
        } else {
          // If user is not logged in, load from localStorage
          const savedTasks = localStorage.getItem("tasks")
          if (savedTasks) {
            setTasks(JSON.parse(savedTasks))
          }
        }
      } catch (error) {
        console.error("Error loading tasks:", error)

        if (error instanceof UnauthorizedError) {
          handleUnauthorized()
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please login again.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error",
            description: "Failed to load tasks. Please try again.",
            variant: "destructive",
          })
        }
      }
    }

    loadTasks()
  }, [user, toast, handleUnauthorized])

  // Sync local tasks with API when user logs in
  useEffect(() => {
    const syncTasksOnLogin = async () => {
      if (user && user.token) {
        // Check if there are local tasks to sync
        const localTasks = localStorage.getItem("tasks")
        if (localTasks) {
          try {
            setIsSyncing(true)
            const parsedTasks = JSON.parse(localTasks)
            if (parsedTasks.length > 0) {
              // Sync local tasks with API
              const syncedTasks = await syncLocalTasks(parsedTasks)
              setTasks(syncedTasks)
              // Clear local storage after successful sync
              localStorage.removeItem("tasks")
              toast({
                title: "Tasks Synced",
                description: `Successfully synced ${parsedTasks.length} tasks with your account.`,
              })
            }
          } catch (error) {
            console.error("Error syncing tasks:", error)

            if (error instanceof UnauthorizedError) {
              handleUnauthorized()
              toast({
                title: "Session Expired",
                description: "Your session has expired. Please login again.",
                variant: "destructive",
              })
            } else {
              toast({
                title: "Sync Failed",
                description: "Failed to sync tasks with your account. Please try again.",
                variant: "destructive",
              })
            }
          } finally {
            setIsSyncing(false)
          }
        }
      }
    }

    syncTasksOnLogin()
  }, [user, syncLocalTasks, toast, handleUnauthorized])

  // Add this effect to clear tasks when user logs out
  useEffect(() => {
    if (shouldClearTasks) {
      setTasks([])
      clearTasks()
    }
  }, [shouldClearTasks, clearTasks])

  // Update the localStorage saving effect to check for shouldClearTasks
  useEffect(() => {
    if (!user && tasks.length > 0 && !shouldClearTasks) {
      localStorage.setItem("tasks", JSON.stringify(tasks))
    }
  }, [tasks, user, shouldClearTasks])

  const addTask = async (task: Task) => {
    // If a category is selected, assign that status to the new task
    if (selectedCategory) {
      task.status = selectedCategory

      // Set appropriate icon based on status
      switch (selectedCategory) {
        case TaskStatus.IN_PROGRESS:
          task.icon = "clock"
          break
        case TaskStatus.COMPLETED:
          task.icon = "check"
          break
        case TaskStatus.WONT_DO:
          task.icon = "coffee"
          break
        case TaskStatus.TO_DO:
          task.icon = "file"
          break
      }
    }

    try {
      if (user && user.token) {
        // If user is logged in, create task on API
        const createdTask = await createTask(task, user.token)
        setTasks([...tasks, createdTask])
      } else {
        // If user is not logged in, save to local state
        const newTasks = [...tasks, task]
        setTasks(newTasks)
      }
      setIsAddingTask(false)
    } catch (error) {
      console.error("Error adding task:", error)

      if (error instanceof UnauthorizedError) {
        handleUnauthorized()
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please login again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to add task. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const updateTaskHandler = async (updatedTask: Task) => {
    try {
      if (user && user.token) {
        // If user is logged in, update task on API
        const updated = await updateTask(updatedTask, user.token)
        const newTasks = tasks.map((task) => (task.id === updated.id ? updated : task))
        setTasks(newTasks)
      } else {
        // If user is not logged in, update in local state
        const newTasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        setTasks(newTasks)
      }
      setEditingTask(null)
    } catch (error) {
      console.error("Error updating task:", error)

      if (error instanceof UnauthorizedError) {
        handleUnauthorized()
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please login again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update task. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const deleteTaskHandler = async (id: string) => {
    try {
      if (user && user.token) {
        // If user is logged in, delete task from API
        await deleteTask(id, user.token)
      }
      // Remove from local state regardless
      const newTasks = tasks.filter((task) => task.id !== id)
      setTasks(newTasks)
    } catch (error) {
      console.error("Error deleting task:", error)

      if (error instanceof UnauthorizedError) {
        handleUnauthorized()
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please login again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete task. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const changeTaskStatus = async (id: string, newStatus: TaskStatus) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === id)
      if (!taskToUpdate) return

      const updatedTask = { ...taskToUpdate, status: newStatus }

      if (user && user.token) {
        // If user is logged in, update task on API
        const updated = await updateTask(updatedTask, user.token)
        const newTasks = tasks.map((task) => (task.id === updated.id ? updated : task))
        setTasks(newTasks)
      } else {
        // If user is not logged in, update in local state
        const newTasks = tasks.map((task) => (task.id === id ? updatedTask : task))
        setTasks(newTasks)
      }
    } catch (error) {
      console.error("Error changing task status:", error)

      if (error instanceof UnauthorizedError) {
        handleUnauthorized()
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please login again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update task status. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "clock":
        return <Clock className="h-5 w-5 text-amber-600" />
      case "check":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "coffee":
        return <Coffee className="h-5 w-5 text-red-400" />
      case "file":
        return <FileText className="h-5 w-5 text-gray-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }
  
  const toggleTaskPublic = async (id: string, isPublic: boolean) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === id)
      if (!taskToUpdate) return

      const updatedTask = { ...taskToUpdate, isPublic }

      if (user && user.token) {
        // If user is logged in, update task on API
        const updated = await updateTask(updatedTask, user.token)
        const newTasks = tasks.map((task) => (task.id === updated.id ? updated : task))
        setTasks(newTasks)

        toast({
          title: isPublic ? "Task made public" : "Task made private",
          description: isPublic ? "This task is now visible to others." : "This task is now private.",
        })
      } else {
        // If user is not logged in, update in local state
        const newTasks = tasks.map((task) => (task.id === id ? updatedTask : task))
        setTasks(newTasks)
      }
    } catch (error) {
      console.error("Error changing task public status:", error)

      if (error instanceof UnauthorizedError) {
        handleUnauthorized()
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please login again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update task visibility. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-4 md:p-8">
        <div className="mx-auto max-w-md">
          <div className="mb-6 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-amber-400 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-amber-600"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Task Board <Pencil className="h-4 w-4 inline-block" />
            </h1>
          </div>
          <p className="mb-6 text-gray-600">Tasks to keep organised</p>

          {!user && (
            <div className="mb-4 bg-amber-50 p-4 rounded-xl">
              <p className="text-amber-800 mb-2">
                You're using the task manager as a guest. Your tasks are saved on this device only.
              </p>
              <p className="text-amber-800 text-sm">To sync your tasks across devices, please login or register.</p>
            </div>
          )}

          {isSyncing && (
            <div className="mb-4 bg-blue-50 p-4 rounded-xl">
              <p className="text-blue-800 flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Syncing your tasks...
              </p>
            </div>
          )}

          <div className="space-y-4">
            {/* Category Headers */}
            <div className="grid gap-4">
              <div
                className={`rounded-xl p-4 bg-amber-100 cursor-pointer ${selectedCategory === TaskStatus.IN_PROGRESS ? "ring-2 ring-amber-400" : ""}`}
                onClick={() => setSelectedCategory(TaskStatus.IN_PROGRESS)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center">
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <h3 className="font-medium text-gray-900">Task in Progress</h3>
                  </div>
                  <div className="h-8 w-8 rounded-md bg-amber-400 flex items-center justify-center">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>

              <div
                className={`rounded-xl p-4 bg-green-100 cursor-pointer ${selectedCategory === TaskStatus.COMPLETED ? "ring-2 ring-green-400" : ""}`}
                onClick={() => setSelectedCategory(TaskStatus.COMPLETED)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="font-medium text-gray-900">Task Completed</h3>
                  </div>
                  <div className="h-8 w-8 rounded-md bg-green-400 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>

              <div
                className={`rounded-xl p-4 bg-red-100 cursor-pointer ${selectedCategory === TaskStatus.WONT_DO ? "ring-2 ring-red-400" : ""}`}
                onClick={() => setSelectedCategory(TaskStatus.WONT_DO)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center">
                      <Coffee className="h-5 w-5 text-red-400" />
                    </div>
                    <h3 className="font-medium text-gray-900">Task Won't Do</h3>
                  </div>
                  <div className="h-8 w-8 rounded-md bg-red-400 flex items-center justify-center">
                    <X className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>

              <div
                className={`rounded-xl p-4 bg-gray-200 cursor-pointer ${selectedCategory === TaskStatus.TO_DO ? "ring-2 ring-gray-400" : ""}`}
                onClick={() => setSelectedCategory(TaskStatus.TO_DO)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center">
                      <FileText className="h-5 w-5 text-gray-600" />
                    </div>
                    <h3 className="font-medium text-gray-900">Task To Do</h3>
                  </div>
                  <div className="h-8 w-8 rounded-md bg-gray-300 flex items-center justify-center">
                    <Play className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Show All Categories Button */}
            <button
              className="w-full rounded-xl bg-white border border-gray-200 p-2 text-sm font-medium hover:bg-gray-50 transition-colors"
              onClick={() => setSelectedCategory(null)}
            >
              {selectedCategory ? "Show All Categories" : "All Categories (Selected)"}
            </button>

            {/* Add New Task Button - Moved above the task list */}
            {!isAddingTask && !isSyncing && <AddTaskButton onClick={() => setIsAddingTask(true)} />}

            {/* Filtered Tasks */}
            {tasks
              .filter((task) => selectedCategory === null || task.status === selectedCategory)
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  icon={getIconComponent(task.icon)}
                  onStatusChange={changeTaskStatus}
                  onEdit={() => setEditingTask(task)}
                  onDelete={() => deleteTaskHandler(task.id)}
                  onUpdate={updateTaskHandler}
                  isLoggedIn={!!user}
                  onTogglePublic={toggleTaskPublic}
                />
              ))}

            {tasks.length === 0 && !isSyncing && (
              <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-500">No tasks yet. Add your first task to get started!</p>
              </div>
            )}
          </div>

          {isAddingTask && (
            <TaskForm onSubmit={addTask} onCancel={() => setIsAddingTask(false)} selectedCategory={selectedCategory} />
          )}

          {editingTask && (
            <TaskForm task={editingTask} onSubmit={updateTaskHandler} onCancel={() => setEditingTask(null)} />
          )}
        </div>
      </div>
    </div>
  )
}