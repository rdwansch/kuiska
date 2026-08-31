import Link from "next/link";

import type { QuizTakingResultData } from "../types/QuizTakingType";

export function QuizTakingResult({ result }: { result: QuizTakingResultData }) {
  const scoreLabel = `${result.score}%`;

  return (
    <main className="bg-background min-h-screen overflow-x-hidden py-6 sm:py-10">
      <div className="page-shell relative flex min-h-[calc(100dvh-5rem)] max-w-[48rem] items-center py-12 sm:py-20">
        <svg
          aria-hidden="true"
          className="text-info pointer-events-none absolute top-[8%] left-[-20%] h-[78%] w-[120%] opacity-60"
          viewBox="0 0 800 820"
          fill="none"
        >
          <path
            d="M-24 532C109 523 165 297 302 324C428 348 422 560 538 549C654 538 649 288 829 201"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="302" cy="324" r="26" fill="var(--primary)" />
          <circle cx="538" cy="549" r="26" fill="var(--jade)" />
        </svg>

        <section className="relative w-full">
          <h1 className="font-display text-4xl leading-[1.02] font-bold tracking-[-0.035em] sm:text-6xl">
            Hasilmu sudah terkunci.
          </h1>
          <p className="text-success mt-5 flex items-center gap-2 text-base font-bold">
            <span className="bg-success inline-block size-2.5 rounded-full" aria-hidden="true" />
            Kuis selesai
          </p>

          <div className="border-border bg-surface-strong mt-10 grid gap-8 rounded-[1.25rem_4.5rem_1.5rem_3rem] border p-7 shadow-[var(--shadow-raised)] sm:grid-cols-[1.2fr_0.8fr] sm:p-10">
            <div>
              <p className="text-muted-foreground text-base">Jawaban benar</p>
              <p className="tabular-data mt-3 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
                {result.correctAnswers} dari {result.totalQuestions}
              </p>
            </div>
            <div className="border-border border-t pt-7 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8">
              <p className="text-muted-foreground text-base">Skor</p>
              <p className="tabular-data text-success mt-3 text-5xl font-bold tracking-[-0.04em] sm:text-6xl">
                {scoreLabel}
              </p>
            </div>
          </div>

          {result.isAuthenticated ? (
            <p className="text-muted-foreground mt-7 max-w-[52ch] text-base leading-7">
              Hasil ini sudah tersimpan di akunmu.
            </p>
          ) : (
            <div className="border-border mt-8 max-w-[42rem] border-t pt-7">
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em]">
                Simpan hasilmu untuk permainan berikutnya.
              </h2>
              <p className="text-muted-foreground mt-3 max-w-[54ch] leading-7">
                Masuk atau buat akun agar hasil kuis berikutnya tersimpan di Kuiska.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/signin" className="button-link button-link-primary">
                  Masuk
                </Link>
                <Link href="/signup" className="button-link button-link-secondary">
                  Buat akun
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
