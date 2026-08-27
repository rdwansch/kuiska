"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function AuthenticationSignIn() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to continue your quizzes. Your progress will be waiting.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <Label htmlFor="signin-email">Email</Label>
            <Input id="signin-email" type="email" placeholder="you@school.edu" autoComplete="email" required />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="signin-password">Password</Label>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4">
                Forgot password?
              </Link>
            </div>
            <Input id="signin-password" type="password" placeholder="Enter your password" autoComplete="current-password" required />
          </div>

          <Button type="submit" className="w-full">
            Sign in
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:text-primary/80 underline underline-offset-4">
              Create account
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
