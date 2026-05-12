import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Task } from "../../types/taskTypes";
import type { TaskListResponse } from "../../dto/taskDtos";
import {
  fetchTasks,
  fetchTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "./taskThunks";
import { isString } from "../../types/guards";

interface TaskState {
  items: Task[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;

  selected: Task | null;
  selectedLoading: boolean;
  selectedError: string | null;
}

const initialState: TaskState = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 20,
  loading: false,
  error: null,

  selected: null,
  selectedLoading: false,
  selectedError: null,
};

function replaceInItems(items: Task[], updated: Task): Task[] {
  const idx = items.findIndex((t) => t.id === updated.id);
  if (idx === -1) return items;
  const next = items.slice();
  next[idx] = updated;
  return next;
}

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.selectedError = null;
    },
    clearSelected: (state) => {
      state.selected = null;
      state.selectedError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Tasks (list)
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTasks.fulfilled,
        (state, action: PayloadAction<TaskListResponse>) => {
          state.loading = false;
          state.error = null;
          state.items = action.payload.items;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.pageSize = action.payload.pageSize;
        },
      )
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = isString(action.payload)
          ? action.payload
          : "Failed to fetch tasks";
      });

    // Fetch Task by id
    builder
      .addCase(fetchTaskById.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = null;
      })
      .addCase(
        fetchTaskById.fulfilled,
        (state, action: PayloadAction<Task>) => {
          state.selectedLoading = false;
          state.selectedError = null;
          state.selected = action.payload;
          state.items = replaceInItems(state.items, action.payload);
        },
      )
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError = isString(action.payload)
          ? action.payload
          : "Failed to fetch task";
      });

    // Create Task
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.error = null;
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = isString(action.payload)
          ? action.payload
          : "Failed to create task";
      });

    // Update Task
    builder
      .addCase(updateTask.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = null;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.selectedLoading = false;
        state.selectedError = null;
        state.items = replaceInItems(state.items, action.payload);
        if (state.selected?.id === action.payload.id) {
          state.selected = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError = isString(action.payload)
          ? action.payload
          : "Failed to update task";
      });

    // Delete Task
    builder
      .addCase(deleteTask.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.selectedLoading = false;
        state.selectedError = null;
        state.items = state.items.filter((t) => t.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
        if (state.selected?.id === action.payload) {
          state.selected = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError = isString(action.payload)
          ? action.payload
          : "Failed to delete task";
      });
  },
});

export const { clearError, clearSelected } = taskSlice.actions;
export default taskSlice.reducer;
