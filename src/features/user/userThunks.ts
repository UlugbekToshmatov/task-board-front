import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUsers as getUsers } from "../../api/userApi";

export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const users = await getUsers();
      return users;
    } catch (error) {
      return rejectWithValue("Failed to fetch users");
    }
  }
);