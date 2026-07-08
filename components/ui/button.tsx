"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-display font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        sun: "bg-gradient-to-r from-sun-400 to-sun-600 text-white shadow-glow hover:shadow-[0_0_100px_-15px_rgba(255,138,30,0.7)] hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border border-line bg-white/70 text-ink hover:bg-white hover:-translate-y-0.5",
        ghost: "text-ink hover:bg-ink/5",
        "ghost-light": "text-white hover:bg-white/10",
        volt: "bg-gradient-to-r from-volt-400 to-volt-600 text-night shadow-glow-volt hover:-translate-y-0.5",
      },
      size: {
        default: "h-12 px-6 text-[0.95rem]",
        lg: "h-14 px-8 text-base",
        sm: "h-10 px-4 text-sm",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "sun",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
