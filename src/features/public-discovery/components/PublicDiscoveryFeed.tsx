import Link from "next/link";

import { Icon } from "~/components/ui/icon";
import { cn } from "~/utils/cn";
import type { PublicDiscoveryQuiz } from "../types/PublicDiscoveryType";
import { PublicDiscoveryQuizCard } from "./PublicDiscoveryQuizCard";

export function PublicDiscoveryFeed({
  quizzes,
  showMatchTicket = false,
}: {
  quizzes: PublicDiscoveryQuiz[];
  showMatchTicket?: boolean;
}) {
  return (
    <section id="explore" className="pt-12 pb-20 sm:pt-16">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="text-4xl font-bold tracking-[-0.04em] text-balance sm:text-5xl">
            Temukan kuis untuk dimainkan.
          </h1>
          <p className="text-muted-foreground mt-3 max-w-[58ch] leading-7">
            Kuis publik yang sudah diseleksi, siap buat kamu mainkan sendiri atau bareng teman.
          </p>
        </div>
        <Link href="/quizzes/new" className="button-link button-link-secondary">
          Buat kuis
          <Icon name="lucide:plus" aria-hidden="true" className="size-4" />
        </Link>
      </div>

      {showMatchTicket ? (
        <aside className="bg-blue-ink mt-12 mb-14 overflow-hidden rounded-[1.5rem_5rem_1.5rem_2.5rem] p-6 text-white sm:p-9">
          <div className="grid gap-7 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <h2 className="max-w-[12ch] text-3xl font-bold tracking-[-0.035em] text-balance sm:text-4xl">
                Cari satu kuis. Ajak satu teman.
              </h2>
              <p className="mt-3 max-w-[50ch] leading-7 text-white/74">
                Pilih kuis publik, lalu buat room untuk adu pengetahuan bareng.
              </p>
              <a
                href="#quiz-list"
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] border border-white/30 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                Pilih kuis
                <Icon name="lucide:arrow-down" aria-hidden="true" className="size-4" />
              </a>
            </div>
            <div className="relative h-20 w-52" aria-hidden="true">
              <svg viewBox="0 0 208 80" fill="none" className="absolute inset-0 h-full w-full">
                <path
                  d="M20 56C66 6 124 80 184 24"
                  stroke="var(--info-on-ink)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <span className="bg-primary absolute top-11 left-3 size-10 rounded-full" />
              <span className="bg-lilac absolute top-2 right-3 size-10 rotate-45 rounded-[0.7rem]" />
            </div>
          </div>
        </aside>
      ) : null}

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
        <div id="quiz-list" className="mt-12 space-y-10">
          <PublicDiscoveryQuizCard quiz={quizzes[0]} featured />
          {quizzes.length > 1 ? (
            <div className="grid gap-x-8 gap-y-10 md:grid-cols-2">
              {quizzes.slice(1).map((quiz, index) => (
                <div key={quiz.id} className={cn(index % 3 === 1 && "md:col-span-2")}>
                  <PublicDiscoveryQuizCard quiz={quiz} featured={index % 3 === 1} />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
