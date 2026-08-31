import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";

import { AuthenticatedAppShell } from "~/components/navigation/AuthenticatedAppShell";
import { getAuthenticationSession } from "~/features/authentication/services/AuthenticationSessionService";
import { RandomQuizEmptyState } from "./components/RandomQuizEmptyState";
import { getRandomQuizForCategory } from "./services/RandomQuizService";
import { randomQuizCategorySchema } from "./schemas/RandomQuizSchema";

export async function RandomQuizPage({ params }: { params: Promise<{ category: string }> }) {
  await connection();

  const { category } = await params;

  const parsed = randomQuizCategorySchema.safeParse(category);
  if (!parsed.success) notFound();

  const result = await getRandomQuizForCategory(parsed.data);

  if (result.status === "redirect") {
    redirect(`/quizzes/${result.quizId}`);
  }

  const session = await getAuthenticationSession();
  const emptyState = <RandomQuizEmptyState category={result.category} />;

  if (session?.user) {
    return (
      <AuthenticatedAppShell user={session.user}>
        <main className="page-shell flex-1 pt-6 pb-8 sm:pt-8">{emptyState}</main>
      </AuthenticatedAppShell>
    );
  }

  return <main className="page-shell flex-1 pt-6 pb-8 sm:pt-8">{emptyState}</main>;
}

export { RandomQuizCategoryActions } from "./components/RandomQuizCategoryActions";
