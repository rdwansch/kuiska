import Link from "next/link";

import { Icon } from "~/components/ui/icon";
import { cn } from "~/utils/cn";
import type { PublicDiscoveryQuiz } from "../types/PublicDiscoveryType";
import { PublicDiscoveryQuizCard } from "./PublicDiscoveryQuizCard";

const categories = ["technology", "general", "entertainment"] as const;

const categoryMeta: Record<
  PublicDiscoveryQuiz["category"],
  { label: string; description: string; markerClassName: string }
> = {
  technology: {
    label: "Teknologi",
    description: "Ide, benda, dan dunia digital",
    markerClassName: "bg-blue rotate-45",
  },
  general: {
    label: "Pengetahuan umum",
    description: "Hal yang seru untuk diperdebatkan",
    markerClassName: "bg-primary rounded-full",
  },
  entertainment: {
    label: "Hiburan",
    description: "Film, musik, dan pop culture",
    markerClassName: "bg-lilac rounded-[0.35rem]",
  },
};

export function PublicDiscoveryFeed({ quizzes }: { quizzes: PublicDiscoveryQuiz[] }) {
  const featuredQuiz = quizzes[0];
  const categoryGroups = categories
    .map((category) => ({
      category,
      quizzes: quizzes.slice(1).filter((quiz) => quiz.category === category),
    }))
    .filter((group) => group.quizzes.length > 0);

  return (
    <section id="explore" className="pt-12 pb-20 sm:pt-16">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="text-4xl font-bold tracking-[-0.04em] text-balance sm:text-5xl">
            Pilih topik. Mulai main.
          </h1>
          <p className="text-muted-foreground mt-3 max-w-[58ch] leading-7">
            Kuis publik yang sudah diseleksi untuk kamu mainkan sendiri atau langsung tantang ke
            teman.
          </p>
        </div>
        <Link href="/quizzes/new" className="button-link button-link-secondary">
          Buat kuis
          <Icon name="lucide:plus" aria-hidden="true" className="size-4" />
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div
          id="quiz-list"
          className="border-border bg-surface-neutral mt-12 rounded-[1rem_3rem_1rem_1.75rem] p-7 sm:p-10"
        >
          <h2 className="text-2xl font-bold tracking-[-0.025em]">Belum ada kuis publik.</h2>
          <p className="text-muted-foreground mt-2 max-w-[55ch] leading-7">
            Kuis yang sudah disetujui akan muncul di sini. Sementara itu, kamu bisa membuat kuismu
            sendiri.
          </p>
          <Link href="/quizzes/new" className="button-link button-link-primary mt-6">
            Mulai buat kuis
            <Icon name="lucide:arrow-right" aria-hidden="true" className="size-4" />
          </Link>
        </div>
      ) : (
        <div id="quiz-list" className="mt-12">
          {categoryGroups.length > 0 ? (
            <div className="sticky top-20 z-40 mb-14 flex justify-center py-3 sm:mb-16">
              <nav
                aria-label="Telusuri kuis berdasarkan topik"
                className="glass-nav border-border w-full max-w-[64rem] overflow-x-auto rounded-[2rem]"
              >
                <div className="flex w-max min-w-full items-center px-2 py-2">
                  {categoryGroups.map(({ category }) => {
                    const meta = categoryMeta[category];

                    return (
                      <a
                        key={category}
                        href={`#topic-${category}`}
                        className="group hover:bg-surface-strong hover:text-primary flex min-h-11 shrink-0 items-center gap-2 rounded-[0.6rem] px-3 text-sm font-bold transition-colors"
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "size-3 shrink-0 transition-transform group-hover:scale-125",
                            meta.markerClassName
                          )}
                        />
                        <span className="whitespace-nowrap">{meta.label}</span>
                      </a>
                    );
                  })}
                </div>
              </nav>
            </div>
          ) : null}

          <PublicDiscoveryQuizCard quiz={featuredQuiz} featured />

          {categoryGroups.length > 0 ? (
            <div className="mt-20 space-y-20 sm:mt-24">
              {categoryGroups.map(({ category, quizzes }) => {
                const meta = categoryMeta[category];

                return (
                  <section key={category} id={`topic-${category}`} className="scroll-mt-24">
                    <header className="border-border flex items-end justify-between gap-4 border-b pb-5">
                      <div>
                        <h2 className="text-3xl font-bold tracking-[-0.035em] text-balance sm:text-4xl">
                          {meta.label}
                        </h2>
                        <p className="text-muted-foreground mt-2 leading-6">{meta.description}</p>
                      </div>
                      <span className="text-muted-foreground tabular-data shrink-0 text-sm font-semibold">
                        {quizzes.length} kuis
                      </span>
                    </header>
                    <div className="mt-8 space-y-10">
                      {quizzes.map((quiz) => (
                        <PublicDiscoveryQuizCard key={quiz.id} quiz={quiz} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
