import { cn } from "~/utils/cn";
import type { PublicDiscoveryQuiz } from "../types/PublicDiscoveryType";

export function PublicDiscoveryCover({
  category,
  title,
  className,
}: Pick<PublicDiscoveryQuiz, "category" | "title"> & { className?: string }) {
  const titleOffset =
    Array.from(title).reduce((total, character) => total + (character.codePointAt(0) ?? 0), 0) % 56;
  const visual =
    category === "technology" ? (
      <svg
        viewBox="0 0 520 300"
        fill="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M-18 214C95 214 104 76 210 76C316 76 303 221 428 221C472 221 497 186 540 145"
          stroke="var(--info)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <g transform={`translate(${titleOffset - 28} 0)`}>
          <rect x="139" y="40" width="92" height="92" rx="22" fill="var(--surface-strong)" />
          <path d="M171 64H202V110H171Z" fill="var(--lilac)" />
          <circle cx="425" cy="221" r="39" fill="var(--primary)" />
          <circle cx="425" cy="221" r="12" fill="var(--surface-strong)" />
        </g>
      </svg>
    ) : category === "entertainment" ? (
      <svg
        viewBox="0 0 520 300"
        fill="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      >
        <g transform={`translate(${titleOffset - 28} 0)`}>
          <path d="M60 30H220V242H60Z" fill="var(--blue)" />
          <path d="M95 64H190V208H95Z" fill="var(--surface-strong)" />
        </g>
        <path
          d="M260 268C260 162 325 78 438 58"
          stroke="var(--lilac)"
          strokeWidth="42"
          strokeLinecap="round"
        />
        <circle cx={404 + titleOffset - 28} cy="81" r="35" fill="var(--surface-jade)" />
      </svg>
    ) : (
      <svg
        viewBox="0 0 520 300"
        fill="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M-22 238C90 166 173 277 284 202C377 140 393 59 540 82"
          stroke="var(--primary)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx={172 + titleOffset - 28} cy="145" r="48" fill="var(--lilac)" />
        <circle cx={172 + titleOffset - 28} cy="145" r="16" fill="var(--surface-strong)" />
        <path d="M345 59H470V184H345Z" fill="var(--surface-jade)" />
        <path d="M371 84H445V159H371Z" fill="var(--jade)" />
      </svg>
    );

  const surfaceClass =
    category === "technology"
      ? "bg-surface-blue"
      : category === "entertainment"
        ? "bg-surface-lilac"
        : "bg-surface-neutral";

  return (
    <div className={cn("relative min-h-48 overflow-hidden", surfaceClass, className)}>{visual}</div>
  );
}
