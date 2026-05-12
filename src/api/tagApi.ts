import { getToken } from "../app/utils";
import type { TagEntry } from "../dto/tagDtos";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API base URL is not defined in environment variables");
}

export async function fetchTags(): Promise<TagEntry[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/tags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to fetch tags: ", errorData);
      throw new Error(`Failed to fetch tags: ${errorData.message || response.statusText}`);
    }
    
    const tags: TagEntry[] = await response.json();
    return tags;

  } catch (error) {
    console.error("Error fetching tags:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`${errorMessage ? errorMessage : "Network error"}`);
  }
}