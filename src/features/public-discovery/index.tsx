import Link from "next/link";
import { connection } from "next/server";

import { AuthenticatedAppShell } from "~/components/navigation/AuthenticatedAppShell";
import { getAuthenticationSession } from "~/features/authentication/services/AuthenticationSessionService";
import { PublicDiscoveryFeed } from "./components/PublicDiscoveryFeed";
import { PublicDiscoveryHome } from "./components/PublicDiscoveryHome";
import { getPublicDiscoveryQuizzes } from "./services/PublicDiscoveryService";

export async function PublicDiscoveryHomePage() {
  const quizzes = await getPublicDiscoveryQuizzes();
  return <PublicDiscoveryHome quizzes={quizzes} />;
}

export async function PublicDiscoveryExplorePage() {
  await connection();
  const [session, quizzes] = await Promise.all([
    getAuthenticationSession(),
    getPublicDiscoveryQuizzes(),
  ]);

  const feed = <PublicDiscoveryFeed quizzes={quizzes} />;

  if (session?.user) {
    return (
      <AuthenticatedAppShell user={session.user}>
        <main className="page-shell flex-1 pt-6 pb-8 sm:pt-8">{feed}</main>
      </AuthenticatedAppShell>
    );
  }

  return (
    <main className="page-shell flex-1 pt-6 pb-8 sm:pt-8">
      <nav className="flex items-center justify-between gap-4" aria-label="Navigasi Explore">
        <Link href="/" className="text-xl font-extrabold tracking-[-0.04em]">
          Kuiska
        </Link>
        <Link href="/quizzes/new" className="button-link button-link-secondary">
          Buat kuis
        </Link>
      </nav>
      {feed}
    </main>
  );
}
