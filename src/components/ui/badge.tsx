import * as React from "react";

import { cn } from "~/utils/cn";

export type BadgeProps = React.HTMLAttributes<HTMLDivElement>;

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "text-destructive bg-incorrect-muted inline-flex items-center rounded-[var(--radius-label)] border border-current/20 px-3 py-2 text-sm font-semibold",
        className
      )}
      {...props}
    />
  );
}
