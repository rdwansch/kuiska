import { z } from "zod";

export const globalLeaderboardPageSize = 20;
export const globalLeaderboardMaxPage = 100;

const globalLeaderboardPageValueSchema = z
  .string()
  .regex(/^[1-9]\d*$/)
  .transform(Number)
  .refine(Number.isSafeInteger)
  .refine((page) => page <= globalLeaderboardMaxPage);

export function readGlobalLeaderboardPage(value: string | string[] | undefined): number {
  if (Array.isArray(value)) return 1;

  return globalLeaderboardPageValueSchema.catch(1).parse(value ?? "1");
}
