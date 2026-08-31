import * as React from "react";
import { cn } from "~/utils/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean };

export function Input({
  className,
  type,
  invalid,
  "aria-invalid": ariaInvalid,
  ...props
}: InputProps) {
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === "true";
  return (
    <input
      type={type}
      aria-invalid={isInvalid || undefined}
      className={cn(
        "bg-surface-strong text-foreground placeholder:text-muted-foreground disabled:bg-disabled-bg disabled:text-disabled focus-visible:ring-ring focus-visible:ring-offset-background flex h-13 w-full rounded-[var(--radius-control)] border px-4 py-2 text-base transition-[border-color,box-shadow,background-color] duration-200 ease-[var(--ease-field)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed",
        isInvalid
          ? "border-destructive focus-visible:border-destructive"
          : "border-input hover:border-primary/40 focus-visible:border-ring",
        className
      )}
      {...props}
    />
  );
}
