import type { QuizCreationCategory } from "../types/QuizCreationType";

export function QuizCreationTopicArt({ category }: { category: QuizCreationCategory }) {
  if (category === "technology") {
    return (
      <svg aria-hidden="true" viewBox="0 0 500 220" fill="none" className="h-full w-full">
        <path
          d="M-16 165C77 165 93 61 194 61C297 61 305 168 420 168C456 168 482 143 522 101"
          stroke="var(--info)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <rect x="104" y="36" width="82" height="82" rx="18" fill="var(--surface-strong)" />
        <path d="M131 58H160V100H131Z" fill="var(--lilac)" />
        <circle cx="400" cy="168" r="34" fill="var(--primary)" />
        <circle cx="400" cy="168" r="10" fill="var(--surface-strong)" />
      </svg>
    );
  }

  if (category === "entertainment") {
    return (
      <svg aria-hidden="true" viewBox="0 0 500 220" fill="none" className="h-full w-full">
        <path d="M70 26H210V190H70Z" fill="var(--blue)" />
        <path d="M96 51H184V165H96Z" fill="var(--surface-strong)" />
        <path
          d="M250 206C250 126 310 56 422 42"
          stroke="var(--lilac)"
          strokeWidth="38"
          strokeLinecap="round"
        />
        <circle cx="390" cy="58" r="29" fill="var(--surface-jade)" />
        <circle cx="390" cy="58" r="10" fill="var(--jade)" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 500 220" fill="none" className="h-full w-full">
      <path
        d="M-18 162C58 104 115 194 195 139C276 82 312 22 522 57"
        stroke="var(--primary)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="133" cy="105" r="38" fill="var(--lilac)" />
      <circle cx="133" cy="105" r="12" fill="var(--surface-strong)" />
      <path d="M306 42H443V174H306Z" fill="var(--surface-jade)" />
      <circle cx="375" cy="108" r="27" fill="var(--jade)" />
      <circle cx="375" cy="108" r="9" fill="var(--surface-strong)" />
    </svg>
  );
}
