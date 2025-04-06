"use client"

interface AddTaskButtonProps {
  onClick: () => void
}

export default function AddTaskButton({ onClick }: AddTaskButtonProps) {
  return (
    <button
      className="w-full rounded-xl bg-amber-100 p-4 flex items-center gap-3 hover:bg-amber-200 transition-colors"
      onClick={onClick}
    >
      <div className="h-8 w-8 rounded-md bg-amber-400 flex items-center justify-center">
        <span className="text-white text-xl font-bold">+</span>
      </div>
      <span className="text-gray-900 font-medium">Add new task</span>
    </button>
  )
}

