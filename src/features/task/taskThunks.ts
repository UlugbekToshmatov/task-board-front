import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchTasks as getFilteredTasks,
  createTask as createNewTask,
  fetchTaskById as getTaskById,
  updateTask as updateTaskById,
  deleteTask as deleteTaskById,
} from "../../api/taskApi";
import type {
  CreateTaskRequest,
  TaskFilterParams,
  UpdateTaskRequest,
} from "../../dto/taskDtos";
import { buildTaskQueryParams } from "./taskThunksHelper";

export const fetchTasks = createAsyncThunk(
  "task/fetchTasks",
  async (params: TaskFilterParams, { rejectWithValue }) => {
    try {
      return await getFilteredTasks(buildTaskQueryParams(params));
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  "task/fetchTaskById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await getTaskById(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

export const createTask = createAsyncThunk(
  "task/createTask",
  async (taskRequest: CreateTaskRequest, { rejectWithValue }) => {
    try {
      return await createNewTask(taskRequest);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

export const updateTask = createAsyncThunk(
  "task/updateTask",
  async (
    { id, changes }: { id: string; changes: UpdateTaskRequest },
    { rejectWithValue },
  ) => {
    try {
      return await updateTaskById(id, changes);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteTaskById(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);
