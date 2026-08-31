import type { Metadata } from "next";

import { AuthenticationSignIn } from "~/features/authentication";

export const metadata: Metadata = {
  title: "Masuk",
};

export default function SignInPage() {
  return <AuthenticationSignIn />;
}
