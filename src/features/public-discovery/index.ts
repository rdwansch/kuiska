import { createElement } from "react";

import Link from "next/link";
import { connection } from "next/server";

import { getAuthenticationSession } from "~/features/authentication/services/AuthenticationSessionService";
import { LandingPage } from "~/features/landing";
import { PublicDiscoveryFeed } from "./components/PublicDiscoveryFeed";
import { PublicDiscoveryHome } from "./components/PublicDiscoveryHome";
import { getPublicDiscoveryQuizzes } from "./services/PublicDiscoveryService";

export async function PublicDiscoveryHomePage() {
  const session = await getAuthenticationSession();

  if (!session?.user) {
    return createElement(LandingPage);
  }

  const quizzes = await getPublicDiscoveryQuizzes();
  return createElement(PublicDiscoveryHome, { quizzes });
}

export async function PublicDiscoveryExplorePage() {
  await connection();
  const quizzes = await getPublicDiscoveryQuizzes();

  return createElement(
    "main",
    { className: "page-shell flex-1 pb-8 pt-6 sm:pt-8" },
    createElement(
      "nav",
      { className: "flex items-center justify-between gap-4", "aria-label": "Navigasi Explore" },
      createElement(
        Link,
        { href: "/", className: "text-xl font-extrabold tracking-[-0.04em]" },
        "Kuiska"
      ),
      createElement(
        Link,
        { href: "/quizzes/new", className: "button-link button-link-secondary" },
        "Buat kuis"
      )
    ),
    createElement(PublicDiscoveryFeed, { quizzes })
  );
}
