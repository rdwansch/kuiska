import Link from "next/link";

import { Icon } from "~/components/ui/icon";
import { cn } from "~/utils/cn";

const categories = [
  {
    slug: "technology",
    label: "Teknologi",
    description: "Ide, benda, dan dunia digital",
    markerClassName: "bg-blue rotate-45",
  },
  {
    slug: "general",
    label: "Pengetahuan umum",
    description: "Hal yang seru untuk diperdebatkan",
    markerClassName: "bg-primary rounded-full",
  },
  {
    slug: "entertainment",
    label: "Hiburan",
    description: "Film, musik, dan pop culture",
    markerClassName: "bg-lilac rounded-[0.35rem]",
  },
] as const;

export function RandomQuizCategoryActions() {
  return (
    <section className="mt-12 sm:mt-16">
      <h2 className="text-2xl font-bold tracking-[-0.025em] sm:text-3xl">Main kuis random</h2>
      <p className="text-muted-foreground mt-2 max-w-[55ch] leading-7">
        Pilih kategori dan langsung mulai bermain.
      </p>
      <div className="border-border mt-8 border-l">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/play/${category.slug}`}
            prefetch={false}
            className="group hover:bg-surface-neutral focus-visible:outline-primary relative flex min-h-16 flex-wrap items-center gap-x-4 gap-y-2 py-5 pr-4 pl-7 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 sm:flex-nowrap"
          >
            <span
              aria-hidden="true"
              className={cn(
                "border-background absolute top-1/2 -left-2.5 size-5 -translate-y-1/2 border-[5px] transition-transform group-hover:scale-110",
                category.markerClassName
              )}
            />
            <div className="min-w-0 flex-1">
              <span className="text-base font-bold">{category.label}</span>
              <p className="text-muted-foreground mt-1 leading-6">{category.description}</p>
            </div>
            <span className="button-link button-link-secondary shrink-0">
              Play Random
              <Icon name="lucide:arrow-right" aria-hidden="true" className="size-3" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
