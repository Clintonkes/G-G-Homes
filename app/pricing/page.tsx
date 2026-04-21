import Link from "next/link";
import { Check } from "lucide-react";

import { Reveal } from "@/components/marketing/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const plans = [
  {
    title: "Free",
    price: "₦0",
    description: "A simple way to start exploring verified homes.",
    features: [
      "Browse verified listings at no cost.",
      "View photos, amenities, and property details clearly.",
      "Submit 1 inspection request each month.",
      "Create a unified account for search and listing access.",
    ],
  },
  {
    title: "Basic",
    price: "₦1,500/mo",
    description: "For active users who want more viewing flexibility.",
    features: [
      "Run unlimited searches across available locations.",
      "Book up to 3 inspection requests every month.",
      "Receive rent renewal reminders inside your dashboard.",
      "Keep your saved-property list and account activity synced.",
    ],
  },
  {
    title: "Standard",
    price: "₦3,000/mo",
    description: "The most flexible monthly plan for frequent movers or owners.",
    features: [
      "Unlock unlimited inspections without monthly caps.",
      "Get faster access to high-interest properties.",
      "Stay more visible when listing and managing properties.",
      "Track your account actions, payments, and property activity in one place.",
    ],
  },
  {
    title: "Annual",
    price: "₦15,000/yr",
    description: "Best value for long-term use across the full platform.",
    features: [
      "Includes everything inside the Standard plan.",
      "Comes with 2 months free compared with monthly billing.",
      "Supports a full-year workflow for search, inspection, and listing management.",
      "Keeps renewal planning simpler with one yearly payment.",
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 md:px-6">
      <Reveal className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-gold">Pricing</p>
        <h1 className="mt-4 text-brand-white">Flexible plans for tenants and landlords</h1>
        <p className="mt-5 text-lg leading-8 text-brand-white/72">
          Each card now breaks the plan contents into cleaner bullet points so the benefits are easier to scan, compare, and understand.
        </p>
      </Reveal>
      <div className="mt-12 grid gap-6 lg:grid-cols-4">
        {plans.map((plan, index) => (
          <Reveal key={plan.title} delay={index * 0.08}>
            <Card className="interactive-panel h-full border-brand-gold/20 bg-white">
              <CardContent className="flex h-full flex-col space-y-6">
                <div className="space-y-3">
                  <h3>{plan.title}</h3>
                  <p className="text-3xl font-bold text-brand-gold">{plan.price}</p>
                  <p className="min-h-14 text-sm leading-7 text-brand-gray">{plan.description}</p>
                </div>
                <ul className="flex-1 space-y-3 text-sm leading-7 text-justify text-brand-gray">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-brand-gold" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register"><Button className="w-full">Get Started</Button></Link>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
