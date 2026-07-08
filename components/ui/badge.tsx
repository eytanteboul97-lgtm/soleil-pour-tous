import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        available: "bg-leaf-500/10 text-leaf-600",
        conditional: "bg-sun-500/10 text-sun-700",
        unavailable: "bg-mist/10 text-mist",
        volt: "bg-volt-500/10 text-volt-600",
      },
    },
    defaultVariants: {
      variant: "available",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
