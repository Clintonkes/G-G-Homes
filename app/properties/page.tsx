import { Reveal } from "@/components/marketing/reveal";
import { FilterSidebar } from "@/components/properties/filter-sidebar";
import { PropertyCard } from "@/components/properties/property-card";
import { fetchProperties } from "@/lib/api";

export default async function PropertiesPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === "string") params.set(key, value);
  });
  const data = await fetchProperties(`?${params.toString()}`).catch(() => ({ items: [], total: 0, page: 1, page_size: 12 }));

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 md:px-6">
      <Reveal className="mb-10 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-gold">Verified Listings</p>
        <h1 className="mt-4 text-brand-white">Explore Properties Across Ebonyi State</h1>
        <p className="mt-4 text-lg leading-8 text-brand-white/72">Filter by neighbourhood, city, price, and verification status. Only active listings appear in public search.</p>
      </Reveal>
      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <Reveal>
          <FilterSidebar />
        </Reveal>
        <div className="space-y-6">
          <Reveal>
          <div className="interactive-panel flex items-center justify-between rounded-3xl border border-brand-border bg-white px-5 py-4">
            <p className="text-sm text-brand-gray">{data.total} result(s) found</p>
            <p className="text-sm font-semibold text-brand-dark-text">Newest First</p>
          </div>
          </Reveal>
          <div className="grid gap-6 xl:grid-cols-2">
            {data.items.map((property, index) => (
              <Reveal key={property.id} delay={index * 0.05}>
                <PropertyCard property={property} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
