import type { Metadata } from "next";

import { AuthenticationShell } from "~/features/authentication";

export const metadata: Metadata = {
  title: "Akun",
  description: "Masuk atau buat akun Kuiska untuk menyimpan skor dan bergabung ke room.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthenticationShell>{children}</AuthenticationShell>;
}
