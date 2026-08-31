import Link from "next/link";
import { connection } from "next/server";

import { AuthenticatedAppShell } from "~/components/navigation/AuthenticatedAppShell";
import { KuiskaLogo } from "~/components/brand/KuiskaLogo";
import { getAuthenticationSession } from "~/features/authentication/services/AuthenticationSessionService";
import { GlobalLeaderboardList } from "./components/GlobalLeaderboardList";
import { readGlobalLeaderboardPage } from "./schemas/GlobalLeaderboardSchema";
import { getGlobalLeaderboardPage } from "./services/GlobalLeaderboardService";

export async function GlobalLeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  await connection();

  const params = await searchParams;
  const page = readGlobalLeaderboardPage(params.page);
  const [session, data] = await Promise.all([
    getAuthenticationSession(),
    getGlobalLeaderboardPage(page),
  ]);

  if (session?.user) {
    return (
      <AuthenticatedAppShell user={session.user}>
        <GlobalLeaderboardList data={data} />
      </AuthenticatedAppShell>
    );
  }

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="border-border border-b">
        <div className="page-shell flex min-h-16 items-center justify-between gap-4">
          <Link href="/" aria-label="Kuiska Explore">
            <KuiskaLogo />
          </Link>
          <nav className="flex items-center gap-2" aria-label="Navigasi papan aktivitas">
            <Link
              href="/explore"
              className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center px-3 text-sm font-bold transition-colors"
            >
              Explore
            </Link>
            <Link href="/signin" className="button-link button-link-secondary">
              Masuk
            </Link>
          </nav>
        </div>
      </header>
      <GlobalLeaderboardList data={data} />
    </div>
  );
}

export { GlobalLeaderboardList } from "./components/GlobalLeaderboardList";
export { getGlobalLeaderboardPage } from "./services/GlobalLeaderboardService";
export { readGlobalLeaderboardPage } from "./schemas/GlobalLeaderboardSchema";
