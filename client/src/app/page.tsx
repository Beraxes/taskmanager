"use client"

import { useEffect, useState } from "react"
import TaskCard from "@/components/task-card"
import AddTaskButton from "@/components/add-task-button"
import TaskForm from "@/components/task-form"
import { type Task, TaskStatus } from "@/lib/types"
import { Clock, CheckCircle2, Coffee, FileText, Pencil } from "lucide-react"

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      // Set default tasks if none exist
      const defaultTasks: Task[] = [
        {
          id: "1",
          title: "Task in Progress",
          description: "",
          status: TaskStatus.IN_PROGRESS,
          icon: "clock",
        },
        {
          id: "2",
          title: "Task Completed",
          description: "",
          status: TaskStatus.COMPLETED,
          icon: "check",
        },
        {
          id: "3",
          title: "Task Won't Do",
          description: "",
          status: TaskStatus.WONT_DO,
          icon: "coffee",
        },
        {
          id: "4",
          title: "Task To Do",
          description: "Work on a Challenge on devChallenges.io, learn TypeScript.",
          status: TaskStatus.TO_DO,
          icon: "file",
        },
      ]
      setTasks(defaultTasks)
      localStorage.setItem("tasks", JSON.stringify(defaultTasks))
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks))
    }
  }, [tasks])

  const addTask = (task: Task) => {
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
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              icon={getIconComponent(task.icon)}
              onStatusChange={changeTaskStatus}
              onEdit={() => setEditingTask(task)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}

          {!isAddingTask && <AddTaskButton onClick={() => setIsAddingTask(true)} />}
        </div>

        {isAddingTask && <TaskForm onSubmit={addTask} onCancel={() => setIsAddingTask(false)} />}

        {editingTask && <TaskForm task={editingTask} onSubmit={updateTask} onCancel={() => setEditingTask(null)} />}
      </div>
    </div>
  )
}

