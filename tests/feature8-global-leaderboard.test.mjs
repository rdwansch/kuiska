import { describe, expect, mock, test } from "bun:test";

const root = `${import.meta.dir}/..`;
const source = (path) => `${root}/src/${path}`;

mock.module("server-only", () => ({}));

let leaderboardRows = [];
const findGlobalLeaderboardEntries = mock(async () => leaderboardRows);
mock.module(
  source("features/global-leaderboard/repositories/GlobalLeaderboardRepository.ts"),
  () => ({ findGlobalLeaderboardEntries })
);

const service = await import(
  source("features/global-leaderboard/services/GlobalLeaderboardService.ts")
);
const schema = await import(
  source("features/global-leaderboard/schemas/GlobalLeaderboardSchema.ts")
);

describe("Feature 8: global leaderboard", () => {
  test("defaults malformed, repeated, unsafe, and capped pages to page one", () => {
    expect(schema.readGlobalLeaderboardPage(undefined)).toBe(1);
    expect(schema.readGlobalLeaderboardPage("0")).toBe(1);
    expect(schema.readGlobalLeaderboardPage("101")).toBe(1);
    expect(schema.readGlobalLeaderboardPage("not-a-page")).toBe(1);
    expect(schema.readGlobalLeaderboardPage(["2", "3"])).toBe(1);
    expect(schema.readGlobalLeaderboardPage("4")).toBe(4);
  });

  test("trims the sentinel row and calculates absolute ranks", async () => {
    leaderboardRows = Array.from({ length: 21 }, (_, index) => ({
      userId: `user-${index}`,
      username: `player-${index}`,
      completedCount: 4,
      averageScore: index === 0 ? 90 : 70,
    }));

    const result = await service.getGlobalLeaderboardPage(2);

    expect(findGlobalLeaderboardEntries).toHaveBeenLastCalledWith(20, 21);
    expect(result.entries).toHaveLength(20);
    expect(result.entries[0]).toEqual({
      rank: 21,
      username: "player-0",
      completedCount: 4,
      averageScore: 90,
    });
    expect(result.entries[0]).not.toHaveProperty("userId");
    expect(result.hasNext).toBe(true);
  });

  test("keeps repository order when tied counts have different average scores", async () => {
    leaderboardRows = [
      { userId: "user-a", username: "alpha", completedCount: 3, averageScore: 40 },
      { userId: "user-b", username: "bravo", completedCount: 3, averageScore: 95 },
    ];

    const result = await service.getGlobalLeaderboardPage(1);

    expect(result.entries.map((entry) => entry.username)).toEqual(["alpha", "bravo"]);
    expect(result.entries.map((entry) => entry.rank)).toEqual([1, 2]);
  });
});
