import Link from "next/link";
import { ArrowRight, Check, ChevronRight, ShieldCheck, Sparkles } from "lucide-react";

import { CountUpStat } from "@/components/marketing/count-up-stat";
import { HomeScrollTarget } from "@/components/marketing/home-scroll-target";
import { IntroShowcase } from "@/components/marketing/intro-showcase";
import { Reveal } from "@/components/marketing/reveal";
import { SectionLink } from "@/components/marketing/section-link";
import { PropertyCard } from "@/components/properties/property-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/marketing/section-heading";
import { fetchProperties } from "@/lib/api";

const stats = [
  { value: 500, suffix: "+", label: "Properties Listed" },
  { value: 1200, suffix: "+", label: "Happy Clients" },
  { value: 0, prefix: "₦", label: "Agent Fees" },
  { value: 13, label: "LGAs Covered" },
];

export default async function HomePage() {
  const featured = await fetchProperties("?page_size=6").catch(() => ({ items: [], total: 0, page: 1, page_size: 6 }));

  return (
    <main>
      <IntroShowcase />
      <HomeScrollTarget />

      <section className="relative flex min-h-screen items-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1800&q=80&auto=format&fit=crop')] bg-cover bg-center opacity-45" />
        <div className="absolute inset-0 bg-brand-black/55" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-28 md:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <Reveal className="text-brand-white">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold">Ebonyi State · Nigeria · Zero Agent Fees</p>
            <h1 className="mt-6 max-w-4xl">Find Your Perfect Home with RentEase by G &amp; G Homes.</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-brand-white/80">
              Browse verified properties, schedule inspections, pay securely, and manage your rental journey from one unified account built for both tenants and landlords.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/properties"><Button size="lg">Browse Properties</Button></Link>
              <Link href="/register"><Button variant="outline" size="lg">Create Your Account</Button></Link>
              <SectionLink sectionId="how-it-works" className="inline-flex items-center justify-center rounded-full border border-brand-white/20 px-6 py-3 text-sm font-semibold text-brand-white transition hover:border-brand-gold hover:text-brand-gold">
                See How It Works
              </SectionLink>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="interactive-panel overflow-hidden bg-brand-black/55 p-3 text-brand-white">
              <div className="rounded-[1.5rem] border border-brand-gold/20 bg-brand-black/55 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-brand-gold">Featured Intro Slide</p>
                    <h3 className="mt-3 text-brand-white">G &amp; G Properties Collection</h3>
                  </div>
                  <Sparkles className="h-5 w-5 text-brand-gold" />
                </div>
                <div className="mt-6 overflow-hidden rounded-[1.5rem]">
                  <div
                    className="min-h-[300px] bg-cover bg-center transition duration-500 hover:scale-105"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1400&q=80&auto=format&fit=crop')" }}
                  />
                </div>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-brand-white/70">Premium homes with inspection-ready detail, clear pricing, and direct landlord access.</p>
                  </div>
                  <Link href="/properties" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold">
                    Open Listings
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-4 md:px-6">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08}>
              <CountUpStat {...stat} />
            </Reveal>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Reveal>
            <SectionHeading label="How RentEase Works" title="From Search to Move-In in 4 Steps" invert />
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-4">
            {[
              ["1", "Search", "Browse verified listings filtered by location, budget, and property type."],
              ["2", "View", "See photos, videos, amenities, and location details before requesting inspection."],
              ["3", "Inspect", "Book a physical inspection directly from each listing page using your account."],
              ["4", "Pay", "Complete secure Flutterwave payments and keep receipts, reminders, and updates in your dashboard."],
            ].map(([number, title, copy], index) => (
              <Reveal key={title} delay={index * 0.08}>
              <Card className="interactive-panel border-t-4 border-t-brand-gold bg-white">
                <CardContent className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold text-lg font-bold text-brand-black">{number}</div>
                  <h3>{title}</h3>
                  <p className="text-sm leading-7 text-brand-gray">{copy}</p>
                </CardContent>
              </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Reveal>
            <SectionHeading label="Featured Properties" title="Handpicked Properties Across Ebonyi State" />
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {featured.items.map((property, index) => (
              <Reveal key={property.id} delay={index * 0.08}>
                <PropertyCard property={property} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 md:px-6">
          <Reveal>
            <SectionHeading label="For Landlords" title="Are You a Landlord?" body="List your property on RentEase and connect directly with verified tenants. No middlemen. No agent commissions. Full control." invert />
            <Link href="/register" className="mt-8 inline-block">
              <Button>List Your Property Free</Button>
            </Link>
          </Reveal>
          <Reveal delay={0.12}>
          <Card className="interactive-panel border-brand-gold/30 bg-brand-black text-brand-white">
            <CardContent className="space-y-5 text-brand-white">
              {[
                "Free listing setup",
                "Professional photo guidelines",
                "Tenant verification support",
                "Rent payment processing",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-brand-gold" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Reveal>
            <SectionHeading label="Why This System Works" title="A full web platform that preserves the WhatsApp-native speed of the original workflow." invert />
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              ["Verified marketplace", "Every public listing goes live only after internal review and landlord verification."],
              ["Unified dashboard", "One account lets users search, save, book inspections, list properties, and track rent payments."],
              ["AI-ready operations", "The backend includes an AI service layer for listing polish, support copilots, and smarter search once OpenAI keys are added."],
            ].map(([title, copy], index) => (
              <Reveal key={title} delay={index * 0.08}>
              <Card className="interactive-panel bg-white">
                <CardContent className="space-y-4">
                  <ShieldCheck className="h-8 w-8 text-brand-gold" />
                  <h3>{title}</h3>
                  <p className="text-sm leading-7 text-brand-gray">{copy}</p>
                </CardContent>
              </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-gold py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 md:flex-row md:items-center md:px-6">
          <div>
            <h3 className="text-brand-black">Get Notified When New Properties Are Listed</h3>
            <p className="mt-1 text-sm text-brand-black/80">Join the waitlist for fresh verified rentals across Ebonyi State.</p>
          </div>
          <Link href="/register">
            <Button variant="dark" className="gap-2">Create an account <ChevronRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
