import * as React from "react";
import { cn } from "~/utils/cn";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean };

export function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "text-foreground text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}
      {required ? <span className="ml-1 text-red-500">*</span> : null}
    </label>
  );
}
