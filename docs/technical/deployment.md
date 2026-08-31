# Deployment Preparation: Vercel + Aiven Free MySQL

## Status and scope

This is the deployment runbook for the current Kuiska stack:

- Next.js 16 App Router on Vercel Functions.
- MySQL 8-compatible database on Aiven.
- Drizzle ORM and committed migrations in `drizzle/`.
- Better Auth email/password sessions.

It prepares a small, non-commercial MVP/demo. It does **not** deploy the
application, create an Aiven service, run a migration, seed data, or change
secrets. Those are operator actions and must happen deliberately.

## Free-plan decision

Use this combination only while Kuiska is a personal, non-commercial MVP or
demo:

- **Vercel Hobby:** $0, but Vercel restricts Hobby to non-commercial personal
  use. A commercial product, paid work, or a deployment intended for financial
  gain needs Vercel Pro or Enterprise.
- **Aiven MySQL Free:** $0 with 1 vCPU, 1 GB RAM, 1 GB total storage, one node,
  no high availability, and no connection pooling. It has no fixed expiry, but
  Aiven may stop an unused service after advance notice. It is suitable for a
  prototype and small workload, not high traffic.

Do not select an Aiven paid plan merely to choose a preferred cloud or region.
The Free plan controls available placement. Confirm `$0/month` before creating
the service.

## Deployment model

```text
Browser
  HTTPS
Vercel project (Next.js Node.js Functions)
  TLS MySQL connection
Aiven MySQL Free service
```

The database connection runs only in server code through `src/lib/db.ts`. Never
put `DATABASE_URL`, the Aiven password, or CA certificate in a variable prefixed
with `NEXT_PUBLIC_`.

Vercel may run more than one warm Function instance. Each instance owns its own
MySQL pool. Aiven Free has no connection-pooling feature, so Kuiska must use a
small application-side pool and must not open a new connection per request.

## Known deployment blockers in current code

The current implementation is correct for a local MySQL URL but is not yet a
safe Aiven deployment configuration:

1. `src/lib/db.ts` creates a `mysql2` pool from `DATABASE_URL` only. It does
   not pass Aiven's CA certificate or explicitly enable certificate-validated
   TLS.
2. The pool allows 10 connections per Vercel Function instance. That is too
   aggressive for a 1 GB free database when concurrent instances exist.
3. `drizzle.config.ts` uses URL-only credentials. In Drizzle Kit 0.31, that
   path passes the URL directly to `mysql2`; it cannot also pass the required
   CA certificate as a `mysql2` SSL option.
4. Better Auth currently has one static `BETTER_AUTH_URL` and the client reads
   `NEXT_PUBLIC_BETTER_AUTH_URL`. This is sufficient for production only. A
   preview deployment needs the optional dynamic-host configuration below.

Complete the required code changes before connecting Vercel to Aiven. Do not
work around certificate validation with `rejectUnauthorized: false`.

## 1. Preflight

Run these checks from repository root before any remote action:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run check
bun run build
git diff --check
git status --short
```

Expected result: the first four commands succeed; `git diff --check` is silent.
`git status --short` may show unrelated work, but do not include it in a
deployment commit accidentally.

The database migration source of truth is the committed `drizzle/` directory
and `drizzle/meta/_journal.json`. Do not regenerate historical migrations for
deployment. Generate a new migration only when the Drizzle schema changes.

Generate the production auth secret locally. Store the output only in the
password manager and Vercel, not in Git, screenshots, terminals shared with
others, or issue comments:

```bash
openssl rand -base64 32
```

Keep this secret stable after users sign up. Replacing it invalidates existing
session/signing state unless Better Auth secret rotation is designed and tested.

## 2. Make database runtime TLS-safe

Download the Aiven **CA Certificate** in step 4, then store its PEM content in
`DATABASE_CA_CERT`. Vercel accepts multiline environment-variable values. If
using an escaped one-line value locally, convert `\\n` back to line breaks.

Replace the pool construction in `src/lib/db.ts` with this shape. Keep the
existing exports and Drizzle setup.

```ts
const databaseUrl = process.env.DATABASE_URL;
const databaseCaCert = process.env.DATABASE_CA_CERT?.replace(/\\n/g, "\n");

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

