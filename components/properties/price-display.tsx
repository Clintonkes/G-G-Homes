import { cn, formatMoney } from "@/lib/utils";

export function PriceDisplay({
  amount,
  currency = "NGN",
  size = "md",
}: {
  amount: number;
  currency?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span className={cn("font-semibold text-brand-gold", size === "sm" && "text-base", size === "md" && "text-xl", size === "lg" && "text-3xl")}>
      {formatMoney(amount, currency)}
    </span>
  );
}
