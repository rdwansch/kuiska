import * as React from "react";

import { cn } from "~/utils/cn";

export type BadgeProps = React.HTMLAttributes<HTMLDivElement>;

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "text-destructive inline-flex items-center border px-2.5 py-0.5 text-xs font-medium",
        className
      )}
      role="alert"
      {...props}
    />
  );
}
