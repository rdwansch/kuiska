"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { KuiskaLogo } from "~/components/brand/KuiskaLogo";
import { Icon } from "~/components/ui/icon";
import { authClient } from "~/lib/auth-client";
import { cn } from "~/utils/cn";

type AppNavigationProps = {
  user: {
    name: string;
    image?: string | null;
  };
};

const destinations = [
  { href: "/", label: "Explore", icon: "lucide:compass" },
  { href: "/me", label: "Aktivitasku", icon: "lucide:clock-3" },
  { href: "/leaderboard", label: "Papan skor", icon: "lucide:trophy" },
] as const;

function isCurrentPath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" || pathname === "/explore" : pathname.startsWith(href);
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || "Kamu";
}

function initial(name: string) {
  return firstName(name).charAt(0).toUpperCase();
}

export function AppNavigation({ user }: AppNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [accountOpen, setAccountOpen] = useState(false);
  const userFirstName = firstName(user.name);

  async function signOut() {
    await authClient.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <>
      <header className="border-border bg-background/95 sticky top-0 z-30 border-b backdrop-blur-sm">
        <div className="page-shell flex min-h-16 items-center justify-between gap-3">
          <Link href="/" aria-label="Kuiska Explore" className="shrink-0">
            <KuiskaLogo />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi produk">
            {destinations.map((destination) => {
              const current = isCurrentPath(pathname, destination.href);

              return (
                <Link
                  key={destination.href}
                  href={destination.href}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-2 px-3 text-sm font-bold transition-colors",
                    current ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon name={destination.icon} aria-hidden="true" className="size-4" />
                  {destination.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link href="/quizzes/new" className="button-link button-link-secondary">
              <Icon name="lucide:plus" aria-hidden="true" className="size-4" />
              <span className="hidden sm:inline">Buat kuis</span>
              <span className="sm:hidden">Buat</span>
            </Link>

            <div className="relative">
              <button
                type="button"
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                aria-controls="account-navigation-menu"
                onClick={() => setAccountOpen((open) => !open)}
                className="hover:bg-muted focus-visible:ring-ring inline-flex min-h-11 items-center gap-2 px-1.5 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <span className="bg-primary text-primary-foreground inline-flex size-8 items-center justify-center rounded-full text-xs font-extrabold">
                  {initial(user.name)}
                </span>
                <span className="hidden max-w-24 truncate sm:inline">{userFirstName}</span>
                <Icon
                  name="lucide:chevron-down"
                  aria-hidden="true"
                  className="hidden size-4 sm:block"
                />
              </button>

              {accountOpen ? (
                <div
                  id="account-navigation-menu"
                  role="menu"
                  className="border-border bg-surface-strong absolute top-[calc(100%+0.5rem)] right-0 z-40 min-w-48 border p-1 shadow-[var(--shadow-raised)]"
                >
                  <Link
                    href="/me"
                    role="menuitem"
                    className="hover:bg-muted flex min-h-11 items-center gap-2 px-3 text-sm font-bold"
                    onClick={() => setAccountOpen(false)}
                  >
                    <Icon name="lucide:clock-3" aria-hidden="true" className="size-4" />
                    Aktivitasku
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={signOut}
                    className="hover:bg-muted flex min-h-11 w-full items-center gap-2 px-3 text-left text-sm font-bold"
                  >
                    <Icon name="lucide:log-out" aria-hidden="true" className="size-4" />
                    Keluar
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <nav
        className="border-border bg-background/95 fixed inset-x-0 bottom-0 z-30 grid h-16 grid-cols-3 border-t backdrop-blur-sm md:hidden"
        aria-label="Navigasi produk"
      >
        {destinations.map((destination) => {
          const current = isCurrentPath(pathname, destination.href);

          return (
            <Link
              key={destination.href}
              href={destination.href}
              aria-current={current ? "page" : undefined}
              className={cn(
                "inline-flex flex-col items-center justify-center gap-1 text-xs font-bold transition-colors",
                current ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon name={destination.icon} aria-hidden="true" className="size-5" />
              {destination.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
