"use server";

import {
  findAuthenticationUserByUsername,
  signInAuthenticationUser,
  signUpAuthenticationUser,
} from "../repositories/AuthenticationRepository";
import type {
  AuthenticationField,
  AuthenticationSignInInput,
  AuthenticationSignInResult,
  AuthenticationSignUpInput,
  AuthenticationSignUpResult,
} from "../types/AuthenticationType";
import {
  authenticationSignInSchema,
  authenticationSignUpSchema,
} from "../schemas/AuthenticationSchema";

export async function signIn(
  input: AuthenticationSignInInput
): Promise<AuthenticationSignInResult> {
  const parsed = authenticationSignInSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const rawField = issue.path[0] as AuthenticationField | undefined;
    const field: AuthenticationField =
      rawField === "email" || rawField === "password" ? rawField : "general";
    return {
      data: null,
      error: issue.message ?? "Periksa lagi email dan kata sandimu",
      fields: [field],
    };
  }

  const result = await signInAuthenticationUser(parsed.data);
  if (result.error) {
    return { data: null, error: "Email atau kata sandi belum cocok", fields: ["general"] };
  }

  return { data: result.data, error: null, fields: [] };
}

export async function signUp(
  input: AuthenticationSignUpInput
): Promise<AuthenticationSignUpResult> {
  const parsed = authenticationSignUpSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const rawField = issue.path[0];
    if (rawField === "confirmPassword" && issue.message === "Kedua kata sandi belum sama") {
      return {
        data: null,
        error: issue.message,
        fields: ["password", "confirmPassword"],
      };
    }
    const field = (rawField as AuthenticationField) ?? "general";
    if (["username", "name", "email", "password", "confirmPassword"].includes(field)) {
      return {
        data: null,
        error: issue.message ?? "Periksa lagi data akunmu",
        fields: [field],
      };
    }
    return {
      data: null,
      error: issue.message ?? "Periksa lagi data akunmu",
      fields: ["general"],
    };
  }

  const userExist = await findAuthenticationUserByUsername(parsed.data.username);

  if (userExist.error) {
    return {
      data: null,
      error: "Kuiska belum bisa memeriksa nama pengguna. Coba lagi",
      fields: ["general"],
    };
  }

  if (userExist.data?.id) {
    return {
      data: null,
      error: "Nama pengguna itu sudah dipakai",
      fields: ["username"],
    };
  }

  const result = await signUpAuthenticationUser({
    name: parsed.data.name,
    email: parsed.data.email,
    password: parsed.data.password,
    username: parsed.data.username,
    displayUsername: parsed.data.name,
  });

  if (result.error) {
    return {
      data: null,
      error: "Akun belum berhasil dibuat. Periksa datamu, lalu coba lagi",
      fields: ["general"],
    };
  }

  return { data: result.data, error: null, fields: [] };
}
