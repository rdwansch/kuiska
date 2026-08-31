import Link from "next/link";

import { KuiskaLogo } from "~/components/brand/KuiskaLogo";
import { Icon } from "~/components/ui/icon";
import { LandingHero } from "./LandingHero";

function GeneralKnowledgeArt() {
  return (
    <div className="topic-art bg-surface-neutral" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 760 420" fill="none">
        <path
          d="M-30 292C97 210 190 336 312 250C432 165 492 63 790 116"
          stroke="var(--primary)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M88 78C172 26 257 37 286 112C319 196 222 250 146 215C67 179 29 116 88 78Z"
          fill="var(--surface-strong)"
        />
        <circle cx="181" cy="147" r="41" fill="var(--lilac)" />
        <path d="M498 91H675V267H498Z" fill="var(--surface-jade)" />
        <path d="M530 122H643V236H530Z" fill="var(--jade)" />
        <circle cx="586" cy="179" r="24" fill="var(--surface-strong)" />
        <circle cx="379" cy="256" r="15" fill="var(--info)" />
      </svg>
    </div>
  );
}

function TechnologyArt() {
  return (
    <div className="bg-surface-blue relative min-h-56 overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 520 300" fill="none">
        <path
          d="M-20 211C81 211 88 78 198 78C304 78 303 224 416 224C467 224 496 190 540 149"
          stroke="var(--info)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <rect x="136" y="42" width="92" height="92" rx="22" fill="var(--surface-strong)" />
        <path d="M167 65H198V111H167Z" fill="var(--lilac)" />
        <circle cx="413" cy="224" r="38" fill="var(--primary)" />
        <circle cx="413" cy="224" r="12" fill="var(--surface-strong)" />
        <path d="M285 178L342 125L374 160L318 213Z" fill="var(--surface-lilac)" />
      </svg>
    </div>
  );
}

