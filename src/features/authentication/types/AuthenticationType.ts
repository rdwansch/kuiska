import type { auth } from "~/lib/auth";

type AuthenticationApi = typeof auth.api;

export type AuthenticationSignInInput = {
  email: string;
  password: string;
};

export type AuthenticationSignUpInput = {
  username: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type AuthenticationSignUpRepositoryInput = Omit<
  AuthenticationSignUpInput,
  "confirmPassword"
> & {
  displayUsername: string;
};

export type AuthenticationField =
  "username" | "name" | "email" | "password" | "confirmPassword" | "token" | "general";

export type AuthenticationSignInData = Awaited<ReturnType<AuthenticationApi["signInEmail"]>>;

export type AuthenticationSignUpData = Awaited<ReturnType<AuthenticationApi["signUpEmail"]>>;

export type AuthenticationUsernameResult = {
  data: { id: string } | null;
  error: Error | null;
};

export type AuthenticationSignInRepositoryResult = {
  data: AuthenticationSignInData | null;
  error: Error | null;
};

export type AuthenticationSignUpRepositoryResult = {
  data: AuthenticationSignUpData | null;
  error: Error | null;
};

type AuthenticationResultFields = {
  error: string | null;
  fields: AuthenticationField[];
};

export type AuthenticationSignInResult = AuthenticationResultFields & {
  data: AuthenticationSignInData | null;
};

export type AuthenticationSignUpResult = AuthenticationResultFields & {
  data: AuthenticationSignUpData | null;
};

export type AuthenticationActionResult = AuthenticationSignInResult | AuthenticationSignUpResult;

export type AuthenticationFormInput = {
  username: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  error: string | null;
  errorFields: AuthenticationField[] | null;
  status: "idle" | "pending" | "success" | "error";
};
