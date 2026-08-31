import Link from "next/link";

import { Icon } from "~/components/ui/icon";
import type { DashboardData } from "../types/DashboardType";
import { DashboardHistory } from "./DashboardHistory";
import { DashboardMyQuizzes } from "./DashboardMyQuizzes";

export function DashboardPage({ data }: { data: DashboardData }) {
  return (
    <main className="page-shell flex-1 pt-6 pb-20 sm:pt-8">
      <nav className="flex items-center justify-between gap-4" aria-label="Navigasi utama">
        <Link href="/" className="text-xl font-extrabold tracking-[-0.04em]">
          Kuiska
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/explore"
            className="text-foreground hover:text-primary inline-flex min-h-11 items-center gap-2 px-2 text-sm font-bold transition-colors"
          >
            <Icon name="lucide:compass" aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">Explore</span>
          </Link>
          <Link href="/quizzes/new" className="button-link button-link-primary">
            Buat kuis
          </Link>
        </div>
      </nav>
      <header className="mt-14 max-w-[42rem]">
        <h1 className="text-4xl font-bold tracking-[-0.04em] text-balance sm:text-5xl">
          Temukan permainanmu lagi, {data.userName}.
        </h1>
        <p className="text-muted-foreground mt-4 max-w-[57ch] text-lg leading-8">
          Semua kuis yang kamu buat dan permainan yang kamu selesaikan, dalam satu tempat.
        </p>
      </header>
      <DashboardMyQuizzes quizzes={data.quizzes} attemptPage={data.attempts.page} />
      <DashboardHistory attempts={data.attempts} quizPage={data.quizzes.page} />
    </main>
  );
}
