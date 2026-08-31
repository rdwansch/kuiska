import "server-only";

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./db/schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

const globalForDatabase = globalThis as unknown as {
  pool?: mysql.Pool;
};

export const databasePool =
  globalForDatabase.pool ??
  mysql.createPool({
    uri: databaseUrl,
    connectionLimit: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.pool = databasePool;
}

export const db = drizzle(databasePool, { schema, mode: "default" });
