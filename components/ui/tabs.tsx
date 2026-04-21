"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: TabsPrimitive.TabsListProps) {
  return <TabsPrimitive.List className={cn("inline-flex rounded-full bg-brand-cream p-1", className)} {...props} />;
}

export function TabsTrigger({ className, ...props }: TabsPrimitive.TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "rounded-full px-4 py-2 text-sm font-semibold text-brand-gray data-[state=active]:bg-brand-black data-[state=active]:text-brand-white",
        className
      )}
      {...props}
    />
  );
}

export const TabsContent = TabsPrimitive.Content;
