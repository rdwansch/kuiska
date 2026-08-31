import Link from "next/link";

import { Icon } from "~/components/ui/icon";
import { PublicDiscoveryReviewStatus } from "~/features/public-discovery/components/PublicDiscoveryReviewStatus";
import type { DashboardPage, DashboardQuiz } from "../types/DashboardType";

const categoryLabel = {
  technology: "Teknologi",
  general: "Pengetahuan umum",
  entertainment: "Hiburan",
};

function pageHref(quizPage: number, attemptPage: number) {
  return `/me?quizPage=${quizPage}&attemptPage=${attemptPage}`;
}

export function DashboardMyQuizzes({
  quizzes,
  attemptPage,
}: {
  quizzes: DashboardPage<DashboardQuiz>;
  attemptPage: number;
}) {
  return (
    <section className="pt-12" aria-labelledby="my-quizzes-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="my-quizzes-heading" className="text-3xl font-bold tracking-[-0.035em]">
            Kuis buatanku
          </h2>
          <p className="text-muted-foreground mt-2 leading-7">
            Kelola langkah publikasi tanpa keluar dari ritmemu.
          </p>
        </div>
        <Link href="/quizzes/new" className="button-link button-link-secondary">
          Buat kuis
          <Icon name="lucide:plus" aria-hidden="true" className="size-4" />
        </Link>
      </div>

      {quizzes.items.length === 0 ? (
        <div className="border-border bg-surface-neutral mt-7 rounded-[1rem_3rem_1rem_1.75rem] p-7">
          <p className="text-lg font-bold">Belum ada kuis yang kamu buat.</p>
          <Link
            href="/quizzes/new"
            className="text-primary mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-bold"
          >
            Buat kuis pertamamu
            <Icon name="lucide:arrow-right" aria-hidden="true" className="size-4" />
          </Link>
        </div>
      ) : (
        <div className="divide-border border-border mt-7 divide-y border-y">
          {quizzes.items.map((quiz) => (
            <article
              key={quiz.id}
              className="py-6 sm:flex sm:items-start sm:justify-between sm:gap-8"
            >
              <div>
                <Link
                  href={`/quizzes/${quiz.id}`}
                  className="hover:text-primary text-xl font-bold tracking-[-0.02em] transition-colors"
                >
                  {quiz.title}
                </Link>
                <p className="text-muted-foreground mt-2 text-sm font-semibold">
                  {categoryLabel[quiz.category]} · {quiz.questionCount} soal · dibuat{" "}
                  {formatDate(quiz.createdAt)}
                </p>
                <PublicDiscoveryReviewStatus
                  quizId={quiz.id}
                  visibility={quiz.visibility}
                  reviewStatus={quiz.reviewStatus}
                  reviewNote={quiz.reviewNote}
                />
              </div>
              <Link
                href={`/quizzes/${quiz.id}`}
                className="text-primary mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold sm:mt-0"
              >
                Buka kuis
                <Icon name="lucide:arrow-up-right" aria-hidden="true" className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      )}

      <nav
        className="mt-6 flex items-center justify-between gap-4"
        aria-label="Halaman kuis buatanku"
      >
        {quizzes.page > 1 ? (
          <Link
            href={pageHref(quizzes.page - 1, attemptPage)}
            className="text-primary inline-flex min-h-11 items-center gap-2 text-sm font-bold"
          >
            <Icon name="lucide:arrow-left" aria-hidden="true" className="size-4" />
            Sebelumnya
          </Link>
        ) : (
          <span />
        )}
        {quizzes.hasNext ? (
          <Link
            href={pageHref(quizzes.page + 1, attemptPage)}
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
