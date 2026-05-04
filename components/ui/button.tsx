import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-500 ease-out disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-brand-gold px-5 py-3 text-brand-black hover:bg-brand-gold-dark hover:text-brand-white",
        outline: "border border-brand-gold bg-transparent px-5 py-3 text-brand-gold hover:bg-brand-gold hover:text-brand-black",
        ghost: "px-4 py-2 text-brand-dark-text hover:bg-brand-cream",
        dark: "bg-brand-black px-5 py-3 text-brand-white hover:bg-brand-gold hover:text-brand-black",
      },
      size: {
        default: "h-11",
        sm: "h-9 px-4",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, disabled, isLoading = false, loadingText = "Submitting...", variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || isLoading}
      ref={ref}
      {...props}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {isLoading ? loadingText : children}
    </button>
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
