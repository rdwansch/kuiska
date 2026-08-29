import "server-only";

import { eq } from "drizzle-orm";

import { auth } from "~/lib/auth";
import { db } from "~/lib/db";
import { user } from "~/lib/db/schema";
import type {
  AuthenticationSignInRepositoryResult,
  AuthenticationSignInInput,
  AuthenticationSignUpRepositoryResult,
  AuthenticationSignUpRepositoryInput,
  AuthenticationUsernameResult,
} from "../types/AuthenticationType";

function toAuthenticationError(error: unknown) {
  return error instanceof Error ? error : new Error("Authentication repository failed");
}

export async function findAuthenticationUserByUsername(
  username: string
): Promise<AuthenticationUsernameResult> {
  try {
    const [result] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.username, username))
      .limit(1);

    return { data: result ?? null, error: null };
  } catch (error) {
    return { data: null, error: toAuthenticationError(error) };
  }
}

export async function signInAuthenticationUser(
  input: AuthenticationSignInInput
): Promise<AuthenticationSignInRepositoryResult> {
  try {
    const data = await auth.api.signInEmail({ body: input });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toAuthenticationError(error) };
  }
}

export async function signUpAuthenticationUser(
  input: AuthenticationSignUpRepositoryInput
): Promise<AuthenticationSignUpRepositoryResult> {
  try {
    const data = await auth.api.signUpEmail({ body: input });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toAuthenticationError(error) };
  }
}
