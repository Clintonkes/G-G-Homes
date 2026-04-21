"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";

export function Switch(props: SwitchPrimitive.SwitchProps) {
  return (
    <SwitchPrimitive.Root className="relative h-6 w-11 rounded-full bg-brand-border data-[state=checked]:bg-brand-gold" {...props}>
      <SwitchPrimitive.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-5" />
    </SwitchPrimitive.Root>
  );
}
