"use client";

import Link from "next/link";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { useQuizTakingHook } from "../hooks/QuizTakingHook";
import type { QuizTakingAccessState } from "../types/QuizTakingType";
import { QuizTakingAccessForm } from "./QuizTakingAccessForm";
import { QuizTakingResult } from "./QuizTakingResult";

const categoryLabels = {
  technology: "Teknologi",
  general: "Pengetahuan umum",
  entertainment: "Hiburan",
};

export function QuizTakingForm({ initialState }: { initialState: QuizTakingAccessState }) {
  const { formState, isPending, isComplete, unlockQuiz, chooseAnswer, submit } =
    useQuizTakingHook(initialState);

  if (formState.result) return <QuizTakingResult result={formState.result} />;

  if (!formState.quiz) {
    return (
      <QuizTakingAccessForm
        quizId={initialState.status === "private" ? initialState.quizId : ""}
        error={formState.error}
        isPending={isPending}
        onUnlock={unlockQuiz}
      />
    );
  }

  const { quiz } = formState;

  return (
    <main className="bg-background min-h-screen overflow-x-hidden py-6 sm:py-10">
      <div className="page-shell relative max-w-[58rem] py-6 sm:py-12">
        <svg
          aria-hidden="true"
          className="text-info pointer-events-none absolute top-28 left-[-24%] h-[82%] w-[82%] opacity-50 lg:left-[-10%]"
          viewBox="0 0 700 1100"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M104 -30C229 153 73 270 234 411C352 515 279 690 457 775C586 836 591 954 728 1105"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative mx-auto max-w-[46rem]">
          <header>
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center text-sm font-semibold transition-colors"
            >
              Kembali ke Kuiska
            </Link>
            <h1 className="font-display mt-8 text-4xl leading-[1.06] font-bold tracking-[-0.03em] text-balance sm:text-6xl">
              {quiz.title}
            </h1>
            <p className="text-muted-foreground mt-5 max-w-[60ch] text-lg leading-8">
              {quiz.description}
            </p>
            <p className="text-muted-foreground mt-5 text-sm font-semibold">
              {categoryLabels[quiz.category]} · {quiz.questions.length} soal
            </p>
          </header>

          {formState.error ? (
            <Badge className="mt-8 w-full" role="alert">
              {formState.error}
            </Badge>
          ) : null}

          <form className="mt-12" onSubmit={submit}>
            <div className="space-y-12">
              {quiz.questions.map((question, questionIndex) => (
                <section
                  key={question.id}
                  className="border-border border-t pt-9 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="font-display text-2xl leading-tight font-bold tracking-[-0.02em] sm:text-3xl">
                      {question.content}
                    </h2>
                    <span className="tabular-data text-muted-foreground shrink-0 text-sm font-semibold">
                      {questionIndex + 1}/{quiz.questions.length}
                    </span>
                  </div>

                  <fieldset className="mt-6">
                    <legend className="sr-only">
                      Pilih jawaban untuk pertanyaan {questionIndex + 1}
                    </legend>
                    <RadioGroup
                      value={formState.answers[question.id]}
                      onValueChange={(optionId) => chooseAnswer(question.id, optionId)}
                      disabled={isPending}
                      className="space-y-3"
                    >
                      {question.options.map((option) => {
                        const isSelected = formState.answers[question.id] === option.id;

                        return (
                          <label
                            key={option.id}
                            className={`flex min-h-16 cursor-pointer items-center gap-4 rounded-[var(--radius-control)] border px-4 py-3 text-left transition-[border-color,background-color,transform] duration-200 ease-[var(--ease-field)] ${
                              isSelected
                                ? "border-primary bg-surface-berry border-2"
                                : "border-border bg-surface-strong hover:border-primary/45 hover:bg-surface-neutral"
                            } ${isPending ? "cursor-not-allowed opacity-70" : ""}`}
                          >
                            <RadioGroupItem value={option.id} className="shrink-0" />
                            <span className="min-w-0 flex-1 text-base leading-6 font-semibold">
                              {option.content}
                            </span>
                            {isSelected ? (
                              <span className="text-primary text-sm font-bold">Dipilih</span>
                            ) : null}
                          </label>
                        );
                      })}
                    </RadioGroup>
                  </fieldset>
                </section>
              ))}
            </div>

            <div className="border-border mt-14 flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-muted-foreground max-w-[40ch] text-sm leading-6">
                Semua jawaban akan diperiksa sekaligus. Kunci jawaban tidak ditampilkan setelah kuis
                selesai.
              </p>
              <Button type="submit" size="lg" disabled={!isComplete || isPending}>
                {isPending ? "Menghitung hasil…" : "Lihat hasil"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
