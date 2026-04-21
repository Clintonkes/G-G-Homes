"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const applyFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <Card className="sticky top-28">
      <CardContent className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-gold">Filter Listings</p>
          <h3 className="mt-2 text-xl">Refine your search</h3>
        </div>
        <div className="space-y-3">
          <Input placeholder="Neighbourhood or address" defaultValue={searchParams.get("q") ?? ""} onBlur={(event) => applyFilter("q", event.target.value)} />
          <Input placeholder="City" defaultValue={searchParams.get("city") ?? ""} onBlur={(event) => applyFilter("city", event.target.value)} />
          <Input placeholder="Property Type" defaultValue={searchParams.get("property_type") ?? ""} onBlur={(event) => applyFilter("property_type", event.target.value)} />
          <Input placeholder="Minimum Budget" type="number" defaultValue={searchParams.get("min_budget") ?? ""} onBlur={(event) => applyFilter("min_budget", event.target.value)} />
          <Input placeholder="Maximum Budget" type="number" defaultValue={searchParams.get("max_budget") ?? ""} onBlur={(event) => applyFilter("max_budget", event.target.value)} />
          <div className="flex items-center justify-between rounded-2xl border border-brand-border px-4 py-3">
            <span className="text-sm text-brand-gray">Verified only</span>
            <Switch checked={searchParams.get("verified_only") === "true"} onCheckedChange={(value) => applyFilter("verified_only", String(value))} />
          </div>
        </div>
        <Button variant="dark" className="w-full gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </CardContent>
    </Card>
  );
}
