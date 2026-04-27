import { Reveal } from "@/components/marketing/reveal";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-20 pt-28 md:px-6">
      <Reveal>
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-gold">About G &amp; G Homes</p>
      <h1 className="mt-4 text-brand-white">Where Every Home Tells a Story</h1>
      </Reveal>
      <Reveal delay={0.1} className="interactive-panel mt-8 bg-white p-8">
      <div className="space-y-6 text-lg leading-8 text-brand-gray">
        <p>G &amp; G Homes LTD was built to remove the friction, opacity, and repeated agent fees that often slow down real estate access in Nigeria and beyond.</p>
        <p>This rebuild transforms the company’s original verification landing page and WhatsApp-native workflow into a complete multi-location marketplace for direct landlord-to-tenant rentals.</p>
        <p>Registered business details: RC Number 9020123. Address: 5 Camp David Estate Street, Abakaliki, Ebonyi State, Nigeria. Phone: +2348078330008.</p>
      </div>
      </Reveal>
    </main>
  );
}
