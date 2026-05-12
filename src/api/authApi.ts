import type { LoginRequest, AuthResponse, RegisterRequest } from "../dto/authDtos";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API base URL is not defined in environment variables");
}

export async function login(loginRequest: LoginRequest): Promise<AuthResponse> {
  try {
    console.log('logging in: ', loginRequest.nickname, loginRequest.password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Login failed: ", errorData);
      throw new Error(`Login failed: ${errorData.message || response.statusText}`);
    }

    const data: AuthResponse = await response.json();
    return data;

  } catch (error) {
    console.error("Login error: ", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`${errorMessage ? errorMessage : "Network error"}`);
  }
}

export async function register(registerRequest: RegisterRequest): Promise<AuthResponse> {
  try {
    console.log('registering: ', registerRequest.nickname, registerRequest.password);

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Registration failed: ", errorData);
      throw new Error(`Registration failed: ${errorData.message || response.statusText}`);
    }

    const data: AuthResponse = await response.json();
    return data;

  } catch (error) {
    console.error("Registration error: ", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`${errorMessage ? errorMessage : "Network error"}`);
  }
}
