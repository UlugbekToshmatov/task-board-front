import type { UserRef } from "./authTypes";

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum TaskVisibility {
  ONLY_ME = "ONLY_ME",
  LIST = "LIST",
  ANYONE = "ANYONE",
}

export enum AssignmentStatus {
  NONE = "NONE",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface Tag {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  visibility: TaskVisibility;
  creator: UserRef;
  assignee?: UserRef;
  assignmentStatus: AssignmentStatus;
  assignedById?: string;
  viewerUserIds: string[];
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}