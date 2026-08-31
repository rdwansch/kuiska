import { cn } from "~/utils/cn";

type KuiskaLogoProps = {
  className?: string;
  markClassName?: string;
  compact?: boolean;
  inverted?: boolean;
};

export function KuiskaLogo({
  className,
  markClassName,
  compact = false,
  inverted = false,
}: KuiskaLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        aria-hidden="true"
        className={cn("size-9 shrink-0", markClassName)}
        viewBox="0 0 40 40"
        fill="none"
      >
        <rect
          width="40"
          height="40"
          rx="12"
          fill="currentColor"
          className={inverted ? "text-white" : "text-primary"}
        />
        <path
          d="M13 10.5V29.5M14 20H20.2M20.2 20L28 11.5M20.2 20L28 28.5"
          stroke="currentColor"
          className={inverted ? "text-berry-bright" : "text-primary-foreground"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20.25" cy="20" r="2.6" fill="currentColor" className="text-warning" />
      </svg>
      {compact ? null : (
        <span
          className={cn(
            "font-display text-foreground text-xl font-bold tracking-[-0.03em]",
            inverted && "text-white"
          )}
        >
          kuiska
        </span>
      )}
    </span>
  );
}
