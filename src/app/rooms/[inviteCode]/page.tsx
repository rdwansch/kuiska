import { SocialTriviaPage } from "~/features/social-trivia";

export default function Page({ params }: { params: Promise<{ inviteCode: string }> }) {
  return <SocialTriviaPage params={params} />;
}
