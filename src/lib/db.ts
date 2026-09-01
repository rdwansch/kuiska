import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./db/schema";

const databaseUrl = process.env.DATABASE_URL;
const databaseCaCert = process.env.DATABASE_CA_CERT?.replace(/\\n/g, "\n");

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

const databaseHost = new URL(databaseUrl).hostname;
const isLocalDatabase = databaseHost === "localhost" || databaseHost === "127.0.0.1";

if (!isLocalDatabase && !databaseCaCert) {
  throw new Error("DATABASE_CA_CERT is not configured");
}

const globalForDatabase = globalThis as unknown as {
  pool?: mysql.Pool;
};

export const databasePool =
  globalForDatabase.pool ??
  mysql.createPool({
    uri: databaseUrl,
    connectionLimit: 2,
    ...(databaseCaCert
      ? {
          ssl: {
            ca: databaseCaCert,
            rejectUnauthorized: true,
          },
        }
      : {}),
  });

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.pool = databasePool;
}

export const db = drizzle(databasePool, { schema, mode: "default" });
