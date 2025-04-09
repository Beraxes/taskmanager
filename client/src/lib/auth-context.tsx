"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { loginUser, registerUser, type User } from "@/lib/auth-service"
import { syncTasks } from "@/lib/task-service"
import type { Task } from "@/lib/types"

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<User>
  register: (username: string, email: string, password: string) => Promise<User>
  logout: () => void
  isLoading: boolean
  syncLocalTasks: (tasks: Task[]) => Promise<Task[]>
  clearTasks: () => void
  shouldClearTasks: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [shouldClearTasks, setShouldClearTasks] = useState(false)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const userData = await loginUser(username, password)
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      return userData
    } catch (error) {
      throw error
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      const userData = await registerUser(username, email, password)
      // Note: We don't set the user here because registration doesn't return a token
      // User needs to login after registration
      return userData
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    setShouldClearTasks(true)
    localStorage.removeItem("tasks")
  }

  const clearTasks = () => {
    setShouldClearTasks(false)
  }

  const syncLocalTasks = async (tasks: Task[]): Promise<Task[]> => {
    if (!user || !user.token) {
      throw new Error("User not authenticated")
    }

    return await syncTasks(tasks, user.token)
  }

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    syncLocalTasks,
    clearTasks,
    shouldClearTasks,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
