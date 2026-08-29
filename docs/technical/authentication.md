# Authentication — Flow

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
    sendResetPassword: async ({ user, url, token }) => {},
    resetPasswordTokenExpiresIn: 3600,
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
// e2e
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

// forgotPassword
UI: AuthenticationForgotPassword
  -> requestPasswordReset({ email })
    -> Zod(AuthenticationSchema)
    -> auth.api.requestPasswordReset({ email, redirectTo: "/reset-password" })
    -> sendResetPassword({ user, url, token })

// resetPassword
URL: /reset-password?token=xxx
UI: AuthenticationResetPassword
  -> resetPassword({ token, password, confirmPassword })
    -> Zod(AuthenticationSchema)
    -> auth.api.resetPassword({ token, newPassword: password })
    -> redirect("/signin")

// session
auth.api.getSession({ headers: await headers() })
auth.api.signOut({ headers: await headers() })
```
