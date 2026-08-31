import type { DashboardData } from "../types/DashboardType";
import { DashboardHistory } from "./DashboardHistory";
import { DashboardMyQuizzes } from "./DashboardMyQuizzes";

export function DashboardPage({ data }: { data: DashboardData }) {
  return (
    <main className="page-shell flex-1 pt-6 pb-20 sm:pt-8">
      <header className="mt-8 max-w-[42rem] sm:mt-12">
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
