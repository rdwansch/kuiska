import { NextResponse } from "next/server";

import { getSocialTriviaSnapshot } from "~/features/social-trivia/services/SocialTriviaService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ inviteCode: string }> }
) {
  const { inviteCode } = await params;
  const snapshot = await getSocialTriviaSnapshot({
    inviteCode,
    secretCode: request.headers.get("x-kuiska-room-code") ?? undefined,
  });

  return NextResponse.json(snapshot, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
