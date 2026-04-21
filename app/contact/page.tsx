"use client";

import { useForm } from "react-hook-form";

import { Reveal } from "@/components/marketing/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const { register, handleSubmit, reset } = useForm();

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 md:px-6">
      <Reveal className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-gold">Contact</p>
        <h1 className="mt-4 text-brand-white">Talk to G &amp; G Homes</h1>
      </Reveal>
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
        <Card className="interactive-panel bg-white">
          <CardContent className="space-y-4">
            <h1>Contact Us</h1>
            <p className="text-brand-gray">5 Camp David Estate Street, Abakaliki, Ebonyi State, Nigeria</p>
            <p className="text-brand-gray">+2348078330008</p>
            <p className="text-brand-gray">hello@gandghomesltd.org</p>
          </CardContent>
        </Card>
        </Reveal>
        <Reveal delay={0.1}>
        <Card className="interactive-panel bg-white">
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={handleSubmit(() => {
                reset();
              })}
            >
              <Input placeholder="Name" {...register("name")} />
              <Input placeholder="Email" type="email" {...register("email")} />
              <Input placeholder="Phone" {...register("phone")} />
              <Input placeholder="Subject" {...register("subject")} />
              <Textarea placeholder="Message" {...register("message")} />
              <Button type="submit">Send Message</Button>
            </form>
          </CardContent>
        </Card>
        </Reveal>
      </div>
    </main>
  );
}
