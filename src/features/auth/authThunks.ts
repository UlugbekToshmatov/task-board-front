import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginRequest, RegisterRequest } from "../../dto/authDtos";
import { login as loginUser, register as registerUser } from "../../api/authApi";

export const login = createAsyncThunk(
  "auth/login",
  async (loginRequest: LoginRequest, { rejectWithValue }) => {
    try {
      return await loginUser(loginRequest);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (registerRequest: RegisterRequest, { rejectWithValue }) => {
    try {
      return await registerUser(registerRequest);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
)