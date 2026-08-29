"use client";

import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useAuthenticationHook } from "../hooks/AuthenticationHook";

export function AuthenticationSignIn() {
  const { formInput, updateField, isInvalid, handleSubmit } = useAuthenticationHook();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in to continue your quizzes. Your progress will be waiting.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {formInput.error ? (
          <Badge className="mb-5 block w-full rounded-[12px] border-red-200 bg-red-50 px-3 py-2 text-left text-red-700">
            {formInput.error}
          </Badge>
        ) : null}
        <form className="space-y-5" onSubmit={(e) => handleSubmit(e, "signin")}>
          <div className="space-y-2">
            <Label htmlFor="signin-email" required>
              Email
            </Label>
            <Input
              id="signin-email"
              name="email"
              type="email"
              placeholder="you@school.edu"
              autoComplete="email"
              required
              value={formInput.email}
              onChange={(e) => updateField("email", e.target.value)}
              invalid={isInvalid("email")}
              aria-invalid={isInvalid("email")}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="signin-password" required>
                Password
              </Label>
            </div>
            <Input
              id="signin-password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              value={formInput.password}
              onChange={(e) => updateField("password", e.target.value)}
              invalid={isInvalid("password")}
              aria-invalid={isInvalid("password")}
            />
          </div>

          <Button type="submit" className="w-full" disabled={formInput.status === "pending"}>
            {formInput.status === "pending" ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-muted-foreground text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
            >
              Create account
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
