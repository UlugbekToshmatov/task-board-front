import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTags as getTags } from "../../api/tagApi";

export const fetchTags = createAsyncThunk(
  "tag/fetchTags",
  async (_, { rejectWithValue }) => {
    try {
      return await getTags();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);