import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "rounded-full border-2 border-[#f97316] bg-[#f97316] text-[#0a0410] font-heading font-bold tracking-wider hover:bg-[#ea580c] shadow-md",
        destructive:
          "rounded-full border-2 border-[#b91c1c] bg-[#b91c1c] text-white font-heading font-bold tracking-wider hover:bg-[#991b1b] shadow-md",
        outline:
          "rounded-full border-2 border-[#391e60] bg-[#1c0e32] text-white font-heading font-semibold tracking-wider hover:bg-[#2e1750] hover:border-[#f97316] shadow-sm",
        secondary:
          "rounded-full border-2 border-[#43236e] bg-[#251240] text-white font-heading font-semibold tracking-wider hover:bg-[#341858] shadow-sm",
        ghost: "rounded-full text-white hover:bg-[#251240] hover:text-[#f97316]",
        link: "text-[#f97316] font-semibold underline-offset-4 hover:underline",
        lantern:
          "rounded-full border-2 border-[#f97316] bg-[#f97316] text-[#0a0410] font-heading font-bold tracking-[0.16em] uppercase hover:bg-[#ea580c] shadow-md",
        glass:
          "rounded-full border-2 border-[#391e60] bg-[#1c0e32] text-white font-heading font-semibold tracking-[0.12em] uppercase hover:bg-[#2e1750] hover:border-[#f97316] shadow-sm",
      },
      size: {
        default: "h-11 rounded-full px-6 text-sm",
        sm: "h-9 rounded-full px-4 text-xs font-semibold",
        lg: "h-12 rounded-full px-8 text-sm font-bold",
        icon: "h-10 w-10 rounded-full",
        xl: "h-14 rounded-full px-10 text-base font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
