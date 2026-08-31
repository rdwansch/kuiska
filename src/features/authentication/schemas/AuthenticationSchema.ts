import { z } from "zod";

export const authenticationSignInSchema = z.object({
  email: z.email("Tulis alamat email yang valid"),
  password: z.string().min(1, "Tulis kata sandimu"),
});

export const authenticationSignUpSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Nama pengguna perlu minimal 3 karakter")
      .max(64, "Nama pengguna maksimal 64 karakter")
      .regex(/^[a-zA-Z0-9_]+$/, "Pakai huruf, angka, atau garis bawah"),
    name: z.string().trim().min(1, "Tulis nama tampilanmu").max(255),
    email: z.email("Tulis alamat email yang valid"),
    password: z.string().min(8, "Kata sandi perlu minimal 8 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kedua kata sandi belum sama",
    path: ["confirmPassword"],
  });
