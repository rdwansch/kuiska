import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;
const databaseCaCert = process.env.DATABASE_CA_CERT?.replace(/\\n/g, "\n");
const isLocalDatabase = (url: URL) => url.hostname === "localhost" || url.hostname === "127.0.0.1";

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

const database = new URL(databaseUrl);

if (!isLocalDatabase(database) && !databaseCaCert) {
  throw new Error("DATABASE_CA_CERT is not configured for a non-local database");
}

export default defineConfig({
  dialect: "mysql",
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    ...(databaseCaCert
      ? {
          host: database.hostname,
          port: Number(database.port),
          user: decodeURIComponent(database.username),
          password: decodeURIComponent(database.password),
          database: database.pathname.slice(1),
          ssl: {
            ca: databaseCaCert,
            rejectUnauthorized: true,
          },
        }
      : { url: databaseUrl }),
  },
});
