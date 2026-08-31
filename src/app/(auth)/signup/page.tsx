import type { Metadata } from "next";

import { AuthenticationSignUp } from "~/features/authentication";

export const metadata: Metadata = {
  title: "Buat akun",
};

export default function SignUpPage() {
  return <AuthenticationSignUp />;
}
