import type { PublicDiscoveryQuiz } from "../types/PublicDiscoveryType";
import { PublicDiscoveryFeed } from "./PublicDiscoveryFeed";

export function PublicDiscoveryHome({ quizzes }: { quizzes: PublicDiscoveryQuiz[] }) {
  return (
    <main className="page-shell flex-1 pt-6 pb-8 sm:pt-8">
      <PublicDiscoveryFeed quizzes={quizzes} showMatchTicket />
    </main>
  );
}
