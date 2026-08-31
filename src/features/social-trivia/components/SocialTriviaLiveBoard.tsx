"use client";

import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { cn } from "~/utils/cn";
import type { SocialTriviaSnapshot } from "../types/SocialTriviaType";

type LiveSnapshot = Extract<SocialTriviaSnapshot, { status: "live" }>;

function formatRemainingTime(endsAt: string, now: number) {
  const seconds = Math.ceil(Math.max(0, new Date(endsAt).getTime() - now) / 1000);
  return `00:${String(seconds).padStart(2, "0")}`;
}

export function SocialTriviaLiveBoard({
  snapshot,
  error,
  isPending,
  onSubmit,
}: {
  snapshot: LiveSnapshot;
  error: string | null;
  isPending: boolean;
  onSubmit: (questionId: string, optionId: string) => void;
}) {
  const [now, setNow] = useState(() => Date.now());
  const isRevealing = snapshot.phase === "revealing";
  const remainingTime = formatRemainingTime(snapshot.questionEndsAt, now);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="bg-blue-ink min-h-screen overflow-x-hidden py-6 text-white sm:py-10">
      <div className="page-shell relative flex min-h-[calc(100dvh-5rem)] max-w-[58rem] items-center py-8 sm:py-14">
        <svg
          aria-hidden="true"
          className="text-info-on-ink pointer-events-none absolute top-1/2 left-1/2 h-[42rem] w-[72rem] -translate-x-1/2 -translate-y-1/2 opacity-50"
          viewBox="0 0 1200 700"
          fill="none"
        >
          <path
            d="M-24 392C210 212 324 552 590 350C801 189 930 472 1224 234"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>

        <section className="relative mx-auto w-full max-w-[44rem]">
          <h1 className="max-w-[28ch] text-3xl leading-[1.12] font-bold tracking-[-0.03em] text-balance sm:text-5xl">
            {snapshot.question.content}
          </h1>

          <header className="mt-5 flex items-center justify-between gap-4">
            <p className="text-info-on-ink text-sm font-semibold">
              Soal {snapshot.question.position} dari {snapshot.room.questionCount}
            </p>
            <p className="tabular-data rounded-[var(--radius-label)] bg-white/10 px-3 py-1.5 text-lg font-bold">
              {isRevealing ? "Hasil" : remainingTime}
            </p>
          </header>

          <div className="mt-7 flex items-center justify-between gap-4">
            {snapshot.room.players.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center gap-2.5 ${index === 1 ? "flex-row-reverse text-right" : ""}`}
              >
                <span
                  className={`grid size-10 place-items-center text-sm font-bold ${
                    index === 0
                      ? "bg-primary text-primary-foreground rounded-[48%_52%_43%_57%/54%_42%_58%_46%]"
                      : "bg-lilac text-accent-foreground rounded-[52%_48%_57%_43%/42%_58%_46%_54%]"
                  }`}
                >
                  {player.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="text-sm font-bold">{player.name}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-3" aria-label="Pilihan jawaban">
            {snapshot.question.options.map((option, index) => {
              const isSelected = snapshot.selectedOptionId === option.id;
              const isCorrect = isRevealing && snapshot.correctOptionId === option.id;
              const isIncorrect = isRevealing && isSelected && !isCorrect;

              return (
                <Button
                  key={option.id}
                  type="button"
                  variant="ghost"
                  disabled={snapshot.phase !== "answering" || isPending}
                  onClick={() => onSubmit(snapshot.question.id, option.id)}
                  className={cn(
                    "min-h-16 w-full justify-start gap-3 rounded-[var(--radius-control)] border px-4 py-3 text-left text-base font-semibold whitespace-normal disabled:cursor-default disabled:opacity-100",
                    !isSelected &&
                      !isRevealing &&
                      "border-white/25 bg-white/8 text-white hover:border-white/60 hover:bg-white/14",
                    isSelected &&
                      !isRevealing &&
                      "border-primary bg-primary/20 border-2 text-white",
                    isCorrect && "border-success bg-success-muted text-foreground border-2",
                    isIncorrect && "border-destructive bg-incorrect-muted text-foreground border-2",
                    isRevealing &&
                      !isCorrect &&
                      !isIncorrect &&
                      "border-white/15 bg-white/5 text-white"
                  )}
                >
                  <span className="tabular-data text-info-on-ink w-5 shrink-0 text-sm font-bold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option.content}</span>
                  {isCorrect ? (
                    <Icon
                      name="lucide:check"
                      aria-label="Jawaban benar"
                      className="text-success size-5"
                    />
                  ) : null}
                  {isIncorrect ? (
                    <Icon
                      name="lucide:x"
                      aria-label="Jawaban salah"
                      className="text-destructive size-5"
                    />
                  ) : null}
                </Button>
              );
            })}
          </div>

          <p className="text-info-on-ink mt-7 text-sm leading-6" aria-live="polite">
            {snapshot.phase === "answering"
              ? "Pilih satu jawaban. Skor dan posisi tetap rahasia sampai duel selesai."
              : snapshot.phase === "locked"
                ? "Jawabanmu terkunci. Tunggu timer bersama berakhir."
                : "Hasil ronde terlihat untuk kalian berdua. Soal berikutnya segera dibuka."}
          </p>
          {isRevealing && snapshot.revealedAnswers ? (
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
              {snapshot.room.players.map((player) => {
                const answer = snapshot.revealedAnswers?.find(
                  (item) => item.participantId === player.id
                );
                return (
                  <p
                    key={player.id}
                    className={answer?.isCorrect ? "text-success" : "text-destructive"}
                  >
                    {player.name}:{" "}
                    {answer ? (answer.isCorrect ? "benar" : "belum tepat") : "tidak menjawab"}
                  </p>
                );
              })}
            </div>
          ) : null}
          {error ? (
            <p className="text-destructive mt-4 text-sm font-semibold" role="alert">
              {error}
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