function PopCultureArt() {
  return (
    <div className="bg-surface-lilac relative min-h-56 overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 520 300" fill="none">
        <path d="M66 32H224V244H66Z" fill="var(--blue)" />
        <path d="M98 65H193V210H98Z" fill="var(--surface-strong)" />
        <path
          d="M255 264C256 166 324 79 431 61"
          stroke="var(--lilac)"
          strokeWidth="44"
          strokeLinecap="round"
        />
        <circle cx="397" cy="83" r="35" fill="var(--surface-jade)" />
        <circle cx="397" cy="83" r="12" fill="var(--jade)" />
      </svg>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="bg-background min-h-screen overflow-x-hidden">
      <header className="glass-nav fixed top-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-[1180px] -translate-x-1/2 rounded-[1.25rem] sm:top-5">
        <div className="page-shell flex h-18 items-center justify-between gap-4">
          <Link href="/" aria-label="Kuiska home">
            <KuiskaLogo />
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Navigasi utama">
            <a
              className="text-muted-foreground hover:text-foreground text-sm font-semibold transition-colors"
              href="#cara-main"
            >
              Cara main
            </a>
            <a
              className="text-muted-foreground hover:text-foreground text-sm font-semibold transition-colors"
              href="#mode"
            >
              Mode
            </a>
            <a
              className="text-muted-foreground hover:text-foreground text-sm font-semibold transition-colors"
              href="#topik"
            >
              Topik
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/signin"
              className="text-foreground hover:text-primary hidden min-h-11 items-center px-3.5 text-sm font-bold transition-colors sm:inline-flex"
            >
              Masuk
            </Link>
            <Link href="/signup" className="button-link button-link-primary">
              Buat akun
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-[6.5rem] sm:pt-28">
        <LandingHero />

        <section id="cara-main" className="flow-field bg-background-alt py-24 sm:py-32 lg:py-40">
          <div className="page-shell relative">
            <svg
              aria-hidden="true"
              className="text-info absolute top-40 bottom-10 left-4 hidden h-[calc(100%-10rem)] w-[78%] overflow-visible opacity-70 md:block"
              viewBox="0 0 900 900"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M42 0C221 116 46 261 247 342C415 409 336 532 544 606C681 655 724 740 886 898"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>

            <div className="max-w-[50rem]">
              <h2 className="font-display text-4xl leading-[1.08] font-bold tracking-[-0.025em] text-balance sm:text-5xl lg:text-6xl">
                Satu topik bergerak sampai jadi alasan untuk main lagi.
              </h2>
              <p className="text-muted-foreground mt-6 max-w-[62ch] text-lg leading-8">
                Alur Kuiska tetap sederhana, tetapi setiap langkah menambah alasan sosial untuk
                menyelesaikan permainan.
              </p>
            </div>

            <ol className="relative mt-20 grid gap-16 pl-8 md:mt-28 md:grid-cols-12 md:gap-y-28 md:pl-0">
              <li className="flow-step md:col-span-5 md:col-start-2">
                <h3 className="font-display text-3xl font-bold tracking-[-0.02em]">Pilih topik</h3>
                <p className="text-muted-foreground mt-3 max-w-[34rem] leading-7">
                  Mulai dari hal yang memang ingin kamu buktikan: pengetahuan umum, teknologi, atau
                  topik buatan komunitas.
                </p>
              </li>
              <li className="flow-step md:col-span-5 md:col-start-7 md:row-start-2">
                <h3 className="font-display text-3xl font-bold tracking-[-0.02em]">
                  Kirim tantangan
                </h3>
                <p className="text-muted-foreground mt-3 max-w-[34rem] leading-7">
                  Buka room dua pemain dan bagikan tautannya ke satu teman. Kedekatan duel lebih
                  penting daripada keramaian.
                </p>
              </li>
              <li className="flow-step md:col-span-5 md:col-start-3 md:row-start-3">
                <h3 className="font-display text-3xl font-bold tracking-[-0.02em]">
                  Kunci jawaban
                </h3>
                <p className="text-muted-foreground mt-3 max-w-[34rem] leading-7">
                  Di Live Trivia, kedua pemain menjawab soal yang sama. Jawaban baru terbuka saat
                  timer bersama berakhir.
                </p>
              </li>
              <li className="flow-step md:col-span-5 md:col-start-8 md:row-start-4">
                <h3 className="font-display text-3xl font-bold tracking-[-0.02em]">Buka hasil</h3>
                <p className="text-muted-foreground mt-3 max-w-[34rem] leading-7">
                  Skor dan pemenang muncul setelah soal terakhir. Jawaban benar menentukan hasil;
                  waktu hanya memecahkan seri.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section id="mode" className="page-shell py-24 sm:py-32 lg:py-40">
          <div className="max-w-[52rem]">
            <h2 className="font-display text-4xl leading-[1.08] font-bold tracking-[-0.025em] text-balance sm:text-5xl lg:text-6xl">
              Pilih ritme yang cocok dengan waktu kalian.
            </h2>
            <p className="text-muted-foreground mt-6 max-w-[62ch] text-lg leading-8">
              Live Trivia membuat satu ronde terasa bersama. Self-Paced Race menjaga kompetisinya
              tetap hidup ketika jadwal tidak bertemu.
            </p>
          </div>

          <div className="bg-blue-ink relative mt-14 min-h-[32rem] overflow-hidden rounded-[2rem_7rem_2rem_3rem] p-7 text-white sm:p-12 lg:p-16">
            <svg
              aria-hidden="true"
              className="text-info-on-ink absolute inset-0 h-full w-full opacity-55"
              viewBox="0 0 1180 520"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M-20 390C188 258 299 456 478 310C645 173 747 55 1200 102"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="relative z-10 max-w-[36rem]">
              <h3 className="font-display text-4xl font-bold tracking-[-0.025em] sm:text-5xl">
                Live Trivia
              </h3>
              <p className="mt-4 text-lg leading-8 text-white/75">
                Satu timer, satu soal, dua pemain. Jawaban terkunci sampai waktu habis dan posisi
                tetap rahasia sampai permainan selesai.
              </p>
            </div>
            <div className="absolute right-[8%] bottom-[12%] z-10 grid size-36 place-items-center rounded-full border border-white/25 bg-white/10 sm:size-48">
              <span className="tabular-data text-4xl font-bold sm:text-5xl">12s</span>
            </div>
            <div className="bg-berry-bright absolute right-[31%] bottom-[28%] size-10 rounded-[46%_54%_42%_58%/52%_40%_60%_48%] sm:size-14" />
            <div className="bg-lilac-bright absolute right-[4%] bottom-[42%] size-8 rounded-[54%_46%_62%_38%/45%_58%_42%_55%] sm:size-12" />
          </div>

          <div className="bg-surface-lilac relative -mt-8 ml-auto min-h-72 w-[min(92%,52rem)] overflow-hidden rounded-[4rem_1rem_3rem_1rem] p-7 shadow-[var(--shadow-raised)] sm:p-10 lg:-mt-16 lg:mr-[5%] lg:p-12">
            <svg
              aria-hidden="true"
              className="text-lilac absolute right-[-10%] bottom-[-28%] h-[125%] w-[70%] opacity-55"
              viewBox="0 0 480 360"
              fill="none"
            >
              <path
                d="M26 334C39 211 100 103 216 59C314 22 399 52 476 114"
                stroke="currentColor"
                strokeWidth="42"
                strokeLinecap="round"
              />
            </svg>
            <div className="relative z-10 max-w-[32rem]">
              <h3 className="font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
                Self-Paced Race
              </h3>
              <p className="text-muted-foreground mt-4 text-base leading-7 sm:text-lg">
                Soalnya tetap sama, waktunya boleh berbeda. Posisi sementara muncul setelah kamu
                selesai dan menjadi final saat lawan ikut menuntaskan kuis.
              </p>
              <p className="mt-5 text-sm font-bold">Skor utama. Durasi memecahkan seri.</p>
            </div>
          </div>
        </section>

        <section id="topik" className="bg-background-alt py-24 sm:py-32 lg:py-40">
          <div className="page-shell">
            <div className="max-w-[48rem]">
              <h2 className="font-display text-4xl leading-[1.08] font-bold tracking-[-0.025em] text-balance sm:text-5xl lg:text-6xl">
                Temukan topik yang membuatmu ingin membuktikan sesuatu.
              </h2>
              <p className="text-muted-foreground mt-6 max-w-[62ch] text-lg leading-8">
                Explore mengutamakan judul dan visual kuis. Aktivitas pemain membantu memilih,
                tetapi tidak mengambil alih isi.
              </p>
            </div>

            <div className="mt-14 lg:mt-20">
              <article className="bg-surface-strong relative overflow-hidden rounded-[1.5rem_6rem_1.5rem_2.5rem] shadow-[var(--shadow-raised)]">
                <GeneralKnowledgeArt />
                <div className="bg-surface-strong relative -mt-24 max-w-[42rem] p-6 sm:ml-10 sm:rounded-[var(--radius-surface)] sm:p-8 lg:ml-16 lg:p-10">
                  <h3 className="font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
                    Hal kecil yang sering kita lewatkan
                  </h3>
                  <p className="text-muted-foreground mt-3 font-semibold">
                    Pengetahuan umum · 10 soal · Cocok untuk duel pertama
                  </p>
                </div>
              </article>

              <div className="border-border mt-16 grid items-stretch border-t lg:grid-cols-[0.82fr_1.18fr]">
                <article className="border-border py-10 lg:border-r lg:pr-10">
                  <TechnologyArt />
                  <h3 className="font-display mt-7 text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
                    Dari chip sampai internet
                  </h3>
                  <p className="text-muted-foreground mt-3 font-semibold">Teknologi · 8 soal</p>
                </article>

                <article className="border-border border-t py-10 lg:border-t-0 lg:pl-14">
                  <PopCultureArt />
                  <h3 className="font-display mt-7 text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
                    Film yang masih kamu hafal
                  </h3>
                  <p className="text-muted-foreground mt-3 font-semibold">Pop culture · 12 soal</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="page-shell py-20 sm:py-28">
          <div className="bg-blue-ink relative overflow-hidden rounded-[1.5rem_6rem_1.5rem_3rem] px-6 py-14 text-white sm:px-12 lg:px-16 lg:py-20">
            <svg
              aria-hidden="true"
              className="absolute right-[-4rem] bottom-[-7rem] h-72 w-72 text-white/18"
              viewBox="0 0 300 300"
              fill="none"
            >
              <path
                d="M20 250C49 124 137 47 282 39"
                stroke="currentColor"
                strokeWidth="54"
                strokeLinecap="round"
              />
            </svg>
            <div className="relative max-w-[48rem]">
              <h2 className="font-display text-4xl font-bold tracking-[-0.025em] text-balance sm:text-5xl lg:text-6xl">
                Bawa satu topik. Ajak satu teman.
              </h2>
              <p className="mt-5 max-w-[58ch] text-lg leading-8 text-white/78">
                Room pertama dibatasi dua pemain supaya duel tetap dekat dan hasilnya mudah dibaca.
              </p>
              <Link
                href="/signup"
                className="bg-primary text-primary-foreground relative mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-control)] px-5 text-sm font-bold shadow-[var(--shadow-control)] transition-transform duration-200 ease-[var(--ease-field)] hover:-translate-y-0.5 hover:bg-[var(--primary-hover)]"
              >
                Buat akun
                <Icon name="lucide:arrow-right" aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-border border-t py-8">
        <div className="page-shell flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <KuiskaLogo />
          <p className="text-muted-foreground text-sm">Trivia santai untuk dimainkan bareng.</p>
        </div>
      </footer>
    </div>
  );
}
