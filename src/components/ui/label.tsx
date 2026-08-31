import * as React from "react";
import { cn } from "~/utils/cn";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean };

export function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "text-foreground text-sm leading-none font-semibold peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}
      {required ? <span className="text-destructive ml-1">*</span> : null}
    </label>
  );
}
