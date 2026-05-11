import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginRequest, RegisterRequest } from "../../dto/authDto";
import { login as loginUser, register as registerUser } from "../../api/authApi";

export const login = createAsyncThunk(
  "auth/login",
  async (loginRequest: LoginRequest, { rejectWithValue }) => {
    try {
      const data = await loginUser(loginRequest);
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (registerRequest: RegisterRequest, { rejectWithValue }) => {
    try {
      const data = await registerUser(registerRequest);
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
)