import { getToken } from "../app/utils";
import type { User } from "../types/authTypes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API base URL is not defined in environment variables");
}

export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching users: ", errorData);
      throw new Error(`Error fetching users: ${errorData.message || response.statusText}`);
    }

    const users: User[] = await response.json();
    return users;

  } catch (error) {
    console.error("Error fetching users: ", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`${errorMessage ? errorMessage : "Network error"}`);
  }
}