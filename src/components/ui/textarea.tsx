import * as React from "react";

import { cn } from "~/utils/cn";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "bg-surface-strong text-foreground placeholder:text-muted-foreground focus-visible:ring-ring focus-visible:ring-offset-background border-input hover:border-primary/40 focus-visible:border-ring disabled:bg-disabled-bg disabled:text-disabled aria-invalid:border-destructive min-h-16 w-full resize-y rounded-[var(--radius-control)] border px-4 py-3 text-base leading-6 transition-[border-color,box-shadow,background-color] duration-200 ease-[var(--ease-field)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
