"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { SectionLink } from "@/components/marketing/section-link";
import { cn } from "@/lib/utils";
import { useScrollPosition } from "@/hooks/use-scroll-position";

const links = [
  { href: "/properties", label: "Properties" },
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
        <Link href="/" className="flex flex-col">
          <span className="text-lg font-bold text-brand-gold md:text-xl">RentEase</span>
          <span className="text-xs text-brand-white/70">by G &amp; G Homes</span>
        </Link>

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

        <button className="rounded-full border border-brand-gold/40 p-2 text-brand-white md:hidden" onClick={() => setOpen((value) => !value)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-30 flex flex-col bg-brand-black px-6 py-24 md:hidden">
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
      ) : null}
    </header>
  );
}
