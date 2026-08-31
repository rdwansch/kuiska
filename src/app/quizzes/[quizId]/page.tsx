import { QuizTakingPage } from "~/features/quiz-taking";

export default function Page({ params }: { params: Promise<{ quizId: string }> }) {
  return <QuizTakingPage params={params} />;
}
