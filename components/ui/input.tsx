import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-2xl border border-brand-border bg-white px-4 py-2 text-sm text-brand-dark-text placeholder:text-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-gold/40",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
