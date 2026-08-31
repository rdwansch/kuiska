export type GlobalLeaderboardEntry = {
  rank: number;
  username: string;
  completedCount: number;
  averageScore: number;
};

export type GlobalLeaderboardPage = {
  entries: GlobalLeaderboardEntry[];
  page: number;
  hasNext: boolean;
};
