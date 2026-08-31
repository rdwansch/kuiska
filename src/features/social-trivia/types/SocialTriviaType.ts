export type SocialTriviaMode = "live_trivia" | "self_paced_race";

export type SocialTriviaPlayer = {
  id: string;
  name: string;
  username: string;
  status: "joined" | "ready" | "playing" | "completed" | "left";
};

export type SocialTriviaRoomSummary = {
  quizId: string;
  inviteCode: string;
  mode: SocialTriviaMode;
  status: "waiting" | "active" | "completed" | "expired";
  title: string;
  description: string;
  category: "technology" | "general" | "entertainment";
  questionCount: number;
  players: SocialTriviaPlayer[];
  isCreator: boolean;
};

export type SocialTriviaQuestion = {
  id: string;
  content: string;
  position: number;
  options: Array<{ id: string; content: string; position: number }>;
};

export type SocialTriviaResult = {
  id: string;
  name: string;
  username: string;
  correctAnswers: number;
  totalAnswerDurationMs: number;
  rank: number;
};

export type SocialTriviaSnapshot =
  | { status: "unauthenticated"; inviteCode: string }
  | { status: "not-found" }
  | { status: "private"; inviteCode: string }
  | { status: "join"; room: SocialTriviaRoomSummary }
  | { status: "full"; room: SocialTriviaRoomSummary }
  | { status: "lobby"; room: SocialTriviaRoomSummary; canStart: boolean }
  | {
      status: "live";
      room: SocialTriviaRoomSummary;
      question: SocialTriviaQuestion;
      selectedOptionId: string | null;
      phase: "answering" | "locked" | "revealing";
      questionEndsAt: string;
      questionRevealEndsAt: string | null;
      revealedAnswers: Array<{
        participantId: string;
        optionId: string;
        isCorrect: boolean;
      }> | null;
      correctOptionId: string | null;
    }
  | {
      status: "race";
      room: SocialTriviaRoomSummary;
      question: SocialTriviaQuestion | null;
      progress: number;
      isComplete: boolean;
      provisionalRank: number | null;
    }
  | { status: "completed"; room: SocialTriviaRoomSummary; results: SocialTriviaResult[] };

export type SocialTriviaActionResult =
  { status: "success"; roomUrl?: string } | { status: "error"; error: string };
