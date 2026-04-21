import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-32 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-dark-text placeholder:text-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-gold/40",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
