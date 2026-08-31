"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { createSocialTriviaRoomAction } from "../services/SocialTriviaService";
import type { SocialTriviaMode } from "../types/SocialTriviaType";

export function SocialTriviaRoomCreator({ quizId }: { quizId: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<SocialTriviaMode>("live_trivia");
  const [secretCode, setSecretCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const createRoom = () => {
    startTransition(async () => {
      const result = await createSocialTriviaRoomAction({
        quizId,
        mode,
        secretCode: secretCode || undefined,
      });
      if (result.status === "error" || !result.roomUrl) {
        setError(result.status === "error" ? result.error : "Room belum bisa dibuat.");
        return;
      }
      router.push(result.roomUrl);
    });
  };

  return (
    <section
      id="challenge"
      className="border-border bg-surface-blue mt-10 max-w-[46rem] rounded-[1rem_3rem_1rem_1.75rem] p-5 sm:p-7"
    >
      <h2 className="text-2xl font-bold tracking-[-0.02em]">Tantang satu teman.</h2>
      <p className="text-muted-foreground mt-2 max-w-[56ch] leading-7">
        Pilih mode, buat room, lalu bagikan tautannya.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        {(
          [
            ["live_trivia", "Live trivia"],
            ["self_paced_race", "Self-paced race"],
          ] as const
        ).map(([value, label]) => (
          <Button
            key={value}
            type="button"
            variant={mode === value ? "default" : "outline"}
            onClick={() => setMode(value)}
            disabled={isPending}
          >
            {label}
          </Button>
        ))}
      </div>
      <div className="mt-5 max-w-sm space-y-2">
        <Label htmlFor="room-creator-secret">Kode rahasia jika kuis ini privat</Label>
        <Input
          id="room-creator-secret"
          value={secretCode}
          onChange={(event) => setSecretCode(event.target.value)}
          minLength={4}
          maxLength={64}
        />
      </div>
      <Button type="button" className="mt-5" onClick={createRoom} disabled={isPending}>
        {isPending ? "Membuat room…" : "Buat room"}
      </Button>
      {error ? (
        <p className="text-destructive mt-3 text-sm font-semibold" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