if (!databaseCaCert) {
  throw new Error("DATABASE_CA_CERT is not configured");
}

export const databasePool =
  globalForDatabase.pool ??
  mysql.createPool({
    uri: databaseUrl,
    connectionLimit: 2,
    ssl: {
      ca: databaseCaCert,
      rejectUnauthorized: true,
    },
  });
```

`connectionLimit: 2` is a conservative starting point for Aiven Free. It is a
per-instance limit, not a global Vercel limit. Measure first before increasing
it. The global cache already prevents duplicate pools during local development;
in production each isolated Function instance still has its own pool.

Add the new key to `.env.example` without any value:

```dotenv
DATABASE_URL=
DATABASE_CA_CERT=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
NEXT_PUBLIC_BETTER_AUTH_URL=
```

## 3. Make Drizzle Kit use verified TLS

For Aiven, use individual `mysql2` credentials in `drizzle.config.ts` instead
of the current URL-only form. This lets Drizzle Kit pass the CA certificate
while running `bun db:migrate`.

```ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const databaseUrl = new URL(process.env.DATABASE_URL ?? "");
const databaseCaCert = process.env.DATABASE_CA_CERT?.replace(/\\n/g, "\n");

if (!databaseCaCert) {
  throw new Error("DATABASE_CA_CERT is not configured");
}

export default defineConfig({
  dialect: "mysql",
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    host: databaseUrl.hostname,
    port: Number(databaseUrl.port),
    user: decodeURIComponent(databaseUrl.username),
    password: decodeURIComponent(databaseUrl.password),
    database: databaseUrl.pathname.slice(1),
    ssl: {
      ca: databaseCaCert,
      rejectUnauthorized: true,
    },
  },
});
```

Use the exact MySQL URI copied from Aiven Console. Do not hand-build it: the
password may contain characters that require URL encoding. The `new URL()` and
`decodeURIComponent()` calls preserve a correctly encoded Aiven URI.

For local-only work before Aiven exists, either keep a separate local Drizzle
configuration or provide a trusted local CA as well. Do not silently loosen TLS
in production code to make a local database work.

## 4. Create the free Aiven MySQL service

1. Create an Aiven account and a project. No card is required for the current
   Free plan.
2. In that project, select **Create service** and choose **MySQL**.
3. Select the **Free** plan. Confirm its price reads `$0/month`. If Free is not
   selectable, stop; do not substitute a paid tier without an explicit budget
   decision.
4. Create the service and wait until status is `RUNNING`.
5. Open the service overview, then record the values under **Connection
   information** in the password manager:
   - MySQL URI
   - host
   - port
   - database name (normally `defaultdb`)
   - username
   - password
6. Download **CA Certificate** from the same area. Treat it as configuration,
   not a public repository file.
7. Keep `defaultdb` for this MVP unless there is a concrete reason to create a
   second database. Creating a second database does not create a second free
   service or increase capacity.

### Verify Aiven before migration

Use MySQL CLI or MySQL Shell with the downloaded certificate. Let the CLI prompt
for the password so it is not stored in shell history.

```bash
mysql \
  --host "<AIVEN_HOST>" \
  --port "<AIVEN_PORT>" \
  --user "<AIVEN_USER>" \
  --password \
  --ssl-mode=VERIFY_CA \
  --ssl-ca "/absolute/path/to/aiven-ca.pem" \
  "<AIVEN_DATABASE>" \
  -e "SELECT VERSION(), CURRENT_USER();"
