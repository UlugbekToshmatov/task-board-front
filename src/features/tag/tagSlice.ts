import { createSlice } from "@reduxjs/toolkit";
import { fetchTags } from "./tagThunks";
import type { TagEntry } from "../../dto/tagDtos";

interface TagState {
  items: TagEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: TagState = {
  items: [],
  loading: false,
  error: null,
};

const tagSlice = createSlice({
  name: "tag",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tags";
      });
  }
});

export const { clearError } = tagSlice.actions;
export default tagSlice.reducer;