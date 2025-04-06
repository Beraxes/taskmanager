"use client"

import type React from "react"

import { type Task, TaskStatus } from "@/lib/types"
import { Play, CheckCircle, X } from "lucide-react"
import { useState } from "react"

interface TaskCardProps {
  task: Task
  icon: React.ReactNode
  onStatusChange: (id: string, status: TaskStatus) => void
  onEdit: () => void
  onDelete: () => void
}

export default function TaskCard({ task, icon, onStatusChange, onEdit, onDelete }: TaskCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getCardStyle = () => {
    switch (task.status) {
      case TaskStatus.IN_PROGRESS:
        return "bg-amber-100"
      case TaskStatus.COMPLETED:
        return "bg-green-100"
      case TaskStatus.WONT_DO:
        return "bg-red-100"
      case TaskStatus.TO_DO:
        return "bg-gray-200"
      default:
        return "bg-gray-200"
    }
  }

  const getActionButton = () => {
    switch (task.status) {
      case TaskStatus.IN_PROGRESS:
        return (
          <button
            className="h-8 w-8 rounded-md bg-amber-400 flex items-center justify-center"
            onClick={() => onStatusChange(task.id, TaskStatus.COMPLETED)}
          >
            <Play className="h-4 w-4 text-white" />
          </button>
        )
      case TaskStatus.COMPLETED:
        return (
          <button
            className="h-8 w-8 rounded-md bg-green-400 flex items-center justify-center"
            onClick={() => onStatusChange(task.id, TaskStatus.TO_DO)}
          >
            <CheckCircle className="h-4 w-4 text-white" />
          </button>
        )
      case TaskStatus.WONT_DO:
        return (
          <button
            className="h-8 w-8 rounded-md bg-red-400 flex items-center justify-center"
            onClick={() => onStatusChange(task.id, TaskStatus.TO_DO)}
          >
            <X className="h-4 w-4 text-white" />
          </button>
        )
      case TaskStatus.TO_DO:
        return (
          <button
            className="h-8 w-8 rounded-md bg-gray-300 flex items-center justify-center"
            onClick={() => onStatusChange(task.id, TaskStatus.IN_PROGRESS)}
          >
            <Play className="h-4 w-4 text-gray-600" />
          </button>
        )
      default:
        return null
    }
  }

  return (
    <div className={`rounded-xl p-4 ${getCardStyle()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center">{icon}</div>
          <div>
            <h3 className="font-medium text-gray-900">{task.title}</h3>
            {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
          </div>
        </div>
        <div className="relative">
          {getActionButton()}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg z-10">
              <div className="py-1">
                <button
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    onEdit()
                    setIsMenuOpen(false)
                  }}
                >
                  Edit
                </button>
                <button
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                  onClick={() => {
                    onDelete()
                    setIsMenuOpen(false)
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

