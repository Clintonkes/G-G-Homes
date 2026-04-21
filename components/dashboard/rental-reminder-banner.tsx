import Link from "next/link";

import { Button } from "@/components/ui/button";

export function RentalReminderBanner({ daysRemaining, propertyAddress, paymentLink }: { daysRemaining: number; propertyAddress: string; paymentLink: string }) {
  return (
    <div className="rounded-[2rem] border border-brand-gold/40 bg-brand-gold/10 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-gold">Renewal Reminder</p>
      <h3 className="mt-2 text-brand-dark-text">Your tenancy at {propertyAddress} expires in {daysRemaining} days.</h3>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-brand-gray">Renew early to secure your home and avoid late-cycle availability pressure.</p>
      <Link href={paymentLink} className="mt-4 inline-block">
        <Button>Renew now</Button>
      </Link>
    </div>
  );
}
