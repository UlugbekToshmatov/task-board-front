import type { TaskStatus, TaskPriority, AssignmentStatus, Task, TaskVisibility } from "../types/taskTypes";

export interface TaskFilterParams {
  page: number;
  pageSize: number;
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assignmentStatus?: AssignmentStatus[];
  q?: string;
  tag?: string[];
  sort?: 'createdAt' | 'updatedAt' | 'title';
  order?: 'asc' | 'desc';
  mine?: 'all' | 'created' | 'assigned' | 'involved';
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  visibility?: TaskVisibility;
  viewerUserIds?: string[];
  assigneeId?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  visibility?: TaskVisibility;
  viewerUserIds: string[];
}

export interface TaskListResponse {
  items: Task[];
  total: number;
  page: number;
  pageSize: number;
}
