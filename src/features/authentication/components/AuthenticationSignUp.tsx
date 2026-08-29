"use client";

import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useAuthenticationHook } from "../hooks/AuthenticationHook";

export function AuthenticationSignUp() {
  const { formInput, updateField, isInvalid, handleSubmit } = useAuthenticationHook();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create account</CardTitle>
      </CardHeader>
      <CardContent>
        {formInput.error ? (
          <Badge className="mb-5 block w-full rounded-[12px] border-red-200 bg-red-50 px-3 py-2 text-left text-red-700">
            {formInput.error}
          </Badge>
        ) : null}
        <form className="space-y-5" onSubmit={(e) => handleSubmit(e, "signup")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="signup-username" required>
                Username
              </Label>
              <Input
                id="signup-username"
                name="username"
                type="text"
                placeholder="kuiska99"
                autoComplete="username"
                required
                value={formInput.username}
                onChange={(e) => updateField("username", e.target.value)}
                invalid={isInvalid("username")}
                aria-invalid={isInvalid("username")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-name" required>
                Display name
              </Label>
              <Input
                id="signup-name"
                name="name"
                type="text"
                placeholder="Jane Doe"
                autoComplete="name"
                required
                value={formInput.name}
                onChange={(e) => updateField("name", e.target.value)}
                invalid={isInvalid("name")}
                aria-invalid={isInvalid("name")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-email" required>
              Email
            </Label>
            <Input
              id="signup-email"
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
            <Label htmlFor="signup-password" required>
              Password
            </Label>
            <Input
              id="signup-password"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              required
              value={formInput.password}
              onChange={(e) => updateField("password", e.target.value)}
              invalid={isInvalid("password")}
              aria-invalid={isInvalid("password")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-confirm" required>
              Confirm password
            </Label>
            <Input
              id="signup-confirm"
              name="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              required
              value={formInput.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              invalid={isInvalid("confirmPassword")}
              aria-invalid={isInvalid("confirmPassword")}
            />
          </div>

          <p className="text-muted-foreground text-xs leading-relaxed">
            Private quizzes need a secret code. Your teacher will share it with you.
          </p>

          <Button type="submit" className="w-full" disabled={formInput.status === "pending"}>
            {formInput.status === "pending" ? "Creating..." : "Create account"}
          </Button>

          <p className="text-muted-foreground text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
