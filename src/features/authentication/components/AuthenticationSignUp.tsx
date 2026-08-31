"use client";

import Link from "next/link";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useAuthenticationHook } from "../hooks/AuthenticationHook";

export function AuthenticationSignUp() {
  const { formInput, updateField, isInvalid, handleSubmit } = useAuthenticationHook();

  return (
    <Card className="border-0 bg-transparent shadow-none">
      <CardHeader className="mb-7 space-y-3 p-0">
        <h1 className="font-display text-4xl leading-[1.08] font-bold tracking-[-0.025em] text-balance sm:text-5xl">
          Buat profil, lalu masuk ke room pertamamu.
        </h1>
        <CardDescription className="max-w-md text-[15px] leading-6">
          Pakai satu akun untuk menyimpan kuis dan hasil challenge.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {formInput.error ? (
          <Badge className="mb-5 w-full" role="alert">
            {formInput.error}
          </Badge>
        ) : null}

        <form className="space-y-5" onSubmit={(event) => handleSubmit(event, "signup")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2.5">
              <Label htmlFor="signup-username" required>
                Nama pengguna
              </Label>
              <Input
                id="signup-username"
                name="username"
                type="text"
                placeholder="kuiska99"
                autoComplete="username"
                autoFocus
                required
                value={formInput.username}
                onChange={(event) => updateField("username", event.target.value)}
                invalid={isInvalid("username")}
                aria-invalid={isInvalid("username")}
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="signup-name" required>
                Nama tampilan
              </Label>
              <Input
                id="signup-name"
                name="name"
                type="text"
                placeholder="Rani"
                autoComplete="name"
                required
                value={formInput.name}
                onChange={(event) => updateField("name", event.target.value)}
                invalid={isInvalid("name")}
                aria-invalid={isInvalid("name")}
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="signup-email" required>
              Email
            </Label>
            <Input
              id="signup-email"
              name="email"
              type="email"
              placeholder="nama@email.com"
              autoComplete="email"
              required
              value={formInput.email}
              onChange={(event) => updateField("email", event.target.value)}
              invalid={isInvalid("email")}
              aria-invalid={isInvalid("email")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2.5">
              <Label htmlFor="signup-password" required>
                Kata sandi
              </Label>
              <Input
                id="signup-password"
                name="password"
                type="password"
                placeholder="Minimal 8 karakter"
                autoComplete="new-password"
                required
                value={formInput.password}
                onChange={(event) => updateField("password", event.target.value)}
                invalid={isInvalid("password")}
                aria-invalid={isInvalid("password")}
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="signup-confirm" required>
                Ulangi kata sandi
              </Label>
              <Input
                id="signup-confirm"
                name="confirmPassword"
                type="password"
                placeholder="Tulis sekali lagi"
                autoComplete="new-password"
                required
                value={formInput.confirmPassword}
                onChange={(event) => updateField("confirmPassword", event.target.value)}
                invalid={isInvalid("confirmPassword")}
                aria-invalid={isInvalid("confirmPassword")}
              />
            </div>
          </div>

          <p className="text-muted-foreground text-xs leading-5">
            Nama tampilan muncul di Match Ticket dan hasil room. Kamu bisa memakai nama yang nyaman
            dilihat teman.
          </p>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={formInput.status === "pending"}
          >
            {formInput.status === "pending" ? "Membuat akun…" : "Buat akun"}
          </Button>

          <p className="text-muted-foreground pt-1 text-center text-sm">
            Sudah punya akun?{" "}
            <Link
              href="/signin"
              className="text-primary decoration-primary/25 font-bold underline underline-offset-4 hover:text-[var(--primary-hover)]"
            >
              Masuk
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
