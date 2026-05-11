import type { User } from "../types/auth";

export interface LoginRequest {
  nickname: string;
  password: string;
}

export interface RegisterRequest {
  nickname: string;
  password: string;
  email?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}