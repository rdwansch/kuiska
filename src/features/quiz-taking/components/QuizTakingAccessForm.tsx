"use client";

import { useState } from "react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function QuizTakingAccessForm({
  quizId,
  error,
  isPending,
  onUnlock,
}: {
  quizId: string;
  error: string | null;
  isPending: boolean;
  onUnlock: (quizId: string, secretCode: string) => void;
}) {
  const [secretCode, setSecretCode] = useState("");

  return (
    <main className="bg-background min-h-screen overflow-x-hidden py-6 sm:py-10">
      <div className="page-shell relative flex min-h-[calc(100dvh-5rem)] max-w-[42rem] items-center py-12 sm:py-20">
        <svg
          aria-hidden="true"
          className="text-lilac pointer-events-none absolute top-[10%] right-[-28%] h-[70%] w-[110%] opacity-55"
          viewBox="0 0 700 760"
          fill="none"
        >
          <path
            d="M-20 512C176 412 192 98 392 159C536 203 504 482 730 263"
            stroke="currentColor"
            strokeWidth="42"
            strokeLinecap="round"
          />
          <path
            d="M33 607C174 650 287 592 374 495"
            stroke="var(--info)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        <section className="relative w-full max-w-[34rem]">
          <div className="bg-surface-lilac text-lilac mb-7 grid size-14 place-items-center rounded-[52%_48%_57%_43%/42%_58%_46%_54%]">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-6">
              <rect
                x="5"
                y="10"
                width="14"
                height="10"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M8 10V7C8 4.9 9.8 3.2 12 3.2C14.2 3.2 16 4.9 16 7V10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1 className="font-display text-4xl leading-[1.06] font-bold tracking-[-0.03em] text-balance sm:text-6xl">
            Masukkan kode rahasia untuk mulai.
          </h1>
          <p className="text-muted-foreground mt-5 max-w-[52ch] text-lg leading-8">
            Kuis ini hanya menampilkan pertanyaan setelah kodenya cocok.
          </p>

          {error ? (
            <Badge className="mt-8 w-full" role="alert">
              {error}
            </Badge>
          ) : null}

          <form
            className="mt-9 max-w-[30rem] space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              onUnlock(quizId, secretCode);
            }}
          >
            <div className="space-y-2.5">
              <Label htmlFor="quiz-access-code" required>
                Kode rahasia
              </Label>
              <Input
                id="quiz-access-code"
                type="password"
                autoComplete="off"
                value={secretCode}
                onChange={(event) => setSecretCode(event.target.value)}
                placeholder="Masukkan kode"
                minLength={4}
                maxLength={64}
                required
                disabled={isPending}
                autoFocus
              />
            </div>
            <Button type="submit" size="lg" disabled={isPending}>
              {isPending ? "Membuka kuis…" : "Buka kuis"}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}
