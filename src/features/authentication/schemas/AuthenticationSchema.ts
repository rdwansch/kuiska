import { z } from "zod";

export const authenticationSignInSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export const authenticationSignUpSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(64, "Username must be 64 characters or fewer")
      .regex(/^[a-zA-Z0-9_]+$/, "Use only letters, numbers, and underscores"),
    name: z.string().trim().min(1, "Enter your display name").max(255),
    email: z.email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
