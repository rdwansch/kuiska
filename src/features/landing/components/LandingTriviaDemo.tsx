"use client";

import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { cn } from "~/utils/cn";

const answers = ["Merkurius", "Venus", "Mars", "Saturnus"] as const;
const correctAnswer = "Venus";

export function LandingTriviaDemo() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!selectedAnswer) return;

    const timer = window.setTimeout(() => setRevealed(true), 650);
    return () => window.clearTimeout(timer);
  }, [selectedAnswer]);

  const reset = () => {
    setSelectedAnswer(null);
    setRevealed(false);
  };

  return (
    <div className="arena-preview p-5 sm:p-8">
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-sm">
          <span className="bg-surface-berry text-primary rounded-[var(--radius-label)] px-2.5 py-1 font-bold">
            Live trivia
          </span>
          <span className="text-muted-foreground font-semibold">Room 18</span>
        </div>
        <span className="tabular-data bg-surface-blue text-foreground rounded-[var(--radius-label)] px-3 py-1.5 text-sm font-bold">
          00:12
        </span>
      </div>

      <div className="relative z-10 mt-7 grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-5">
        <div className="flex items-center gap-2.5">
          <span className="bg-primary text-primary-foreground grid size-10 place-items-center rounded-[48%_52%_43%_57%/54%_42%_58%_46%] font-bold">
            R
          </span>
          <span className="text-sm font-bold">Rani</span>
        </div>
        <div className="bg-border relative h-px">
          <span className="bg-info absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
        </div>
        <div className="flex items-center justify-end gap-2.5">
          <span className="text-sm font-bold">Kamu</span>
          <span className="bg-lilac text-accent-foreground grid size-10 place-items-center rounded-[52%_48%_57%_43%/42%_58%_46%_54%] font-bold">
            K
          </span>
        </div>
      </div>

      <div className="bg-surface-blue relative z-10 mt-5 h-1.5 overflow-hidden rounded-full">
        <div className="bg-info h-full w-[62%] rounded-full transition-[width] duration-500" />
      </div>

      <h2 className="font-display relative z-10 mt-7 max-w-[28ch] text-2xl leading-[1.15] font-bold tracking-[-0.025em] text-balance sm:text-[30px]">
        Planet mana yang satu harinya lebih panjang dari satu tahunnya?
      </h2>

      <div className="relative z-10 mt-6 grid gap-2.5" aria-label="Pilihan jawaban">
        {answers.map((answer, index) => {
          const isSelected = selectedAnswer === answer;
          const isCorrect = revealed && answer === correctAnswer;
          const isIncorrect = revealed && isSelected && answer !== correctAnswer;

          return (
            <Button
              key={answer}
              type="button"
              variant="ghost"
              disabled={selectedAnswer !== null}
              aria-pressed={isSelected}
              onClick={() => setSelectedAnswer(answer)}
              className={cn(
                "bg-surface-strong text-foreground min-h-14 w-full justify-start gap-3 rounded-[var(--radius-control)] border px-4 py-3 text-left text-base font-semibold whitespace-normal transition-[transform,border-color,background-color] duration-200 ease-[var(--ease-field)] disabled:cursor-default disabled:opacity-100",
                !selectedAnswer && "hover:border-primary/55 hover:bg-surface-berry",
                isSelected &&
                  !revealed &&
                  "border-primary bg-selected-bg animate-[answer-lock_180ms_ease] border-2",
                isCorrect && "border-success bg-success-muted border-2",
                isIncorrect && "border-destructive bg-incorrect-muted border-2"
              )}
            >
              <span className="tabular-data text-muted-foreground w-5 shrink-0 text-sm font-bold">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1">{answer}</span>
              {isCorrect ? (
                <span className="text-success" aria-label="Jawaban benar">
                  <Icon name="lucide:check" aria-hidden="true" className="size-4" />
                </span>
              ) : null}
            </Button>
          );
        })}
      </div>

      <div className="border-border relative z-10 mt-6 flex min-h-11 items-center justify-between gap-4 border-t pt-5">
        <p className="text-muted-foreground text-sm leading-6" aria-live="polite">
          {!selectedAnswer
            ? "Pilih jawabanmu. Skor tetap rahasia sampai ronde selesai."
            : !revealed
              ? "Jawabanmu terkunci. Membuka hasil ronde…"
              : selectedAnswer === correctAnswer
                ? "Benar. Venus berotasi lebih lama daripada mengelilingi Matahari."
                : "Venus jawabannya. Satu rotasinya memakan sekitar 243 hari Bumi."}
        </p>
        {revealed ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={reset}
            className="text-primary hover:bg-surface-berry min-h-11 shrink-0 rounded-[var(--radius-label)] px-2.5 py-2 text-sm font-bold transition-colors"
          >
            Ulangi
          </Button>
        ) : null}
      </div>
    </div>
  );
}
