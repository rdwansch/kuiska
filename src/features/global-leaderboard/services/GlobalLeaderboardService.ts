import "server-only";

import { findGlobalLeaderboardEntries } from "../repositories/GlobalLeaderboardRepository";
import {
  globalLeaderboardMaxPage,
  globalLeaderboardPageSize,
  readGlobalLeaderboardPage,
} from "../schemas/GlobalLeaderboardSchema";
import type { GlobalLeaderboardPage } from "../types/GlobalLeaderboardType";

export async function getGlobalLeaderboardPage(page: number): Promise<GlobalLeaderboardPage> {
  const currentPage = readGlobalLeaderboardPage(String(page));
  const offset = (currentPage - 1) * globalLeaderboardPageSize;
  const rows = await findGlobalLeaderboardEntries(offset, globalLeaderboardPageSize + 1);

  return {
    entries: rows.slice(0, globalLeaderboardPageSize).map((row, index) => ({
      rank: offset + index + 1,
      username: row.username,
      completedCount: Number(row.completedCount),
      averageScore: Math.round(Number(row.averageScore)),
    })),
    page: currentPage,
    hasNext: rows.length > globalLeaderboardPageSize && currentPage < globalLeaderboardMaxPage,
  };
}
