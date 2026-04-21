import Link from "next/link";
import { Check, ChevronRight, ShieldCheck } from "lucide-react";

import { PropertyCard } from "@/components/properties/property-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/marketing/section-heading";
import { fetchProperties } from "@/lib/api";

const stats = [
  ["500+", "Properties Listed"],
  ["1,200+", "Happy Clients"],
  ["₦0", "Agent Fees"],
  ["13", "LGAs Covered"],
];

export default async function HomePage() {
  const featured = await fetchProperties("?page_size=6").catch(() => ({ items: [], total: 0, page: 1, page_size: 6 }));

  return (
    <main>
      <section className="relative flex min-h-screen items-center overflow-hidden bg-brand-black">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1800&q=80&auto=format&fit=crop')] bg-cover bg-center opacity-45" />
        <div className="absolute inset-0 bg-brand-black/55" />
        <div className="relative mx-auto max-w-5xl px-4 pt-24 text-center text-brand-white md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-gold">Ebonyi State · Nigeria · Zero Agent Fees</p>
          <h1 className="mx-auto mt-6 max-w-4xl">Find Your Perfect Home. Pay Zero Agent Fees.</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-brand-white/80">
            RentEase by G &amp; G Homes connects landlords and tenants directly across Ebonyi State. Browse verified listings, schedule inspections, pay securely with Flutterwave, and manage your rental journey in one account.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/properties"><Button size="lg">Browse Properties</Button></Link>
            <Link href="/register"><Button variant="outline" size="lg">List Your Property</Button></Link>
          </div>
        </div>
      </section>

      <section className="bg-brand-black py-8">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-4 md:px-6">
          {stats.map(([value, label]) => (
            <div key={label} className="border-l border-brand-gold/30 pl-6 first:border-l-0 first:pl-0">
              <p className="text-3xl font-bold text-brand-gold">{value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.1em] text-brand-white">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-brand-cream py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading label="How RentEase Works" title="From Search to Move-In in 4 Steps" />
          <div className="mt-12 grid gap-6 lg:grid-cols-4">
            {[
              ["1", "Search", "Browse verified listings filtered by location, budget, and property type."],
              ["2", "View", "See photos, videos, amenities, and location details before requesting inspection."],
              ["3", "Inspect", "Book a physical inspection directly from each listing page using your account."],
              ["4", "Pay", "Complete secure Flutterwave payments and keep receipts, reminders, and updates in your dashboard."],
            ].map(([number, title, copy]) => (
              <Card key={title} className="border-t-4 border-t-brand-gold">
                <CardContent className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold text-lg font-bold text-brand-black">{number}</div>
                  <h3>{title}</h3>
                  <p className="text-sm leading-7 text-brand-gray">{copy}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading label="Featured Properties" title="Handpicked Properties Across Ebonyi State" />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {featured.items.map((property) => <PropertyCard key={property.id} property={property} />)}
          </div>
        </div>
      </section>

      <section className="bg-brand-black py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 md:px-6">
          <div>
            <SectionHeading label="For Landlords" title="Are You a Landlord?" body="List your property on RentEase and connect directly with verified tenants. No middlemen. No agent commissions. Full control." />
            <Link href="/register" className="mt-8 inline-block">
              <Button>List Your Property Free</Button>
            </Link>
          </div>
          <Card className="border-brand-gold/30 bg-brand-black">
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
        </div>
      </section>

      <section className="bg-brand-cream py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading label="Why This System Works" title="A full web platform that preserves the WhatsApp-native speed of the original workflow." />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              ["Verified marketplace", "Every public listing goes live only after internal review and landlord verification."],
              ["Unified dashboard", "One account lets users search, save, book inspections, list properties, and track rent payments."],
              ["AI-ready operations", "The backend includes an AI service layer for listing polish, support copilots, and smarter search once OpenAI keys are added."],
            ].map(([title, copy]) => (
              <Card key={title}>
                <CardContent className="space-y-4">
                  <ShieldCheck className="h-8 w-8 text-brand-gold" />
                  <h3>{title}</h3>
                  <p className="text-sm leading-7 text-brand-gray">{copy}</p>
                </CardContent>
              </Card>
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
