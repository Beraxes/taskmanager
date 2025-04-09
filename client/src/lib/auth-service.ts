export interface User {
  id: string
  username: string
  email?: string
  token?: string
}

// Get the API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || ""

export async function loginUser(username: string, password: string): Promise<User> {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Login failed" }))
      throw new Error(errorData.message || "Failed to login")
    }

    // Get the response data with access_token
    const data = await response.json()

    // Create a user object from the token
    return {
      id: `user_${Date.now()}`, // Generate a temporary ID
      username,
      token: data.access_token,
    }
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

export async function registerUser(username: string, email: string, password: string): Promise<User> {
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Registration failed" }))
      throw new Error(errorData.message || "Failed to register")
    }

    // Get the response data with success message
    const data = await response.json()

    // Create a user object (without token since registration doesn't return one)
    return {
      id: `user_${Date.now()}`, // Generate a temporary ID
      username,
      email,
      // No token here, user will need to login
    }
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}