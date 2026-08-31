import { notFound } from "next/navigation";

import { SocialTriviaRoom } from "./components/SocialTriviaRoom";
import { getSocialTriviaSnapshot } from "./services/SocialTriviaService";

export async function SocialTriviaPage({ params }: { params: Promise<{ inviteCode: string }> }) {
  const { inviteCode } = await params;
  const initialState = await getSocialTriviaSnapshot({ inviteCode });

  if (initialState.status === "not-found") notFound();

  return <SocialTriviaRoom initialState={initialState} />;
}
