import { GlobalLeaderboardPage } from "~/features/global-leaderboard";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  return <GlobalLeaderboardPage searchParams={searchParams} />;
}
