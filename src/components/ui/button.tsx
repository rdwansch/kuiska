import * as React from "react";
import { cn } from "~/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-control)] text-sm font-bold transition-[transform,background-color,border-color,box-shadow] duration-200 ease-[var(--ease-field)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-px";

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-primary text-primary-foreground shadow-[var(--shadow-control)] hover:-translate-y-0.5 hover:bg-[var(--primary-hover)]",
  outline:
    "border border-input bg-surface-strong text-foreground hover:-translate-y-0.5 hover:border-primary/45 hover:bg-surface-berry",
  ghost: "text-foreground hover:bg-muted",
  destructive:
    "bg-destructive text-destructive-foreground hover:-translate-y-0.5 hover:brightness-95",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-11 px-5 py-2",
  sm: "h-9 rounded-lg px-3 text-xs",
  lg: "h-12 px-6 text-[15px]",
  icon: "size-11",
};

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    />
  );
}
