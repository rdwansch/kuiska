"use client";

import { Button } from "~/components/ui/button";
import { cn } from "~/utils/cn";
import type { SocialTriviaSnapshot } from "../types/SocialTriviaType";

type RaceSnapshot = Extract<SocialTriviaSnapshot, { status: "race" }>;

export function SocialTriviaRaceBoard({
  snapshot,
  error,
  isPending,
  onSubmit,
}: {
  snapshot: RaceSnapshot;
  error: string | null;
  isPending: boolean;
  onSubmit: (questionId: string, optionId: string) => void;
}) {
  if (snapshot.isComplete) {
    return (
      <main className="bg-blue-ink min-h-screen text-white">
        <div className="page-shell flex min-h-screen max-w-[48rem] items-center py-12">
          <section>
            <h1 className="text-4xl leading-[1.05] font-bold tracking-[-0.035em] sm:text-6xl">
              Kamu sudah sampai garis akhir.
            </h1>
            <p className="text-info-on-ink mt-3 text-sm font-semibold">
              Self-paced race selesai untukmu
            </p>
            <p className="text-info-on-ink mt-4 max-w-[48ch] text-lg leading-8">
              Posisi sementaramu: peringkat {snapshot.provisionalRank ?? "—"}. Hasil final muncul
              saat lawan selesai atau batas waktu berakhir.
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (!snapshot.question) return null;

  return (
    <main className="bg-blue-ink min-h-screen overflow-x-hidden py-6 text-white sm:py-10">
      <div className="page-shell flex min-h-[calc(100dvh-5rem)] max-w-[48rem] items-center py-10 sm:py-16">
        <section className="w-full">
          <h1 className="max-w-[28ch] text-3xl leading-[1.12] font-bold tracking-[-0.03em] text-balance sm:text-5xl">
            {snapshot.question.content}
          </h1>
          <p className="text-info-on-ink mt-5 text-sm font-semibold">
            Soal {snapshot.question.position} dari {snapshot.room.questionCount} ·{" "}
            {snapshot.progress} selesai
          </p>
          <div className="mt-8 grid gap-3" aria-label="Pilihan jawaban">
            {snapshot.question.options.map((option, index) => (
              <Button
                key={option.id}
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={() => onSubmit(snapshot.question!.id, option.id)}
                className={cn(
                  "min-h-16 w-full justify-start gap-3 rounded-[var(--radius-control)] border border-white/25 bg-white/8 px-4 py-3 text-left text-base font-semibold whitespace-normal text-white hover:border-white/60 hover:bg-white/14"
                )}
              >
                <span className="tabular-data text-info-on-ink w-5 shrink-0 text-sm font-bold">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option.content}</span>
              </Button>
            ))}
          </div>
          <p className="text-info-on-ink mt-7 text-sm leading-6">
            Jawaban akan diperiksa oleh server. Hasil akhir membandingkan skor dulu, lalu waktu.
          </p>
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
