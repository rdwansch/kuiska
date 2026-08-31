# Authentication — Flow

## Implementation status

- **Implemented:** email/password registration, email/password sign-in, username
  validation, Argon2 password hashing, and server-side session lookup.
- **Planned:** forgot-password and reset-password flows. They are documented
  below as a future boundary and do not exist in the current feature code or
  Better Auth configuration.

## UI contract

- `/signin` and `/signup` use the responsive Quiet Arena authentication shell.
- Desktop shows a Match Ticket beside the form; mobile keeps the form as the primary view.
- Interface copy uses casual Indonesian with `kamu`.
- Validation and authentication errors state the problem without exposing internal details.
- The visual implementation lives in `src/features/authentication/components/` and consumes semantic tokens from `src/app/globals.css`.

```ts
// drizzle
// src/lib/db.ts
pool = mysql.createPool({ uri: DATABASE_URL })
db = drizzle(pool, { schema })

// src/lib/db/schema.ts
schema = { user, session, account, verification, jwks }

// src/features/authentication/repositories/AuthenticationRepository.ts
findAuthenticationUserByUsername(username)
  -> db.select().from(user).where(eq(user.username, username))

// drizzle.config.ts
dialect: "mysql"
schema: "./src/lib/db/schema.ts"
out: "./drizzle"
```

```ts
// better-auth
// src/lib/auth.ts
auth = betterAuth({
  database: drizzleAdapter(db, { provider: "mysql", schema }),
  emailAndPassword: {
    enabled: true,
    password: { hash: hashPassword, verify: verifyPassword }, // src/lib/auth-password.ts -> @node-rs/argon2
  },
  user: { additionalFields: { username, displayUsername } },
  plugins: [nextCookies()],
})

// src/lib/auth-password.ts
hashPassword(password) -> argon2.hash(password)
verifyPassword({ hash, password }) -> argon2.verify(hash, password)

// src/app/api/auth/[...all]/route.ts
toNextJsHandler(auth) -> { GET, POST, PATCH, PUT, DELETE }
```

```ts
// implemented application flow
// signUp
UI: AuthenticationSignUp
  -> signUp({ username, name, email, password, confirmPassword })
    -> Zod(AuthenticationSchema)
    -> findAuthenticationUserByUsername()
    -> auth.api.signUpEmail({ name, email, password, username, displayUsername })
    -> redirect("/")

// signIn
UI: AuthenticationSignIn
  -> signIn({ email, password })
    -> Zod(AuthenticationSchema)
    -> auth.api.signInEmail({ email, password })
    -> redirect("/")

// session
auth.api.getSession({ headers: await headers() })
```

## Planned password reset flow

This flow requires Better Auth reset configuration, an email delivery path, UI,
validation, and service functions before it can be marked implemented.

```ts
// planned only
UI: AuthenticationForgotPassword
  -> requestPasswordReset({ email })
    -> auth.api.requestPasswordReset({ email, redirectTo: "/reset-password" })
    -> configured email delivery

URL: /reset-password?token=xxx
UI: AuthenticationResetPassword
  -> resetPassword({ token, password, confirmPassword })
    -> auth.api.resetPassword({ token, newPassword: password })
    -> redirect("/signin")
```
