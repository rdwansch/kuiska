import { getAuthenticationSession } from "~/features/authentication/services/AuthenticationSessionService";
import { LandingPage } from "~/features/landing";
import { PublicDiscoveryHomePage } from "~/features/public-discovery";

export default async function Page() {
  const session = await getAuthenticationSession();

  console.log('session', session)
  if (!session?.user) {
    return <LandingPage />;
  } else {
    return <PublicDiscoveryHomePage />;
  }
}
