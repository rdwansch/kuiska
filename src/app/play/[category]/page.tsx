import { RandomQuizPage } from "~/features/random-quiz";

export default function Page({ params }: { params: Promise<{ category: string }> }) {
  return <RandomQuizPage params={params} />;
}
