import { z } from "zod";

export const loginSchema = z.object({
  nickname: z.string()
    .min(3, { message: "Nickname must be at least 3 characters long" })
    .max(24, { message: "Nickname must be at most 24 characters long" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^[a-z0-9_]+$/, { message: "Password can only contain lowercase letters, numbers, and underscores" }),
});

export const registerSchema = z.object({
  nickname: z.string()
    .min(3, { message: "Nickname must be at least 3 characters long" })
    .max(24, { message: "Nickname must be at most 24 characters long" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^[a-z0-9_]+$/, { message: "Password can only contain lowercase letters, numbers, and underscores" }),
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal(''))
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;