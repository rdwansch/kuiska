"use client";

import { useState, useTransition } from "react";
import { signIn, signUp } from "../services/AuthenticationService";
import type {
  AuthenticationActionResult,
  AuthenticationField,
  AuthenticationFormInput,
} from "../types/AuthenticationType";

export function useAuthenticationHook() {
  const [formInput, setFormInput] = useState<AuthenticationFormInput>(() => ({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    error: null,
    errorFields: null,
    status: "idle",
  }));
  const [, startTransition] = useTransition();

  const isInvalid = (field: AuthenticationField) => {
    if (formInput.status !== "error" || !formInput.errorFields) return false;
    if (formInput.errorFields.includes(field)) return true;
    if (formInput.errorFields.includes("general")) return true;
    return false;
  };

  const updateField = (
    field: keyof Pick<
      AuthenticationFormInput,
      "username" | "name" | "email" | "password" | "confirmPassword"
    >,
    value: string
  ) => {
    setFormInput((prev) => ({ ...prev, [field]: value }));
  };

  const clearError = () => {
    setFormInput((prev) => ({ ...prev, error: null, errorFields: null, status: "idle" }));
  };

  const setErrorFromResult = (result: AuthenticationActionResult | null | undefined) => {
    if (result?.error) {
      const fields = result.fields ?? ["general"];
      setFormInput((prev) => ({
        ...prev,
        error: result.error!,
        errorFields: fields,
        status: "error",
      }));
      return true;
    }
    setFormInput((prev) => ({ ...prev, error: null, errorFields: null, status: "idle" }));
    return false;
  };

  const handleSubmit = (e: React.FormEvent, action: "signin" | "signup") => {
    e.preventDefault();
    setFormInput((prev) => ({ ...prev, error: null, errorFields: null, status: "pending" }));
    startTransition(async () => {
      let result: AuthenticationActionResult | null = null;
      if (action === "signin") {
        result = await signIn({ email: formInput.email, password: formInput.password });
      } else if (action === "signup") {
        result = await signUp({
          username: formInput.username,
          name: formInput.name,
          email: formInput.email,
          password: formInput.password,
          confirmPassword: formInput.confirmPassword,
        });
      }
      if (result?.error) {
        const fields = result.fields ?? ["general"];
        setFormInput((prev) => ({
          ...prev,
          error: result!.error!,
          errorFields: fields,
          status: "error",
        }));
      } else {
        setFormInput((prev) => ({ ...prev, error: null, errorFields: null, status: "idle" }));
      }
    });
  };

  return {
    formInput,
    updateField,
    setFormInput,
    isInvalid,
    handleSubmit,
    clearError,
    setErrorFromResult,
  };
}
