import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AuthShell({
  title,
  eyebrow,
  description,
  ctaHref,
  ctaLabel,
  children,
}: {
  title: string;
  eyebrow: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center px-4 pb-12 pt-28 md:px-6">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1fr_520px]">
        <section className="rounded-[2rem] border border-brand-gold/15 bg-white/5 p-8 text-brand-white backdrop-blur-md md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">{eyebrow}</p>
          <h1 className="mt-5 max-w-xl text-4xl md:text-6xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-brand-white/78">{description}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href={ctaHref}>
              <Button variant="outline" className="gap-2">
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/properties">
              <Button variant="dark">Browse Properties</Button>
            </Link>
          </div>
        </section>
        <div className="rounded-[2rem] border border-brand-gold/15 bg-white p-2 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          {children}
        </div>
      </div>
    </main>
  );
}
