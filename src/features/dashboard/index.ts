import { createElement } from "react";

import { redirect } from "next/navigation";

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

  return createElement(DashboardPage, { data });
}
