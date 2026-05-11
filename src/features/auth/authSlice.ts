import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types/auth";
import { login, register } from "./authThunks";
import type { AuthResponse } from "../../dto/authDto";
import { isString } from "../../types/guards";
import { getToken, getUser } from "../../app/utils";

interface AuthState {
  user: User | null,
  token: string | null,
  loading: boolean,
  error: string | null
}

const initialState: AuthState = {
  user: JSON.parse(getUser() || 'null'),
  token: getToken(),
  loading: false,
  error: null
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.error = null;
          state.user = action.payload.user;
          state.token = action.payload.accessToken;
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          localStorage.setItem("accessToken", action.payload.accessToken);
        },
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        if (isString(action.payload)) {
          state.error = action.payload;
        } else {
          state.error = "Login failed";
        }
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.error = null;
          state.user = action.payload.user;
          state.token = action.payload.accessToken;
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          localStorage.setItem("accessToken", action.payload.accessToken);
        },
      )
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        if (isString(action.payload)) {
          state.error = action.payload;
        } else {
          state.error = "Registration failed";
        }
      });
  },
});

export const { loading, clearError, logout } = authSlice.actions;
export default authSlice.reducer;