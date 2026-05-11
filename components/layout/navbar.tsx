"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { BrandLockup } from "@/components/layout/brand-lockup";
import { Button } from "@/components/ui/button";
import { SectionLink } from "@/components/marketing/section-link";
import { cn } from "@/lib/utils";
import { useScrollPosition } from "@/hooks/use-scroll-position";

const links = [
  { href: "/landlords", label: "For Landlords" },
  { href: "/pricing", label: "Pricing" },
  { href: "/login", label: "Login" },
];

export function Navbar() {
  const scrolled = useScrollPosition();
  const [open, setOpen] = useState(false);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-40 transition-all", scrolled ? "bg-brand-black/95 backdrop-blur" : "bg-transparent")}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <BrandLockup markWidth={44} />

        <nav className="hidden items-center gap-6 md:flex">
          <SectionLink sectionId="how-it-works" className="text-sm font-medium text-brand-white transition hover:text-brand-gold">
            How It Works
          </SectionLink>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-brand-white transition hover:text-brand-gold">
              {link.label}
            </Link>
          ))}
          <Link href="/register">
            <Button variant="outline">Get Started</Button>
          </Link>
        </nav>

        <button
          className="rounded-full border border-brand-gold/40 bg-brand-black/60 p-2 text-brand-white md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-brand-black/85 backdrop-blur-sm md:hidden">
          <div className="flex min-h-screen flex-col bg-brand-black px-6 py-6">
            <div className="flex items-center justify-between">
              <BrandLockup markWidth={40} />
              <button
                type="button"
                aria-label="Close menu"
                className="rounded-full border border-brand-gold/40 bg-brand-black/60 p-2 text-brand-white"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-10 flex flex-col">
              <SectionLink sectionId="how-it-works" className="border-b border-brand-gold/20 py-4 text-2xl font-semibold text-brand-white" onNavigate={() => setOpen(false)}>
                How It Works
              </SectionLink>
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="border-b border-brand-gold/20 py-4 text-2xl font-semibold text-brand-white" onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <Link href="/register" onClick={() => setOpen(false)} className="mt-8">
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
