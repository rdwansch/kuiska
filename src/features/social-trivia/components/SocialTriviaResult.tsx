"use client";

import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import type { SocialTriviaSnapshot } from "../types/SocialTriviaType";

type ResultSnapshot = Extract<SocialTriviaSnapshot, { status: "completed" }>;

function formatDuration(milliseconds: number) {
  const totalSeconds = Math.round(milliseconds / 1_000);
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes}:${String(totalSeconds % 60).padStart(2, "0")}`;
}

export function SocialTriviaResult({
  snapshot,
  error,
  isPending,
  onRematch,
}: {
  snapshot: ResultSnapshot;
  error: string | null;
  isPending: boolean;
  onRematch: () => void;
}) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const winner = snapshot.results[0];

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(
        new URL(`/rooms/${snapshot.room.inviteCode}`, window.location.origin).toString()
      );
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  };

  return (
    <main className="bg-blue-ink min-h-screen overflow-x-hidden py-6 text-white sm:py-10">
      <div className="page-shell relative flex min-h-[calc(100dvh-5rem)] max-w-[52rem] items-center py-10 sm:py-16">
        <svg
          aria-hidden="true"
          className="text-success pointer-events-none absolute top-1/2 left-1/2 h-[34rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 opacity-45"
          viewBox="0 0 700 560"
          fill="none"
        >
          <path
            d="M-12 380C119 319 143 95 305 201C449 296 432 472 712 117"
            stroke="currentColor"
            strokeWidth="4"
          />
          <circle cx="305" cy="201" r="18" fill="currentColor" />
        </svg>
        <section className="relative w-full">
          <h1 className="text-4xl leading-[1.05] font-bold tracking-[-0.035em] text-balance sm:text-6xl">
            {winner.name} menang di {snapshot.room.title}.
          </h1>
          <p className="text-success mt-3 text-sm font-semibold">Hasil duel</p>
          <p className="text-info-on-ink mt-4 max-w-[54ch] text-lg leading-8">
            Skor menentukan posisi. Waktu menjadi penentu saat jumlah jawaban benar sama.
          </p>

          <div className="mt-10 divide-y divide-white/15 rounded-[1rem_3rem_1rem_1.75rem] bg-white/10 px-6 sm:px-8">
            {snapshot.results.map((result) => (
              <div
                key={result.id}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-5 sm:gap-7"
              >
                <p className="tabular-data text-success text-2xl font-bold">#{result.rank}</p>
                <div>
                  <p className="font-bold">{result.name}</p>
                  <p className="text-info-on-ink text-sm">@{result.username}</p>
                </div>
                <div className="text-right">
                  <p className="tabular-data text-xl font-bold">{result.correctAnswers} benar</p>
                  <p className="tabular-data text-info-on-ink text-sm">
                    {formatDuration(result.totalAnswerDurationMs)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={onRematch} disabled={isPending}>
              <Icon name="lucide:rotate-ccw" aria-hidden="true" className="size-4" />
              {isPending ? "Membuat room…" : "Main lagi"}
            </Button>
            <Button
              variant="outline"
              onClick={copyInvite}
              className="border-white/30 bg-white/5 text-white hover:bg-white/10"
            >
              <Icon name="lucide:share-2" aria-hidden="true" className="size-4" />
              {copyState === "copied" ? "Tautan tersalin" : "Bagikan hasil"}
            </Button>
          </div>
          {copyState === "error" ? (
            <p className="text-destructive mt-4 text-sm font-semibold" role="status">
              Hasil belum bisa disalin. Salin tautan dari bilah alamat.
            </p>
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
