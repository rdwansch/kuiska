"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function AuthenticationSignUp() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Join your class — make quizzes, play together, and track your scores.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="signup-username">Username</Label>
              <Input id="signup-username" type="text" placeholder="kuiska99" autoComplete="username" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-name">Display name</Label>
              <Input id="signup-name" type="text" placeholder="Jane Doe" autoComplete="name" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input id="signup-email" type="email" placeholder="you@school.edu" autoComplete="email" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input id="signup-password" type="password" placeholder="At least 8 characters" autoComplete="new-password" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-confirm">Confirm password</Label>
            <Input id="signup-confirm" type="password" placeholder="Repeat your password" autoComplete="new-password" required />
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Private quizzes need a secret code. Your teacher will share it with you.
          </p>

          <Button type="submit" className="w-full">
            Create account
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="font-medium text-primary hover:text-primary/80 underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
