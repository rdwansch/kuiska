import { redirect } from "next/navigation";

import { AuthenticatedAppShell } from "~/components/navigation/AuthenticatedAppShell";
import { getAuthenticationSession } from "~/features/authentication/services/AuthenticationSessionService";
import { QuizCreationForm } from "./components/QuizCreationForm";
import { getQuizCreationAccess } from "./services/QuizCreationService";

export async function QuizCreationPage() {
  const [userId, session] = await Promise.all([
    getQuizCreationAccess(),
    getAuthenticationSession(),
  ]);
  if (!userId || !session?.user) redirect("/signin");

  return (
    <AuthenticatedAppShell user={session.user}>
      <QuizCreationForm />
    </AuthenticatedAppShell>
  );
}
