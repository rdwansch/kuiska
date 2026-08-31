"use client";

import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import type { SocialTriviaSnapshot } from "../types/SocialTriviaType";

type LobbySnapshot = Extract<SocialTriviaSnapshot, { status: "join" | "full" | "lobby" }>;

function PlayerMark({ name, index }: { name: string; index: number }) {
  return (
    <span
      className={`grid size-11 shrink-0 place-items-center text-sm font-bold ${
        index === 0
          ? "bg-primary text-primary-foreground rounded-[48%_52%_43%_57%/54%_42%_58%_46%]"
          : "bg-lilac text-accent-foreground rounded-[52%_48%_57%_43%/42%_58%_46%_54%]"
      }`}
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

export function SocialTriviaLobby({
  snapshot,
  error,
  isPending,
  onJoin,
  onStart,
}: {
  snapshot: LobbySnapshot;
  error: string | null;
  isPending: boolean;
  onJoin: () => void;
  onStart: () => void;
}) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const { room } = snapshot;
  const creator = room.players[0];

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(
        new URL(`/rooms/${room.inviteCode}`, window.location.origin).toString()
      );
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  };

  const roomMode = room.mode === "live_trivia" ? "Live trivia" : "Self-paced race";

  return (
    <main className="bg-blue-ink min-h-screen overflow-x-hidden py-6 text-white sm:py-10">
      <div className="page-shell relative flex min-h-[calc(100dvh-5rem)] max-w-[52rem] items-center py-10 sm:py-16">
        <svg
          aria-hidden="true"
          className="text-info-on-ink pointer-events-none absolute top-[7%] left-[-26%] h-[85%] w-[135%] opacity-60"
          viewBox="0 0 800 820"
          fill="none"
        >
          <path
            d="M-34 553C154 526 126 286 314 324C467 354 435 633 624 577C697 555 689 294 836 194"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        <section className="relative w-full">
          <h1 className="max-w-[18ch] text-4xl leading-[1.05] font-bold tracking-[-0.035em] text-balance sm:text-6xl">
            {room.title}
          </h1>
          <p className="text-info-on-ink mt-3 text-sm font-semibold">{roomMode}</p>
          <p className="text-info-on-ink mt-4 max-w-[54ch] text-lg leading-8">{room.description}</p>

          <div className="mt-10 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            {room.players.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center gap-3 ${index === 1 ? "sm:flex-row-reverse sm:text-right" : ""}`}
              >
                <PlayerMark name={player.name} index={index} />
                <div>
                  <p className="font-bold">{player.name}</p>
                  <p className="text-info-on-ink text-sm">@{player.username}</p>
                </div>
              </div>
            ))}
            {room.players.length < 2 ? (
              <div
                className="bg-info-on-ink/35 hidden size-2 rounded-full sm:block"
                aria-hidden="true"
              />
            ) : null}
          </div>

          <div className="mt-10 rounded-[1rem_3rem_1rem_1.75rem] bg-white/10 p-6 sm:p-8">
            {snapshot.status === "join" ? (
              <>
                <h2 className="text-2xl font-bold tracking-[-0.02em]">
                  {creator.name} menunggumu.
                </h2>
                <p className="text-info-on-ink mt-3 max-w-[48ch] leading-7">
                  Masuk sebagai pemain kedua. Pembuat room akan memulai saat kalian berdua siap.
                </p>
                <Button className="mt-6" onClick={onJoin} disabled={isPending}>
                  {isPending ? "Bergabung…" : "Gabung room"}
                </Button>
              </>
            ) : snapshot.status === "full" ? (
              <>
                <h2 className="text-2xl font-bold tracking-[-0.02em]">Room ini sudah penuh.</h2>
                <p className="text-info-on-ink mt-3 leading-7">
                  Duel Kuiska hanya untuk dua pemain.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold tracking-[-0.02em]">
                  {snapshot.canStart ? "Duel siap dimulai." : "Tautan tantanganmu sudah siap."}
                </h2>
                <p className="text-info-on-ink mt-3 max-w-[48ch] leading-7">
                  {snapshot.canStart
                    ? "Tekan mulai saat kalian siap. Skor tetap tersembunyi sampai akhir."
                    : "Bagikan tautan atau kode room ini ke satu teman."}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {snapshot.canStart ? (
                    <Button onClick={onStart} disabled={isPending}>
                      {isPending ? "Memulai…" : "Mulai duel"}
                    </Button>
                  ) : null}
                  <Button
                    variant="outline"
                    onClick={copyInvite}
                    className="border-white/30 bg-white/5 text-white hover:bg-white/10"
                  >
                    <Icon name="lucide:copy" aria-hidden="true" className="size-4" />
                    {copyState === "copied" ? "Tautan tersalin" : "Salin tautan"}
                  </Button>
                </div>
                <p className="tabular-data text-info-on-ink mt-5 text-sm font-bold">
                  Kode room: {room.inviteCode}
                </p>
                {copyState === "error" ? (
                  <p className="mt-3 text-sm text-white" role="status">
                    Tautan belum bisa disalin. Salin kode room di atas.
                  </p>
                ) : null}
              </>
            )}
            {error ? (
              <p className="text-destructive mt-5 text-sm font-semibold" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
