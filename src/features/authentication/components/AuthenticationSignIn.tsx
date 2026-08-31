"use client";

import Link from "next/link";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useAuthenticationHook } from "../hooks/AuthenticationHook";

export function AuthenticationSignIn() {
  const { formInput, updateField, isInvalid, handleSubmit } = useAuthenticationHook();

  return (
    <Card className="border-0 bg-transparent shadow-none">
      <CardHeader className="mb-8 space-y-3 p-0">
        <h1 className="font-display text-4xl leading-[1.08] font-bold tracking-[-0.025em] text-balance sm:text-5xl">
          Masuk untuk melanjutkan permainan.
        </h1>
        <CardDescription className="max-w-md text-[15px] leading-6">
          Challenge dan hasil duelmu tersimpan di akun yang sama.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {formInput.error ? (
          <Badge className="mb-5 w-full" role="alert">
            {formInput.error}
          </Badge>
        ) : null}

        <form className="space-y-5" onSubmit={(event) => handleSubmit(event, "signin")}>
          <div className="space-y-2.5">
            <Label htmlFor="signin-email" required>
              Email
            </Label>
            <Input
              id="signin-email"
              name="email"
              type="email"
              placeholder="nama@email.com"
              autoComplete="email"
              autoFocus
              required
              value={formInput.email}
              onChange={(event) => updateField("email", event.target.value)}
              invalid={isInvalid("email")}
              aria-invalid={isInvalid("email")}
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="signin-password" required>
              Kata sandi
            </Label>
            <Input
              id="signin-password"
              name="password"
              type="password"
              placeholder="Masukkan kata sandi"
              autoComplete="current-password"
              required
              value={formInput.password}
              onChange={(event) => updateField("password", event.target.value)}
              invalid={isInvalid("password")}
              aria-invalid={isInvalid("password")}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={formInput.status === "pending"}
          >
            {formInput.status === "pending" ? "Memeriksa akun…" : "Masuk"}
          </Button>

          <p className="text-muted-foreground pt-1 text-center text-sm">
            Belum punya akun?{" "}
            <Link
              href="/signup"
              className="text-primary decoration-primary/25 font-bold underline underline-offset-4 hover:text-[var(--primary-hover)]"
            >
              Buat akun
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
