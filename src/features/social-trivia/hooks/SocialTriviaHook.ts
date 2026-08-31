"use client";

import { useCallback, useEffect, useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import {
  createSocialTriviaRoomAction,
  joinSocialTriviaRoomAction,
  startSocialTriviaRoomAction,
  submitSocialTriviaAnswerAction,
} from "../services/SocialTriviaService";
import type { SocialTriviaSnapshot } from "../types/SocialTriviaType";

async function fetchSnapshot(inviteCode: string, secretCode?: string) {
  const response = await fetch(`/api/rooms/${inviteCode}`, {
    cache: "no-store",
    headers: secretCode ? { "x-kuiska-room-code": secretCode } : undefined,
  });

  if (!response.ok) throw new Error("Room belum bisa dimuat.");
  return (await response.json()) as SocialTriviaSnapshot;
}

function getInviteCode(snapshot: SocialTriviaSnapshot) {
  if ("inviteCode" in snapshot) return snapshot.inviteCode;
  if ("room" in snapshot) return snapshot.room.inviteCode;
  return "";
}

export function useSocialTriviaHook(initialState: SocialTriviaSnapshot) {
  const router = useRouter();
  const inviteCode = getInviteCode(initialState);
  const [snapshot, setSnapshot] = useState(initialState);
  const [secretCode, setSecretCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const refresh = useCallback(
    async (nextSecretCode = secretCode) => {
      if (!inviteCode) return;
      try {
        const nextSnapshot = await fetchSnapshot(inviteCode, nextSecretCode || undefined);
        setSnapshot(nextSnapshot);
        setError(null);
      } catch (refreshError) {
        setError(refreshError instanceof Error ? refreshError.message : "Room belum bisa dimuat.");
      }
    },
    [inviteCode, secretCode]
  );

  useEffect(() => {
    const pollDelay =
      snapshot.status === "live"
        ? 1_000
        : snapshot.status === "lobby" || snapshot.status === "race"
          ? 2_000
          : null;
    if (!pollDelay) return;

    const timer = window.setInterval(() => void refresh(), pollDelay);
    return () => window.clearInterval(timer);
  }, [refresh, snapshot.status]);

  const unlock = (submittedSecretCode: string) => {
    setSecretCode(submittedSecretCode);
    void refresh(submittedSecretCode);
  };

  const join = () => {
    startTransition(async () => {
      const result = await joinSocialTriviaRoomAction({
        inviteCode,
        secretCode: secretCode || undefined,
      });
      if (result.status === "error") {
        setError(result.error);
        return;
      }
      await refresh();
    });
  };

  const start = () => {
    startTransition(async () => {
      const result = await startSocialTriviaRoomAction({
        inviteCode,
        secretCode: secretCode || undefined,
      });
      if (result.status === "error") {
        setError(result.error);
        return;
      }
      await refresh();
    });
  };

  const submitAnswer = (questionId: string, optionId: string) => {
    startTransition(async () => {
      const result = await submitSocialTriviaAnswerAction({
        inviteCode,
        questionId,
        optionId,
        secretCode: secretCode || undefined,
      });
      if (result.status === "error") {
        setError(result.error);
        await refresh();
        return;
      }
      await refresh();
    });
  };

  const rematch = () => {
    if (snapshot.status !== "completed") return;

    startTransition(async () => {
      const result = await createSocialTriviaRoomAction({
        quizId: snapshot.room.quizId,
        mode: snapshot.room.mode,
        secretCode: secretCode || undefined,
      });
      if (result.status === "error" || !result.roomUrl) {
        setError(result.status === "error" ? result.error : "Room belum bisa dibuat.");
        return;
      }
      router.push(result.roomUrl);
    });
  };

  return {
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
  };
}
