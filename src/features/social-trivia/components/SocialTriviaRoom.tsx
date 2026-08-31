"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useSocialTriviaHook } from "../hooks/SocialTriviaHook";
import type { SocialTriviaSnapshot } from "../types/SocialTriviaType";
import { SocialTriviaLiveBoard } from "./SocialTriviaLiveBoard";
import { SocialTriviaLobby } from "./SocialTriviaLobby";
import { SocialTriviaRaceBoard } from "./SocialTriviaRaceBoard";
import { SocialTriviaResult } from "./SocialTriviaResult";

function PlainRoomState({ children }: { children: ReactNode }) {
  return (
    <main className="bg-blue-ink min-h-screen text-white">
      <div className="page-shell flex min-h-screen max-w-[42rem] items-center py-12">
        <section>{children}</section>
      </div>
    </main>
  );
}

export function SocialTriviaRoom({ initialState }: { initialState: SocialTriviaSnapshot }) {
  const {
    snapshot,
    secretCode,
    error,
    isPending,
    setSecretCode,
    unlock,
    join,
    start,
    submitAnswer,
    rematch,
  } = useSocialTriviaHook(initialState);

  if (snapshot.status === "not-found") {
    return (
      <PlainRoomState>
        <h1 className="text-4xl font-bold tracking-[-0.03em]">Room tidak ditemukan.</h1>
        <Link href="/" className="button-link button-link-secondary mt-6">
          Kembali ke Kuiska
        </Link>
      </PlainRoomState>
    );
  }

  if (snapshot.status === "unauthenticated") {
    return (
      <PlainRoomState>
        <h1 className="text-4xl leading-[1.05] font-bold tracking-[-0.03em] sm:text-5xl">
          Masuk untuk menerima tantangan ini.
        </h1>
        <p className="text-info-on-ink mt-5 max-w-[48ch] text-lg leading-8">
          Room Kuiska menyimpan hasil dan identitas dua pemain.
        </p>
        <Link href="/signin" className="button-link button-link-primary mt-7">
          Masuk
        </Link>
      </PlainRoomState>
    );
  }

  if (snapshot.status === "private") {
    return (
      <PlainRoomState>
        <h1 className="text-4xl leading-[1.05] font-bold tracking-[-0.03em] sm:text-5xl">
          Room ini memakai kode rahasia.
        </h1>
        <p className="text-info-on-ink mt-5 max-w-[48ch] text-lg leading-8">
          Masukkan kode dari pembuat kuis untuk membuka tantangan.
        </p>
        <form
          className="mt-8 max-w-sm space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            unlock(secretCode);
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="room-secret-code" className="text-white">
              Kode rahasia
            </Label>
            <Input
              id="room-secret-code"
              value={secretCode}
              onChange={(event) => setSecretCode(event.target.value)}
              minLength={4}
              maxLength={64}
              required
            />
          </div>
          <Button type="submit">Buka room</Button>
          {error ? (
            <p className="text-destructive text-sm font-semibold" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      </PlainRoomState>
    );
  }

  if (snapshot.status === "join" || snapshot.status === "lobby" || snapshot.status === "full") {
    return (
      <SocialTriviaLobby
        snapshot={snapshot}
        error={error}
        isPending={isPending}
        onJoin={join}
        onStart={start}
      />
    );
  }
  if (snapshot.status === "live") {
    return (
      <SocialTriviaLiveBoard
        snapshot={snapshot}
        error={error}
        isPending={isPending}
        onSubmit={submitAnswer}
      />
    );
  }
  if (snapshot.status === "race") {
    return (
      <SocialTriviaRaceBoard
        snapshot={snapshot}
        error={error}
        isPending={isPending}
        onSubmit={submitAnswer}
      />
    );
  }
  return (
    <SocialTriviaResult
      snapshot={snapshot}
      error={error}
      isPending={isPending}
      onRematch={rematch}
    />
  );
}
