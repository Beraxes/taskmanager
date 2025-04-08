export interface User {
  id: string
  username: string
  email?: string
  token?: string
}

// Get the API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function loginUser(username: string, password: string): Promise<User> {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to login");
    }

    const data = await response.json();
    
    // The API returns { access_token: "token" }
    if (data.access_token) {
      // Create a user object from the token
      // We'll use the username from the login and generate an ID
      return {
        id: `user_${Date.now()}`, // Generate a temporary ID
        username: username,
        token: data.access_token
      };
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
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
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to register");
    }

    const data = await response.json();
    
    // The API returns { message: "User successfully created" }
    if (data.message && data.message.includes("successfully")) {
      // After successful registration, we'll create a user object
      // In a real app, you might want to automatically log in the user after registration
      return {
        id: `user_${Date.now()}`, // Generate a temporary ID
        username: username,
        email: email
        // Note: No token here since the API doesn't return one on registration
      };
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}