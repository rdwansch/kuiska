export type PublicDiscoveryReviewStatus = "not_requested" | "pending" | "approved" | "rejected";

export type PublicDiscoveryQuiz = {
  id: string;
  title: string;
  description: string;
  category: "technology" | "general" | "entertainment";
  questionCount: number;
  creatorName: string;
  creatorUsername: string;
};

export type PublicDiscoveryReviewActionResult =
  { status: "success" } | { status: "error"; error: string };
