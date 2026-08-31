import { redirect } from "next/navigation";

import { QuizCreationForm } from "./components/QuizCreationForm";
import { getQuizCreationAccess } from "./services/QuizCreationService";

export async function QuizCreationPage() {
  const userId = await getQuizCreationAccess();
  if (!userId) redirect("/signin");

  return <QuizCreationForm />;
}
