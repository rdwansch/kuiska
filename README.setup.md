# Local Setup

The project uses a local MySQL database named `kuiska`.

1. Create the database:

   ```sql
   CREATE DATABASE kuiska;
   ```

2. Copy `.env.example` to `.env` and update `DATABASE_URL` with your local MySQL credentials.
3. Set `BETTER_AUTH_SECRET` to a long random value.
4. Start the app with `bun dev`.

The shadcn/ui configuration is in `components.json`; generated components are placed in `src/components/ui`.

Database commands:

- `bun db:generate` creates a migration from the Drizzle schema.
- `bun db:migrate` applies migrations to the configured database.
- `bun db:studio` opens Drizzle Studio.
- `bun db:reset` removes the generated migration output.
