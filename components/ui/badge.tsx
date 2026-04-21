import { cn } from "@/lib/utils";

export function Badge({ className, children }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-brand-gold/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-brand-gold",
        className
      )}
    >
      {children}
    </span>
  );
}
