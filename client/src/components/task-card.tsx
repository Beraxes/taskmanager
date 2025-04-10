"use client"

import type React from "react"

import { type Task, TaskStatus } from "@/lib/types"
import { Play, CheckCircle, X, Clock, CheckCircle2, Coffee, FileText, Save, XCircle, Trash2, Globe, Lock } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface TaskCardProps {
  task: Task
  icon?: React.ReactNode
  onStatusChange: (id: string, status: TaskStatus) => void
  onEdit: () => void
  onDelete: () => void
  onUpdate: (updatedTask: Task) => void
  isLoggedIn?: boolean
  onTogglePublic?: (id: string, isPublic: boolean) => void
}

export default function TaskCard({ task, icon, onStatusChange, onEdit, onDelete, onUpdate, isLoggedIn, onTogglePublic }: TaskCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isPublic, setIsPublic] = useState(task.isPublic || false)

  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only close if clicking outside both the menu and the button
      if (
        isCategoryMenuOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsCategoryMenuOpen(false)
      }

      if (isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isCategoryMenuOpen, isMenuOpen])

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
    const buttonStyles = {
      [TaskStatus.IN_PROGRESS]: "bg-amber-400",
      [TaskStatus.COMPLETED]: "bg-green-400",
      [TaskStatus.WONT_DO]: "bg-red-400",
      [TaskStatus.TO_DO]: "bg-gray-300",
    }

    const buttonIcons = {
      [TaskStatus.IN_PROGRESS]: <Play className="h-4 w-4 text-white" />,
      [TaskStatus.COMPLETED]: <CheckCircle className="h-4 w-4 text-white" />,
      [TaskStatus.WONT_DO]: <X className="h-4 w-4 text-white" />,
      [TaskStatus.TO_DO]: <Play className="h-4 w-4 text-gray-600" />,
    }

    return (
      <div className="relative">
        <button
          ref={buttonRef}
          className={`h-8 w-8 rounded-md ${buttonStyles[task.status]} flex items-center justify-center`}
          onClick={(e) => {
            e.stopPropagation()
            setIsCategoryMenuOpen(!isCategoryMenuOpen)
          }}
        >
          {buttonIcons[task.status]}
        </button>

        {isCategoryMenuOpen && (
          <div ref={menuRef} className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg z-20">
            <div className="py-1">
              <button
                className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation()
                  onStatusChange(task.id, TaskStatus.TO_DO)
                  setIsCategoryMenuOpen(false)
                }}
              >
                <FileText className="h-4 w-4 text-gray-600" />
                To Do
              </button>
              <button
                className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation()
                  onStatusChange(task.id, TaskStatus.IN_PROGRESS)
                  setIsCategoryMenuOpen(false)
                }}
              >
                <Clock className="h-4 w-4 text-amber-600" />
                In Progress
              </button>
              <button
                className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation()
                  onStatusChange(task.id, TaskStatus.COMPLETED)
                  setIsCategoryMenuOpen(false)
                }}
              >
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Completed
              </button>
              <button
                className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation()
                  onStatusChange(task.id, TaskStatus.WONT_DO)
                  setIsCategoryMenuOpen(false)
                }}
              >
                <Coffee className="h-4 w-4 text-red-400" />
                Won't Do
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdate({
        ...task,
        title: editTitle,
        description: editDescription,
      })
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditTitle(task.title)
    setEditDescription(task.description)
    setIsEditing(false)
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleTogglePublic = () => {
    const newIsPublic = !isPublic
    setIsPublic(newIsPublic)
    if (onTogglePublic) {
      onTogglePublic(task.id, newIsPublic)
    }
  }

  return (
    <>
      <div
        className={`rounded-xl p-4 ${getCardStyle()} relative`}
        onClick={(e) => {
          // Prevent clicks on the card from closing menus
          e.stopPropagation()
        }}
      >
        {isLoggedIn && (
          <button
            onClick={handleTogglePublic}
            className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-gray-100 transition-colors"
            title={isPublic ? "Make private" : "Make public"}
          >
            {isPublic ? (
              <Globe className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <Lock className="h-3.5 w-3.5 text-gray-600" />
            )}
          </button>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center">
              {task.status === TaskStatus.IN_PROGRESS && <Clock className="h-5 w-5 text-amber-600" />}
              {task.status === TaskStatus.COMPLETED && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              {task.status === TaskStatus.WONT_DO && <Coffee className="h-5 w-5 text-red-400" />}
              {task.status === TaskStatus.TO_DO && <FileText className="h-5 w-5 text-gray-600" />}
            </div>
            {isEditing ? (
              <div className="flex-1 space-y-2">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Task title"
                  className="w-full"
                />
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Task description (optional)"
                  rows={2}
                  className="w-full"
                />
                <div className="flex gap-2">
                  <button
                    className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                    onClick={handleSaveEdit}
                  >
                    <Save className="h-3 w-3" /> Save
                  </button>
                  <button
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-700"
                    onClick={handleCancelEdit}
                  >
                    <XCircle className="h-3 w-3" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1" onDoubleClick={() => setIsEditing(true)}>
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
                <p className="text-xs text-gray-500 mt-1">Double-click to edit</p>
              </div>
            )}
          </div>
          <div className="relative flex gap-2">
            {!isEditing && getActionButton()}
            {!isEditing && (
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={handleDeleteClick}
                title="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            {isMenuOpen && !isEditing && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg z-10">
                <div className="py-1">
                  <button
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setIsEditing(true)
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

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
