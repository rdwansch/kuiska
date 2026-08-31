import Link from "next/link";

import { Icon } from "~/components/ui/icon";
import type { DashboardAttempt, DashboardPage } from "../types/DashboardType";

function pageHref(quizPage: number, attemptPage: number) {
  return `/me?quizPage=${quizPage}&attemptPage=${attemptPage}`;
}

export function DashboardHistory({
  attempts,
  quizPage,
}: {
  attempts: DashboardPage<DashboardAttempt>;
  quizPage: number;
}) {
  return (
    <section className="border-border mt-16 border-t pt-12" aria-labelledby="history-heading">
      <h2 id="history-heading" className="text-3xl font-bold tracking-[-0.035em]">
        Riwayat main
      </h2>
      <p className="text-muted-foreground mt-2 leading-7">Hasil kuis yang sudah kamu selesaikan.</p>

      {attempts.items.length === 0 ? (
        <div className="bg-surface-blue mt-7 rounded-[1rem_3rem_1rem_1.75rem] p-7">
          <p className="text-lg font-bold">Belum ada permainan selesai.</p>
          <Link
            href="/explore"
            className="text-primary mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-bold"
          >
            Cari kuis untuk dimainkan
            <Icon name="lucide:arrow-right" aria-hidden="true" className="size-4" />
          </Link>
        </div>
      ) : (
        <div className="divide-border border-border mt-7 divide-y border-y">
          {attempts.items.map((attempt) => (
            <article key={attempt.id} className="flex items-center justify-between gap-5 py-6">
              <div>
                <Link
                  href={`/quizzes/${attempt.quizId}`}
                  className="hover:text-primary text-xl font-bold tracking-[-0.02em] transition-colors"
                >
                  {attempt.quizTitle}
                </Link>
                <p className="text-muted-foreground mt-2 text-sm font-semibold">
                  {formatDate(attempt.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="tabular-data text-2xl font-extrabold tracking-[-0.03em]">
                  {attempt.score}
                </p>
                <p className="text-muted-foreground mt-1 text-sm font-semibold">
                  {attempt.correctAnswers}/{attempt.totalQuestions} benar
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      <nav
        className="mt-6 flex items-center justify-between gap-4"
        aria-label="Halaman riwayat main"
      >
        {attempts.page > 1 ? (
          <Link
            href={pageHref(quizPage, attempts.page - 1)}
            className="text-primary inline-flex min-h-11 items-center gap-2 text-sm font-bold"
          >
            <Icon name="lucide:arrow-left" aria-hidden="true" className="size-4" />
            Sebelumnya
          </Link>
        ) : (
          <span />
        )}
        {attempts.hasNext ? (
          <Link
            href={pageHref(quizPage, attempts.page + 1)}
            className="text-primary inline-flex min-h-11 items-center gap-2 text-sm font-bold"
          >
            Berikutnya
            <Icon name="lucide:arrow-right" aria-hidden="true" className="size-4" />
          </Link>
        ) : null}
      </nav>
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
