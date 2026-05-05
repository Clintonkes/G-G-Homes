"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    q: searchParams.get("q") ?? "",
    city: searchParams.get("city") ?? "",
    property_type: searchParams.get("property_type") ?? "",
    min_budget: searchParams.get("min_budget") ?? "",
    max_budget: searchParams.get("max_budget") ?? "",
    verified_only: searchParams.get("verified_only") === "true",
  });

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        if (value) params.set(key, "true");
        return;
      }
      if (value.trim()) params.set(key, value.trim());
    });
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <Card className="sticky top-28">
      <CardContent className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-gold">Filter Listings</p>
          <h3 className="mt-2 text-xl">Refine your search</h3>
        </div>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            applyFilters();
          }}
        >
          <Input placeholder="Neighbourhood or address" value={filters.q} onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))} />
          <Input placeholder="City" value={filters.city} onChange={(event) => setFilters((current) => ({ ...current, city: event.target.value }))} />
          <Input placeholder="Property Type" value={filters.property_type} onChange={(event) => setFilters((current) => ({ ...current, property_type: event.target.value }))} />
          <Input placeholder="Minimum Budget" type="number" value={filters.min_budget} onChange={(event) => setFilters((current) => ({ ...current, min_budget: event.target.value }))} />
          <Input placeholder="Maximum Budget" type="number" value={filters.max_budget} onChange={(event) => setFilters((current) => ({ ...current, max_budget: event.target.value }))} />
          <div className="flex items-center justify-between rounded-2xl border border-brand-border px-4 py-3">
            <span className="text-sm text-brand-gray">Verified only</span>
            <Switch checked={filters.verified_only} onCheckedChange={(value) => setFilters((current) => ({ ...current, verified_only: value }))} />
          </div>
          <Button variant="dark" className="w-full gap-2" type="submit">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
