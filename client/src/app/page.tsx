"use client"

import { useEffect, useState } from "react"
import TaskCard from "@/components/task-card"
import AddTaskButton from "@/components/add-task-button"
import TaskForm from "@/components/task-form"
import { type Task, TaskStatus } from "@/lib/types"
import { Clock, CheckCircle2, Coffee, FileText, Pencil, Play, CheckCircle, X } from "lucide-react"

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<TaskStatus | null>(null)

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks))
    }
  }, [tasks])

  const addTask = (task: Task) => {
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

    const newTasks = [...tasks, task]
    setTasks(newTasks)
    setIsAddingTask(false)
  }

  const updateTask = (updatedTask: Task) => {
    const newTasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    setTasks(newTasks)
    setEditingTask(null)
  }

  const deleteTask = (id: string) => {
    const newTasks = tasks.filter((task) => task.id !== id)
    setTasks(newTasks)
  }

  const changeTaskStatus = (id: string, newStatus: TaskStatus) => {
    const newTasks = tasks.map((task) => (task.id === id ? { ...task, status: newStatus } : task))
    setTasks(newTasks)
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
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
          {!isAddingTask && <AddTaskButton onClick={() => setIsAddingTask(true)} />}

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
                onDelete={() => deleteTask(task.id)}
                onUpdate={updateTask}
              />
            ))}
        </div>

        {isAddingTask && (
          <TaskForm onSubmit={addTask} onCancel={() => setIsAddingTask(false)} selectedCategory={selectedCategory} />
        )}

        {editingTask && <TaskForm task={editingTask} onSubmit={updateTask} onCancel={() => setEditingTask(null)} selectedCategory={selectedCategory} />}
      </div>
    </div>
  )
}