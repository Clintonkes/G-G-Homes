import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-3xl border border-brand-border bg-white shadow-sm transition duration-700 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)]", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />;
}
