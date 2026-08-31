"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import { requestPublicDiscoveryReview } from "../services/PublicDiscoveryService";
import type { PublicDiscoveryReviewStatus as ReviewStatus } from "../types/PublicDiscoveryType";

const reviewCopy: Record<ReviewStatus, { label: string; className: string }> = {
  not_requested: { label: "Belum diajukan", className: "bg-surface-neutral text-muted-foreground" },
  pending: { label: "Menunggu review", className: "bg-warning-muted text-warning" },
  approved: { label: "Tampil di Explore", className: "bg-success-muted text-success" },
  rejected: { label: "Belum lolos review", className: "bg-incorrect-muted text-destructive" },
};

export function PublicDiscoveryReviewStatus({
  quizId,
  visibility,
  reviewStatus,
  reviewNote,
}: {
  quizId: string;
  visibility: "public" | "private";
  reviewStatus: ReviewStatus;
  reviewNote: string | null;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const copy = reviewCopy[reviewStatus];

  const requestReview = () => {
    startTransition(async () => {
      const result = await requestPublicDiscoveryReview({ quizId });
      if (result.status === "error") {
        setError(result.error);
        return;
      }
      setError(null);
      router.refresh();
    });
  };

  return (
    <div className="mt-4">
      <span
        className={`${copy.className} inline-flex rounded-[var(--radius-label)] px-2.5 py-1 text-sm font-bold`}
      >
        {visibility === "private" ? "Kuis privat" : copy.label}
      </span>
      {visibility === "public" && reviewStatus === "not_requested" ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={requestReview}
          disabled={isPending}
          className="text-primary hover:bg-surface-berry ml-2 min-h-9 px-2.5"
        >
          {isPending ? "Mengajukan…" : "Ajukan ke Explore"}
        </Button>
      ) : null}
      {reviewStatus === "rejected" && reviewNote ? (
        <p className="text-muted-foreground mt-2 text-sm leading-6">{reviewNote}</p>
      ) : null}
      {error ? (
        <p className="text-destructive mt-2 text-sm font-semibold" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
