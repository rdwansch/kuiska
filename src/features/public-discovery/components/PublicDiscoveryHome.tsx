import Link from "next/link";

import { Icon } from "~/components/ui/icon";
import type { PublicDiscoveryQuiz } from "../types/PublicDiscoveryType";
import { PublicDiscoveryFeed } from "./PublicDiscoveryFeed";

export function PublicDiscoveryHome({ quizzes }: { quizzes: PublicDiscoveryQuiz[] }) {
  return (
    <main className="page-shell flex-1 pt-6 pb-8 sm:pt-8">
      <nav className="flex items-center justify-between gap-4" aria-label="Navigasi utama">
        <Link href="/" className="text-xl font-extrabold tracking-[-0.04em]">
          Kuiska
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/me"
            className="text-foreground hover:text-primary inline-flex min-h-11 items-center gap-2 px-2 text-sm font-bold transition-colors"
          >
            <Icon name="lucide:clock-3" aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">Aktivitasku</span>
          </Link>
          <Link href="/quizzes/new" className="button-link button-link-secondary">
            Buat kuis
          </Link>
        </div>
      </nav>
      <PublicDiscoveryFeed quizzes={quizzes} showMatchTicket />
    </main>
  );
}
