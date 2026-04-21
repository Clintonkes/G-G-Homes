import { cn, formatNaira } from "@/lib/utils";

export function PriceDisplay({ amount, size = "md" }: { amount: number; size?: "sm" | "md" | "lg" }) {
  return (
    <span className={cn("font-semibold text-brand-gold", size === "sm" && "text-base", size === "md" && "text-xl", size === "lg" && "text-3xl")}>
      {formatNaira(amount)}
    </span>
  );
}
