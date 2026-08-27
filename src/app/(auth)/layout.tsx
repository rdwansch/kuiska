export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-[420px]">{children}</div>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        For students and teachers • Private quizzes use a secret code
      </p>
    </main>
  );
}