```

Expected result: one row with MySQL version and current user. A TLS or
certificate error is a stop condition; fix the CA/configuration before running
migrations.

## 5. Apply migrations once, from a controlled machine

Do **not** run `bun db:migrate` as part of Vercel's Build Command. Preview and
production builds can overlap or retry, while schema changes require one
intentional operator action.

On a controlled machine, put the Aiven URI and PEM into a local ignored env file
or export them only for the current terminal. Confirm the target before applying
anything:

```bash
bun db:migrate
```

Drizzle Kit applies the ordered SQL files in `drizzle/` and records them in its
migration journal table. Run it exactly once for a new Aiven database, then
verify tables through Aiven Console or MySQL CLI:

```sql
SHOW TABLES;
SELECT * FROM __drizzle_migrations ORDER BY created_at;
```

Do not run `bun db:seed` against the shared Aiven database without choosing
fixtures intentionally. The current seed command creates Better Auth users and
quiz records; it is development data, not a production bootstrap.

## 6. Configure Better Auth URLs

### Production-only deployment (smallest change)

After Vercel provides the production URL, set both values to its HTTPS origin:

```dotenv
BETTER_AUTH_URL=https://<project>.vercel.app
NEXT_PUBLIC_BETTER_AUTH_URL=https://<project>.vercel.app
```

Use a custom domain instead when it is ready, for example
`https://kuiska.example`. Do not include `/api/auth`; `auth.ts` uses the root
origin and Better Auth keeps its default `/api/auth` base path.

Preview pages can render under this setup, but do not use preview deployments to
test sign-up/sign-in. The client is configured to call the fixed production
origin.

### Optional: enable authenticated Vercel previews

Do this only when previews need working auth. Update `src/lib/auth.ts` so Better
Auth resolves a request-specific allowed host instead of one fixed URL:

```ts
baseURL: {
  allowedHosts: [
    "<project>.vercel.app",
    "*.vercel.app",
  ],
  protocol: process.env.NODE_ENV === "development" ? "http" : "https",
},
```

Then change `src/lib/auth-client.ts` to use same-origin default resolution:

```ts
export const authClient = createAuthClient();
```

With this mode, remove `BETTER_AUTH_URL` and
`NEXT_PUBLIC_BETTER_AUTH_URL` from Vercel Preview variables. Keep local
development covered by adding `localhost:3000` to `allowedHosts`. Verify the
actual generated Vercel host pattern and replace the broad `*.vercel.app`
pattern with a narrower project/team pattern if Vercel provides one.

Do not enable `advanced.trustedProxyHeaders` or a permissive fallback merely to
make a preview work. Better Auth's allowed-host validation should fail closed
for unknown hosts.

## 7. Import repository into Vercel

1. Push the deployment-ready commit to the Git provider connected to Vercel.
2. In Vercel, select **Add New > Project** and import the repository.
3. Confirm the root directory is the Kuiska repository root.
4. Vercel should detect Next.js. Keep Framework Preset as **Next.js**.
5. Because `bun.lock` is committed, use Bun for installation/build if Vercel
   asks for the package manager. Build command is `bun run build`; do not add
   `bun db:migrate`.
6. Before clicking Deploy, enter the Production variables below. Do not paste
   them into source files or Vercel build-command fields.

### Required Vercel Production environment variables

| Variable                      | Value                         | Secret?                         |
| ----------------------------- | ----------------------------- | ------------------------------- |
| `DATABASE_URL`                | Exact Aiven MySQL URI         | Yes                             |
| `DATABASE_CA_CERT`            | Full PEM content from Aiven   | Yes                             |
| `BETTER_AUTH_SECRET`          | One stable high-entropy value | Yes                             |
| `BETTER_AUTH_URL`             | Production HTTPS origin       | No, but configuration-sensitive |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Same production HTTPS origin  | Public by design                |

Select only **Production** for these first values. Do not point a Preview
deployment at the production database while working on schema-changing code.
Add Preview values only after creating a separate preview database or adopting
the intentional authenticated-preview strategy above.

Vercel applies an environment-variable change only to new deployments. Redeploy
after every variable edit.

