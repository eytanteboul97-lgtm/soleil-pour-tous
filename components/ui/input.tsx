import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-xl border bg-white px-4 text-[0.95rem] text-ink placeholder:text-mist/70 transition-colors focus:outline-none focus:ring-2 focus:ring-sun-400/50 focus:border-sun-400 disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-red-400" : "border-line",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
