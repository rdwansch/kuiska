import Link from "next/link";

import { Icon } from "~/components/ui/icon";
import type { RandomQuizCategory } from "../types/RandomQuizType";

const categoryLabels: Record<RandomQuizCategory, string> = {
  technology: "Teknologi",
  general: "Pengetahuan umum",
  entertainment: "Hiburan",
};

export function RandomQuizEmptyState({ category }: { category: RandomQuizCategory }) {
  return (
    <section className="pt-12 pb-20 sm:pt-16">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-3xl font-bold tracking-[-0.035em] text-balance sm:text-4xl">
          {categoryLabels[category]}
        </h1>
        <p className="text-muted-foreground mt-4 leading-7">
          Belum ada kuis publik yang disetujui di kategori ini. Coba lagi nanti atau buat kuis baru.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/explore" className="button-link button-link-primary">
            Kembali ke Explore
            <Icon name="lucide:arrow-right" aria-hidden="true" className="size-4" />
          </Link>
          <Link href="/quizzes/new" className="button-link button-link-secondary">
            Buat kuis
            <Icon name="lucide:plus" aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
