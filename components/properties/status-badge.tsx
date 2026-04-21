import { Badge } from "@/components/ui/badge";

export function StatusBadge({ value }: { value: string }) {
  const styles: Record<string, string> = {
    ACTIVE: "border-brand-green/30 text-brand-green",
    RENTED: "border-brand-green/30 text-brand-green",
    PENDING_VERIFICATION: "border-brand-gold/40 text-brand-gold",
    DRAFT: "border-brand-gray/30 text-brand-gray",
    INACTIVE: "border-brand-red/30 text-brand-red",
    PENDING: "border-brand-gold/40 text-brand-gold",
    CONFIRMED: "border-brand-green/30 text-brand-green",
    CANCELLED: "border-brand-red/30 text-brand-red",
    COMPLETED: "border-brand-green/30 text-brand-green",
    SUCCESS: "border-brand-green/30 text-brand-green",
    FAILED: "border-brand-red/30 text-brand-red",
  };

  return <Badge className={styles[value] ?? ""}>{value.replaceAll("_", " ")}</Badge>;
}
