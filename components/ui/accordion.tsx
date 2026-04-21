"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem(props: AccordionPrimitive.AccordionItemProps) {
  return <AccordionPrimitive.Item className="rounded-3xl border border-brand-border bg-white px-5" {...props} />;
}

export function AccordionTrigger({ children, ...props }: AccordionPrimitive.AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger className="flex w-full items-center justify-between py-5 text-left font-semibold text-brand-dark-text" {...props}>
        {children}
        <ChevronDown className="h-4 w-4" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent(props: AccordionPrimitive.AccordionContentProps) {
  return <AccordionPrimitive.Content className="pb-5 text-sm leading-7 text-brand-gray" {...props} />;
}
