"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import LoginForm from "./login-form"
import RegisterForm from "./register-form"
import { useAuth } from "@/lib/auth-context"

export default function Navbar() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const { user, logout } = useAuth()

  const toggleAuthMode = () => {
    setIsLogin(!isLogin)
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-amber-400 flex items-center justify-center">
          <div className="h-3 w-3 rounded-full bg-amber-600"></div>
        </div>
        <span className="font-bold text-xl">Task Manager</span>
      </div>

      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Hello, {user.username || user.email}</span>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setShowLoginModal(true)}>
            Login / Register
          </Button>
        )}
      </div>

      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isLogin ? "Login" : "Register"}</DialogTitle>
          </DialogHeader>

          {isLogin ? (
            <div>
              <LoginForm
                onSuccess={() => setShowLoginModal(false)}
                onRegisterClick={() => {
                  toggleAuthMode()
                }}
              />
              <div className="mt-4 pt-4 border-t text-center text-sm text-gray-500">
                <p>Login to sync your tasks across devices</p>
              </div>
            </div>
          ) : (
            <div>
              <RegisterForm
                onSuccess={() => {
                  setIsLogin(true)
                }}
                onLoginClick={() => {
                  toggleAuthMode()
                }}
              />
              <div className="mt-4 pt-4 border-t text-center text-sm text-gray-500">
                <p>Register to sync your tasks across devices</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </nav>
  )
}
