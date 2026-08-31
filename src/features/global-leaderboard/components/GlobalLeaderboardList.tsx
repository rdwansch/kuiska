import Link from "next/link";

import { Icon } from "~/components/ui/icon";
import { globalLeaderboardMaxPage } from "../schemas/GlobalLeaderboardSchema";
import type { GlobalLeaderboardPage } from "../types/GlobalLeaderboardType";

function pageHref(page: number) {
  return page === 1 ? "/leaderboard" : `/leaderboard?page=${page}`;
}

export function GlobalLeaderboardList({ data }: { data: GlobalLeaderboardPage }) {
  return (
    <main className="page-shell flex-1 pt-6 pb-20 sm:pt-10">
      <header className="relative max-w-[46rem] pt-8 sm:pt-12">
        <svg
          aria-hidden="true"
          className="text-info pointer-events-none absolute -top-8 -left-20 h-48 w-[34rem] opacity-45"
          viewBox="0 0 560 180"
          fill="none"
        >
          <path
            d="M-16 136C75 132 86 35 178 43C282 52 272 145 374 137C457 131 484 59 576 42"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="178" cy="43" r="8" fill="var(--primary)" />
          <circle cx="374" cy="137" r="8" fill="var(--lilac)" />
        </svg>

        <div className="relative">
          <h1 className="text-4xl font-bold tracking-[-0.04em] text-balance sm:text-5xl">
            Papan aktivitas
          </h1>
          <p className="text-muted-foreground mt-4 max-w-[58ch] text-lg leading-8">
            Lihat siapa yang paling konsisten menyelesaikan kuis di Kuiska.
          </p>
        </div>
      </header>

      {data.entries.length === 0 ? (
        <section
          className="border-border bg-surface-blue mt-14 max-w-[52rem] rounded-[1rem_3rem_1rem_1.75rem] p-7 sm:mt-16 sm:p-10"
          aria-labelledby="leaderboard-empty-heading"
        >
          <h2 id="leaderboard-empty-heading" className="text-2xl font-bold tracking-[-0.025em]">
            {data.page === 1
              ? "Belum ada aktivitas tersimpan."
              : "Halaman ini belum berisi pemain."}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-[52ch] leading-7">
            {data.page === 1
              ? "Selesaikan kuis dalam keadaan masuk agar permainanmu ikut tercatat di sini."
              : "Kembali ke halaman sebelumnya untuk melihat pemain yang sudah tercatat."}
          </p>
          {data.page === 1 ? (
            <Link href="/explore" className="button-link button-link-primary mt-6">
              Cari kuis
              <Icon name="lucide:arrow-right" aria-hidden="true" className="size-4" />
            </Link>
          ) : (
            <Link
              href={pageHref(data.page - 1)}
              className="text-primary mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-bold"
            >
              <Icon name="lucide:arrow-left" aria-hidden="true" className="size-4" />
              Sebelumnya
            </Link>
          )}
        </section>
      ) : (
        <section
          className="mt-14 max-w-[58rem] sm:mt-16"
          aria-labelledby="leaderboard-list-heading"
        >
          <div className="border-border flex flex-wrap items-end justify-between gap-3 border-b pb-5">
            <div>
              <h2 id="leaderboard-list-heading" className="text-2xl font-bold tracking-[-0.025em]">
                Pemain paling aktif
              </h2>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                Jumlah kuis selesai menentukan urutan. Skor rata-rata hanya sebagai konteks.
              </p>
            </div>
            <span className="text-muted-foreground tabular-data text-sm font-semibold">
              Halaman {data.page}
            </span>
          </div>

          <div className="text-muted-foreground mt-5 hidden grid-cols-[4rem_minmax(0,1fr)_9rem_8rem] gap-4 px-4 text-sm font-bold sm:grid">
            <span aria-hidden="true" />
            <span>Pemain</span>
            <span className="text-right">Kuis selesai</span>
            <span className="text-right">Skor rata-rata</span>
          </div>

          <ol
            className="divide-border border-border mt-2 divide-y border-y"
            aria-label="Papan aktivitas"
          >
            {data.entries.map((entry) => (
              <li
                key={`${entry.rank}-${entry.username}`}
                className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-4 gap-y-3 px-4 py-5 sm:grid-cols-[4rem_minmax(0,1fr)_9rem_8rem] sm:items-center"
              >
                <span className="text-muted-foreground tabular-data text-2xl font-bold tracking-[-0.03em]">
                  {entry.rank}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold">{entry.username}</p>
                  <p className="text-muted-foreground mt-1 text-sm sm:hidden">
                    {entry.completedCount} kuis selesai · rata-rata {entry.averageScore}%
                  </p>
                </div>
                <span className="tabular-data hidden text-right text-lg font-bold sm:block">
                  {entry.completedCount}
                </span>
                <span className="text-muted-foreground tabular-data hidden text-right text-sm font-semibold sm:block">
                  {entry.averageScore}%
                </span>
              </li>
            ))}
          </ol>

          <nav
            className="mt-6 flex items-center justify-between gap-4"
            aria-label="Halaman papan aktivitas"
          >
            {data.page > 1 ? (
              <Link
                href={pageHref(data.page - 1)}
                className="text-primary inline-flex min-h-11 items-center gap-2 text-sm font-bold"
              >
                <Icon name="lucide:arrow-left" aria-hidden="true" className="size-4" />
                Sebelumnya
              </Link>
            ) : (
              <span />
            )}
            {data.hasNext && data.page < globalLeaderboardMaxPage ? (
              <Link
                href={pageHref(data.page + 1)}
                className="text-primary inline-flex min-h-11 items-center gap-2 text-sm font-bold"
              >
                Berikutnya
                <Icon name="lucide:arrow-right" aria-hidden="true" className="size-4" />
              </Link>
            ) : null}
          </nav>
        </section>
      )}
    </main>
  );
}
