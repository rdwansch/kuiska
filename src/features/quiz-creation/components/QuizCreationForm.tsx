"use client";

import Link from "next/link";
import { useState } from "react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useQuizCreationHook } from "../hooks/QuizCreationHook";
import { QuizCreationTopicArt } from "./QuizCreationTopicArt";

const categoryOptions = [
  { value: "general", label: "Pengetahuan umum" },
  { value: "technology", label: "Teknologi" },
  { value: "entertainment", label: "Hiburan" },
] as const;

export function QuizCreationForm() {
  const {
    formInput,
    isPending,
    updateTextField,
    updateCategory,
    updateVisibility,
    updateQuestionContent,
    updateOptionContent,
    selectCorrectOption,
    addQuestion,
    removeQuestion,
    addOption,
    removeOption,
    submit,
  } = useQuizCreationHook();
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  const copyQuizUrl = async () => {
    if (!formInput.result) return;

    try {
      await navigator.clipboard.writeText(
        new URL(formInput.result.quizUrl, window.location.origin).toString()
      );
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  };

  if (formInput.result) {
    return (
      <main className="bg-background min-h-screen overflow-x-hidden py-6 sm:py-10">
        <div className="page-shell relative max-w-[52rem] py-12 sm:py-20">
          <svg
            aria-hidden="true"
            className="text-info absolute top-0 right-[-14%] h-72 w-[74%] opacity-60"
            viewBox="0 0 700 280"
            fill="none"
          >
            <path
              d="M-30 193C149 128 139 19 319 62C478 100 478 243 734 77"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          <section className="relative max-w-[44rem]">
            <div className="bg-surface-jade text-success mb-8 grid size-16 place-items-center rounded-[43%_57%_48%_52%/54%_42%_58%_46%]">
              <Icon name="lucide:check" aria-hidden="true" className="size-8" strokeWidth={2.2} />
            </div>
            <h1 className="font-display text-4xl leading-[1.06] font-bold tracking-[-0.03em] text-balance sm:text-6xl">
              Kuismu siap dimainkan.
            </h1>
            <p className="text-muted-foreground mt-5 max-w-[58ch] text-lg leading-8">
              Kuis sudah tersimpan. Salin tautan ini untuk membagikannya saat kamu siap.
            </p>

            <div className="border-border bg-surface-strong mt-10 border p-4 shadow-[var(--shadow-raised)] sm:flex sm:items-center sm:gap-3">
              <p className="text-foreground block min-w-0 flex-1 overflow-x-auto px-2 py-2 text-sm font-semibold break-all">
                {formInput.result.quizUrl}
              </p>
              <Button type="button" className="mt-3 w-full sm:mt-0 sm:w-auto" onClick={copyQuizUrl}>
                {copyStatus === "copied" ? "Tautan tersalin" : "Salin tautan"}
              </Button>
            </div>
            {copyStatus === "error" ? (
              <p className="text-destructive mt-3 text-sm" role="status">
                Tautan belum bisa disalin. Salin langsung dari kotak di atas.
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={formInput.result.quizUrl} className="button-link button-link-primary">
                Buka kuis
              </Link>
              <Link href="/" className="button-link button-link-secondary">
                Kembali ke Kuiska
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const previewBackground =
    formInput.category === "technology"
      ? "bg-surface-blue"
      : formInput.category === "entertainment"
        ? "bg-surface-lilac"
        : "bg-surface-neutral";

  return (
    <main className="bg-background min-h-screen overflow-x-hidden py-6 sm:py-10">
      <div className="page-shell relative max-w-[76rem] py-6 sm:py-12">
        <svg
          aria-hidden="true"
          className="text-info pointer-events-none absolute top-20 left-[-20%] h-[76%] w-[78%] opacity-45 lg:left-[-8%]"
          viewBox="0 0 700 1000"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M82 -24C216 124 51 233 224 361C390 485 264 625 476 723C588 774 589 899 736 1015"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
          <form className="min-w-0" onSubmit={submit}>
            <div className="max-w-[48rem]">
              <h1 className="font-display text-4xl leading-[1.06] font-bold tracking-[-0.03em] text-balance sm:text-6xl">
                Buat kuis yang ingin kamu bagikan.
              </h1>
              <p className="text-muted-foreground mt-5 max-w-[60ch] text-lg leading-8">
                Mulai dari topik dan konteksnya, lalu susun pertanyaan yang membuat orang ingin
                menjawab sampai akhir.
              </p>
            </div>

            {formInput.error ? (
              <Badge className="mt-8 w-full max-w-[48rem]" role="alert">
                {formInput.error}
              </Badge>
            ) : null}

            <section className="mt-12 max-w-[48rem]">
              <h2 className="font-display text-3xl font-bold tracking-[-0.025em]">
                Tentang kuis ini
              </h2>
              <div className="mt-6 space-y-6">
                <div className="space-y-2.5">
                  <Label htmlFor="quiz-title" required>
                    Judul
                  </Label>
                  <Input
                    id="quiz-title"
                    value={formInput.title}
                    onChange={(event) => updateTextField("title", event.target.value)}
                    placeholder="Contoh: Teknologi yang mengubah cara kita hidup"
                    minLength={3}
                    maxLength={120}
                    required
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="quiz-description" required>
                    Deskripsi singkat
                  </Label>
                  <textarea
                    id="quiz-description"
                    value={formInput.description}
                    onChange={(event) => updateTextField("description", event.target.value)}
                    placeholder="Berikan konteks singkat agar orang tahu apa yang akan mereka mainkan."
                    minLength={10}
                    maxLength={500}
                    required
                    disabled={isPending}
                    className="bg-surface-strong text-foreground placeholder:text-muted-foreground focus-visible:ring-ring focus-visible:ring-offset-background border-input hover:border-primary/40 focus-visible:border-ring disabled:bg-disabled-bg min-h-32 w-full resize-y rounded-[var(--radius-control)] border px-4 py-3 text-base leading-6 transition-[border-color,box-shadow,background-color] duration-200 ease-[var(--ease-field)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="quiz-category">Kategori</Label>
                  <select
                    id="quiz-category"
                    value={formInput.category}
                    onChange={(event) =>
                      updateCategory(event.target.value as typeof formInput.category)
                    }
                    disabled={isPending}
                    className="bg-surface-strong text-foreground focus-visible:ring-ring focus-visible:ring-offset-background border-input hover:border-primary/40 focus-visible:border-ring disabled:bg-disabled-bg h-13 w-full rounded-[var(--radius-control)] border px-4 text-base transition-[border-color,box-shadow,background-color] duration-200 ease-[var(--ease-field)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <fieldset className="space-y-3">
                  <legend className="text-foreground text-sm font-semibold">Visibilitas</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(
                      [
                        {
                          value: "public",
                          title: "Publik",
                          description: "Siapa pun yang memiliki tautan dapat langsung bermain.",
                        },
                        {
                          value: "private",
                          title: "Privat",
                          description: "Pemain perlu memasukkan kode rahasia sebelum melihat soal.",
                        },
                      ] as const
                    ).map((visibility) => (
                      <label
                        key={visibility.value}
                        className={`min-h-28 cursor-pointer rounded-[var(--radius-surface)] border p-4 transition-colors ${
                          formInput.visibility === visibility.value
                            ? "border-primary bg-surface-berry"
                            : "border-border bg-surface-strong hover:border-primary/40"
                        }`}
                      >
                        <span className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="visibility"
                            value={visibility.value}
                            checked={formInput.visibility === visibility.value}
                            onChange={() => updateVisibility(visibility.value)}
                            disabled={isPending}
                            className="accent-primary mt-1 size-4"
                          />
                          <span>
                            <span className="block text-sm font-bold">{visibility.title}</span>
                            <span className="text-muted-foreground mt-1 block text-sm leading-5">
                              {visibility.description}
                            </span>
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {formInput.visibility === "private" ? (
                  <div className="space-y-2.5">
                    <Label htmlFor="quiz-secret-code" required>
                      Kode rahasia
                    </Label>
                    <Input
                      id="quiz-secret-code"
                      type="password"
                      value={formInput.secretCode}
                      onChange={(event) => updateTextField("secretCode", event.target.value)}
                      placeholder="4–64 karakter"
                      minLength={4}
                      maxLength={64}
                      required
                      disabled={isPending}
                    />
                    <p className="text-muted-foreground text-sm leading-5">
                      Kode hanya dipakai untuk membuka kuis dan tidak pernah ditampilkan kembali.
                    </p>
                  </div>
                ) : null}
              </div>
            </section>

            <section className="mt-16 max-w-[48rem]">
              <div className="flex items-end justify-between gap-5">
                <div>
                  <h2 className="font-display text-3xl font-bold tracking-[-0.025em]">
                    Pertanyaan
                  </h2>
                  <p className="text-muted-foreground mt-2 text-sm leading-6">
                    Pilih satu jawaban benar untuk setiap pertanyaan.
                  </p>
                </div>
                <p className="tabular-data text-muted-foreground text-sm font-semibold">
                  {formInput.questions.length} soal
                </p>
              </div>

              <div className="mt-8 space-y-10">
                {formInput.questions.map((question, questionIndex) => (
                  <article
                    key={question.id}
                    className="border-border bg-surface-strong relative border-t pt-7 first:border-t-0 first:pt-0"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-2xl font-bold tracking-[-0.02em]">
                        Pertanyaan {questionIndex + 1}
                      </h3>
                      {formInput.questions.length > 1 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-incorrect-muted hover:text-destructive"
                          onClick={() => removeQuestion(question.id)}
                          disabled={isPending}
                        >
                          <Icon name="lucide:minus" aria-hidden="true" className="size-4" />
                          Hapus
                        </Button>
                      ) : null}
                    </div>

                    <div className="mt-5 space-y-2.5">
                      <Label htmlFor={`question-${question.id}`} required>
                        Teks pertanyaan
                      </Label>
                      <textarea
                        id={`question-${question.id}`}
                        value={question.content}
                        onChange={(event) => updateQuestionContent(question.id, event.target.value)}
                        placeholder="Tulis pertanyaan yang jelas dan bisa dijawab."
                        minLength={1}
                        maxLength={1000}
                        required
                        disabled={isPending}
                        className="bg-surface-strong text-foreground placeholder:text-muted-foreground focus-visible:ring-ring focus-visible:ring-offset-background border-input hover:border-primary/40 focus-visible:border-ring disabled:bg-disabled-bg min-h-28 w-full resize-y rounded-[var(--radius-control)] border px-4 py-3 text-base leading-6 transition-[border-color,box-shadow,background-color] duration-200 ease-[var(--ease-field)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed"
                      />
                    </div>

                    <fieldset className="mt-6">
                      <legend className="text-foreground text-sm font-semibold">
                        Pilihan jawaban
                      </legend>
                      <div className="mt-3 space-y-3">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={option.id}
                            className={`rounded-[var(--radius-surface)] border p-3 transition-colors ${
                              option.isCorrect
                                ? "border-primary bg-surface-berry"
                                : "border-border bg-surface-strong"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                                <input
                                  type="radio"
                                  name={`correct-option-${question.id}`}
                                  checked={option.isCorrect}
                                  onChange={() => selectCorrectOption(question.id, option.id)}
                                  disabled={isPending}
                                  className="accent-primary size-4"
                                />
                                Jawaban benar
                              </label>
                              {question.options.length > 2 ? (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:bg-incorrect-muted hover:text-destructive"
                                  onClick={() => removeOption(question.id, option.id)}
                                  disabled={isPending}
                                  aria-label={`Hapus pilihan ${optionIndex + 1}`}
                                >
                                  <Icon name="lucide:minus" aria-hidden="true" className="size-4" />
                                  Hapus
                                </Button>
                              ) : null}
                            </div>
                            <Input
                              value={option.content}
                              onChange={(event) =>
                                updateOptionContent(question.id, option.id, event.target.value)
                              }
                              placeholder={`Pilihan ${optionIndex + 1}`}
                              aria-label={`Pilihan jawaban ${optionIndex + 1}`}
                              minLength={1}
                              maxLength={500}
                              required
                              disabled={isPending}
                              className="mt-3 h-11"
                            />
                          </div>
                        ))}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => addOption(question.id)}
                        disabled={isPending}
                      >
                        <Icon name="lucide:plus" aria-hidden="true" className="size-4" />
                        Tambah pilihan
                      </Button>
                    </fieldset>
                  </article>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                className="mt-10"
                onClick={addQuestion}
                disabled={isPending}
              >
                <Icon name="lucide:plus" aria-hidden="true" className="size-4" />
                Tambah pertanyaan
              </Button>
            </section>

            <div className="border-border mt-14 flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-muted-foreground max-w-[42ch] text-sm leading-6">
                Setelah tersimpan, kamu akan mendapat tautan kuis yang bisa langsung dibagikan.
              </p>
              <Button type="submit" size="lg" disabled={isPending}>
                {isPending ? "Menyimpan kuis…" : "Simpan kuis"}
              </Button>
            </div>
          </form>

          <aside className="relative lg:pt-12" aria-label="Pratinjau kuis">
            <div className="lg:sticky lg:top-10">
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em]">Pratinjau</h2>
              <div
                className={`${previewBackground} relative mt-4 min-h-56 overflow-hidden rounded-[1.25rem_4.5rem_1.5rem_3rem]`}
              >
                <QuizCreationTopicArt category={formInput.category} />
              </div>
              <div className="border-border mt-5 border-t pt-5">
                <h3 className="font-display text-2xl leading-tight font-bold tracking-[-0.02em]">
                  {formInput.title || "Judul kuismu akan muncul di sini"}
                </h3>
                <p className="text-muted-foreground mt-3 text-sm leading-6">
                  {formInput.description || "Tambahkan deskripsi singkat untuk memberi konteks."}
                </p>
                <p className="text-muted-foreground mt-4 text-sm font-semibold">
                  {categoryOptions.find((category) => category.value === formInput.category)?.label}{" "}
                  · {formInput.questions.length} soal ·{" "}
                  {formInput.visibility === "public" ? "Publik" : "Privat"}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