## 8. First production deployment and smoke check

1. Deploy from the production branch. By default this is `main`; set a different
   production branch explicitly if the repository uses one.
2. Read the Vercel build log. Resolve build/type errors before retrying.
3. Open the deployment URL and load:
   - `/`
   - `/signup`
   - `/signin`
   - `/explore`
4. Create one disposable account, sign out, then sign back in. This verifies
   database reads/writes, Better Auth cookies, and the deployed origin.
5. Create and take a disposable private quiz. Confirm result persistence after a
   page reload.
6. Check Vercel Function logs for database/TLS errors. Check Aiven metrics and
   logs for connection failures or saturation.

Do not call the deployment production-ready merely because `next build`
succeeds. The auth and database smoke checks prove the cross-service boundary.

## 9. Safe operating rules after launch

- **Schema:** generate migration in Git, review SQL, apply a forward-compatible
  migration once before deploying code that requires it, then deploy the code.
  Use expand/contract migrations for breaking changes. Never run destructive
  reset commands on Aiven.
- **Secrets:** rotate only with a written procedure. `BETTER_AUTH_SECRET` is
  session-sensitive. Rotate Aiven user password and update Vercel atomically,
  then redeploy.
- **Backups:** confirm the Aiven Free plan's backup and retention behavior in
  the Console before relying on it. Export important data before risky schema
  changes.
- **Capacity:** watch Aiven storage, RAM, CPU, active connections, and query
  latency. At 1 GB storage/RAM or frequent connection failures, move to a paid
  plan before users are affected.
- **Free-plan inactivity:** keep Aiven notification email monitored. If Aiven
  warns about an unused service, restore/upgrade based on an explicit product
  decision rather than adding fake keep-alive traffic.
- **Commercial launch:** move Vercel from Hobby before Kuiska is used for
  financial gain, paid employment, or commercial operation.

## Troubleshooting

### `DATABASE_URL is not configured`

The Vercel deployment lacks the variable, it was scoped to another environment,
or the deployment predates the variable change. Add it to the correct Vercel
environment and redeploy.

### TLS, certificate, or `self signed certificate` error

Confirm `DATABASE_CA_CERT` contains the complete PEM including begin/end lines,
escaped `\\n` is converted in code, `rejectUnauthorized` remains `true`, and the
certificate belongs to the same Aiven project/service. Do not disable validation.

### `ER_CON_COUNT_ERROR`, timeout, or Aiven connection pressure

Confirm `connectionLimit` remains small, inspect active Vercel instances and
Aiven metrics, then reduce request concurrency or upgrade. Do not raise the pool
limit first.

### Auth origin, CSRF, or redirect failure

Confirm `BETTER_AUTH_URL` and `NEXT_PUBLIC_BETTER_AUTH_URL` exactly match the
HTTPS production origin with no trailing route path. For preview auth, use the
dynamic allowed-host configuration and verify its explicit allowlist.

### A migration works locally but fails on Aiven

First verify the target host/database from the Aiven console, then test the
MySQL CLI command with `VERIFY_CA`. Ensure `drizzle.config.ts` uses individual
credentials plus CA-backed SSL instead of URL-only credentials.

## Primary references

- [Aiven MySQL Free plan](https://aiven.io/pricing/mysql)
- [Aiven free MySQL details](https://aiven.io/free-mysql-database)
- [Aiven MySQL connection information and CA certificate](https://aiven.io/docs/products/mysql/howto/connect-from-mysql-workbench)
- [MySQL2 SSL pool configuration](https://sidorares.github.io/node-mysql2/docs/examples/connections/create-pool)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)
- [Vercel Git deployments](https://vercel.com/docs/git)
- [Vercel Hobby fair-use and commercial-use restriction](https://vercel.com/docs/limits/fair-use-guidelines)
- [Better Auth dynamic base URL](https://better-auth.com/docs/guides/dynamic-base-url)
