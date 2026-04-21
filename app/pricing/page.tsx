import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const plans = [
  ["Free", "₦0", "Browse listings, view photos, 1 inspection request per month"],
  ["Basic", "₦1,500/mo", "Unlimited searches, 3 inspection requests per month, renewal reminders"],
  ["Standard", "₦3,000/mo", "Unlimited inspections, priority access, more active visibility"],
  ["Annual", "₦15,000/yr", "Everything in Standard plus 2 months free"],
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 md:px-6">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-gold">Pricing</p>
        <h1 className="mt-4">Flexible plans for tenants and landlords</h1>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-4">
        {plans.map(([title, price, copy]) => (
          <Card key={title}><CardContent className="space-y-5"><h3>{title}</h3><p className="text-3xl font-bold text-brand-gold">{price}</p><p className="text-sm leading-7 text-brand-gray">{copy}</p><Link href="/register"><Button className="w-full">Get Started</Button></Link></CardContent></Card>
        ))}
      </div>
    </main>
  );
}
