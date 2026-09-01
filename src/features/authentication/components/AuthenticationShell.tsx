import Link from "next/link";

import { KuiskaLogo } from "~/components/brand/KuiskaLogo";

export function AuthenticationShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth-field">
      <div
        aria-hidden="true"
        className="hero-field-lilac absolute top-[18%] right-[9%] hidden h-24 w-24 opacity-80 lg:block"
      />

      <svg
        aria-hidden="true"
        className="text-info pointer-events-none absolute inset-x-[-8%] top-[9%] h-[74%] w-[116%] opacity-55"
        viewBox="0 0 1200 760"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M-30 203C208 58 278 313 471 218C668 122 694 15 906 96C1060 155 1070 315 1230 284"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M89 690C277 560 396 720 576 594C747 474 867 513 1135 662"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="8 15"
          strokeLinecap="round"
        />
      </svg>

      <div className="page-shell relative z-10 flex min-h-[100dvh] flex-col py-6 sm:py-8">
        <header className="flex items-center justify-between">
          <Link href="/" aria-label="Kembali ke Kuiska">
            <KuiskaLogo />
          </Link>
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground min-h-11 px-2 py-2 text-sm font-semibold transition-colors"
          >
            Kembali
          </Link>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center py-12 sm:py-16">
          <section className="auth-surface field-enter w-full max-w-[40rem] p-6 sm:p-10 lg:p-12">
            {children}
          </section>

          <div className="mt-8 flex w-full max-w-[34rem] items-center gap-4 px-2">
            <span className="bg-primary text-primary-foreground grid size-10 shrink-0 place-items-center rounded-[48%_52%_43%_57%/54%_42%_58%_46%] font-bold">
              R
            </span>
            <div className="bg-border relative h-px flex-1">
              <span className="bg-info absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
            </div>
            <span className="border-lilac text-lilac grid size-10 shrink-0 place-items-center rounded-[52%_48%_57%_43%/42%_58%_46%_54%] border-2 font-bold">
              ?
            </span>
          </div>
          <p className="text-muted-foreground mt-4 max-w-md text-center text-sm leading-6">
            Lorenza Ayu menunggu di room Pengetahuan Umum. Masuk untuk menerima tantangan dan menyimpan
            hasil duelmu.
          </p>
        </div>

        <p className="text-muted-foreground mx-auto max-w-lg text-center text-xs leading-5">
          Kuiska memakai akunmu untuk menyimpan hasil dan menghubungkanmu ke room.
        </p>
      </div>
    </main>
  );
}
