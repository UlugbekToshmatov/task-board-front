import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string()
    .min(1, { message: "Title must be at least 1 character long" })
    .max(500, { message: "Title must be at most 500 characters long" }),
  description: z.string()
    .max(5000, { message: "Description must be at most 5000 characters long" })
    .optional().or(z.literal('')),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional().or(z.literal('')),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional().or(z.literal('')),
  visibility: z.enum(["ONLY_ME", "LIST", "ANYONE"]).optional().or(z.literal('')),
  viewerUserIds: z.array(z.string()).optional(),
  assigneeId: z.string().optional().or(z.literal('')),
});

export const updateTaskSchema = z.object({
  title: z.string()
    .min(1, { message: "Title must be at least 1 character long" })
    .max(500, { message: "Title must be at most 500 characters long" }),
  description: z.string()
    .max(5000, { message: "Description must be at most 5000 characters long" })
    .optional().or(z.literal('')),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional().or(z.literal('')),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional().or(z.literal('')),
  visibility: z.enum(["ONLY_ME", "LIST", "ANYONE"]).optional().or(z.literal('')),
  viewerUserIds: z.array(z.string()),
});

export type CreateTaskForm = z.infer<typeof createTaskSchema>;
export type UpdateTaskForm = z.infer<typeof updateTaskSchema>;
