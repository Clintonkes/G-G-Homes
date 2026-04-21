import Link from "next/link";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandlordsPage() {
  return (
    <main className="pt-24">
      <section className="bg-brand-black py-24 text-brand-white">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-gold">For Landlords</p>
          <h1 className="mt-4 max-w-4xl">List Your Property. Find Verified Tenants. Zero Agent Involvement.</h1>
          <Link href="/register" className="mt-8 inline-block"><Button>List Your First Property Free</Button></Link>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {["Fast onboarding", "Secure verification", "Direct payments"].map((title) => (
            <Card key={title}><CardContent><h3>{title}</h3><p className="mt-3 text-sm leading-7 text-brand-gray">Built for owners who want control, visibility, and a cleaner rental process.</p></CardContent></Card>
          ))}
        </div>
        <div className="mt-12">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="1"><AccordionTrigger>How do listings go live?</AccordionTrigger><AccordionContent>Every property is reviewed before it becomes publicly searchable.</AccordionContent></AccordionItem>
            <AccordionItem value="2"><AccordionTrigger>How are tenants qualified?</AccordionTrigger><AccordionContent>The platform records inspection history, account details, and payment steps in one place.</AccordionContent></AccordionItem>
            <AccordionItem value="3"><AccordionTrigger>How are payments handled?</AccordionTrigger><AccordionContent>Flutterwave powers payment collection while G &amp; G Homes tracks fees, receipts, and remittances.</AccordionContent></AccordionItem>
          </Accordion>
        </div>
      </section>
    </main>
  );
}
