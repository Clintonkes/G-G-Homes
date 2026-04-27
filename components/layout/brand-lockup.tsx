import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function BrandLockup({
  className,
  markWidth = 42,
  titleClassName,
  subtitleClassName,
  subtitle = "Where Every Home Tells a Story",
}: {
  className?: string;
  markWidth?: number;
  titleClassName?: string;
  subtitleClassName?: string;
  subtitle?: string;
}) {
  const markHeight = Math.round((markWidth * 960) / 1017);

  return (
    <Link href="/" className={cn("inline-flex items-center gap-3", className)}>
      <Image
        src="/gghomes-mark.png"
        alt="G & G Homes"
        width={markWidth}
        height={markHeight}
        className="h-auto"
        priority
      />
      <span className="flex flex-col">
        <span className={cn("text-lg font-bold text-brand-white md:text-xl", titleClassName)}>G &amp; G Homes</span>
        <span className={cn("text-xs text-brand-white/70", subtitleClassName)}>{subtitle}</span>
      </span>
    </Link>
  );
}
