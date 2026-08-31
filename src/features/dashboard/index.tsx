import { redirect } from "next/navigation";

import { AuthenticatedAppShell } from "~/components/navigation/AuthenticatedAppShell";
import { getAuthenticationSession } from "~/features/authentication/services/AuthenticationSessionService";
import { DashboardPage } from "./components/DashboardPage";
import { getDashboardData, readDashboardPage } from "./services/DashboardService";

export async function DashboardHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ quizPage?: string | string[]; attemptPage?: string | string[] }>;
}) {
  const params = await searchParams;
  const data = await getDashboardData({
    quizPage: readDashboardPage(params.quizPage),
    attemptPage: readDashboardPage(params.attemptPage),
  });

  if (!data) redirect("/signin");

  const session = await getAuthenticationSession();
  if (!session?.user) redirect("/signin");

  return (
    <AuthenticatedAppShell user={session.user}>
      <DashboardPage data={data} />
    </AuthenticatedAppShell>
  );
}
