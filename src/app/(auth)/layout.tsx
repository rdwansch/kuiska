export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background flex min-h-[100dvh] flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px]">{children}</div>
      <p className="text-muted-foreground mt-8 text-center text-xs">
        For students and teachers • Private quizzes use a secret code
      </p>
    </main>
  );
}
