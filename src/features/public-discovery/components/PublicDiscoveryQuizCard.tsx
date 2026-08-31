import Link from "next/link";

import { Icon } from "~/components/ui/icon";
import { cn } from "~/utils/cn";
import type { PublicDiscoveryQuiz } from "../types/PublicDiscoveryType";
import { PublicDiscoveryCover } from "./PublicDiscoveryCover";

const categoryLabel = {
  technology: "Teknologi",
  general: "Pengetahuan umum",
  entertainment: "Hiburan",
};

export function PublicDiscoveryQuizCard({
  quiz,
  featured = false,
}: {
  quiz: PublicDiscoveryQuiz;
  featured?: boolean;
}) {
  return (
    <article
      className={cn(
        "relative overflow-hidden",
        featured
          ? "bg-surface-strong rounded-[1.5rem_5rem_1.5rem_2.5rem] shadow-[var(--shadow-raised)]"
          : "border-border border-t pt-7"
      )}
    >
      <PublicDiscoveryCover
        category={quiz.category}
        title={quiz.title}
        className={featured ? "min-h-64 sm:min-h-80" : "min-h-52 rounded-[1rem_3rem_1rem_1.75rem]"}
      />
      <div
        className={cn(
          featured &&
            "bg-surface-strong relative -mt-16 max-w-[44rem] p-6 sm:ml-10 sm:rounded-[var(--radius-surface)] sm:p-8"
        )}
      >
        <h3
          className={cn(
            "font-display font-bold tracking-[-0.025em] text-balance",
            featured ? "text-3xl sm:text-4xl" : "mt-6 text-2xl sm:text-3xl"
          )}
        >
          {quiz.title}
        </h3>
        <p className="text-muted-foreground mt-3 max-w-[58ch] leading-7">{quiz.description}</p>
        <p className="text-muted-foreground mt-4 text-sm font-semibold">
          {categoryLabel[quiz.category]} · {quiz.questionCount} soal · oleh @{quiz.creatorUsername}
        </p>
        <div className="mt-5 flex flex-wrap gap-4">
          <Link href={`/quizzes/${quiz.id}`} className="button-link button-link-primary">
            Mainkan
            <Icon name="lucide:arrow-right" aria-hidden="true" className="size-4" />
          </Link>
          <Link
            href={`/quizzes/${quiz.id}#challenge`}
            className="text-foreground hover:text-primary inline-flex min-h-11 items-center gap-2 py-2 text-sm font-bold transition-colors"
          >
            Tantang teman
            <Icon name="lucide:swords" aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
