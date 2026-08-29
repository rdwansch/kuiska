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
        "bg-card text-foreground placeholder:text-muted-foreground flex h-10 w-full rounded-md border px-3.5 py-2 text-sm shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        isInvalid
          ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
          : "border-input focus-visible:ring-ring focus-visible:border-transparent",
        className
      )}
      {...props}
    />
  );
}
