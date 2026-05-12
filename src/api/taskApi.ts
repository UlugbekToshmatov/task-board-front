import { getToken } from "../app/utils";
import type {
  CreateTaskRequest,
  TaskListResponse,
  UpdateTaskRequest,
} from "../dto/taskDtos";
import type { Task } from "../types/taskTypes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API base URL is not defined in environment variables");
}

function authHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`,
  };
}

async function readErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const errorData = await response.json();
    return errorData.message ?? response.statusText ?? fallback;
  } catch {
    return response.statusText ?? fallback;
  }
}

export async function fetchTasks(params: string): Promise<TaskListResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks?${params}`, {
      method: "GET",
      headers: authHeaders(),
    });
    if (!response.ok) {
      const message = await readErrorMessage(response, "Failed to fetch tasks");
      console.error("Failed to fetch tasks: ", message);
      throw new Error(`Failed to fetch tasks: ${message}`);
    }
    const data: TaskListResponse = await response.json();
    return data;

  } catch (error) {
    console.error("Error fetching tasks:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`${errorMessage ? errorMessage : "Network error"}`);
  }
}

export async function fetchTaskById(id: string): Promise<Task> {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "GET",
      headers: authHeaders(),
    });
    if (!response.ok) {
      const message = await readErrorMessage(response, "Failed to fetch task");
      console.error("Failed to fetch task: ", message);
      throw new Error(`Failed to fetch task: ${message}`);
    }
    const data: Task = await response.json();
    return data;

  } catch (error) {
    console.error("Error fetching task:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`${errorMessage ? errorMessage : "Network error"}`);
  }
}

export async function createTask(taskRequest: CreateTaskRequest): Promise<Task> {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(taskRequest),
    });

    if (!response.ok) {
      const message = await readErrorMessage(response, "Failed to create task");
      console.error("Failed to create task: ", message);
      throw new Error(`Failed to create task: ${message}`);
    }

    const data: Task = await response.json();
    return data;

  } catch (error) {
    console.error("Error creating task:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`${errorMessage ? errorMessage : "Network error"}`);
  }
}

export async function updateTask(id: string, taskRequest: UpdateTaskRequest): Promise<Task> {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(taskRequest),
    });

    if (!response.ok) {
      const message = await readErrorMessage(response, "Failed to update task");
      console.error("Failed to update task: ", message);
      throw new Error(`Failed to update task: ${message}`);
    }

    const data: Task = await response.json();
    return data;

  } catch (error) {
    console.error("Error updating task:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`${errorMessage ? errorMessage : "Network error"}`);
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    if (!response.ok) {
      const message = await readErrorMessage(response, "Failed to delete task");
      console.error("Failed to delete task: ", message);
      throw new Error(`Failed to delete task: ${message}`);
    }

  } catch (error) {
    console.error("Error deleting task:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`${errorMessage ? errorMessage : "Network error"}`);
  }
}
