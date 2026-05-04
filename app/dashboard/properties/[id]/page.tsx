"use client";

import { MapPin, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { InspectionBookingModal } from "@/components/forms/inspection-booking-modal";
import { PropertyGallery } from "@/components/properties/property-gallery";
import { PriceDisplay } from "@/components/properties/price-display";
import { StatusBadge } from "@/components/properties/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchProperty } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function DashboardPropertyDetailPage({ params }: { params: { id: string } }) {
  const token = useAuthStore((state) => state.token);
  const propertyQuery = useQuery({
    queryKey: ["dashboard-property", params.id, token],
    queryFn: () => fetchProperty(params.id, token),
    enabled: !!token,
  });

  const property = propertyQuery.data;

  if (propertyQuery.isLoading) {
    return <main className="space-y-6"><div className="h-72 rounded-[2rem] bg-white/10" /><div className="h-64 rounded-[2rem] bg-white/10" /></main>;
  }

  if (!property) {
    return <main className="mx-auto max-w-5xl px-1 py-6"><h1>Property not found</h1></main>;
  }

  return (
    <main className="space-y-10 pb-6">
      <PropertyGallery photoUrls={property.photo_urls} videoUrls={property.video_urls} title={property.title} />
      <div className="grid gap-10 lg:grid-cols-[1.5fr_0.8fr]">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge value={property.status} />
              {property.is_verified ? <Badge className="border-brand-green/30 text-brand-green">Verified</Badge> : null}
              <Badge>{property.property_type.replaceAll("_", " ")}</Badge>
            </div>
            <h1 className="text-brand-white">{property.title}</h1>
            <p className="flex items-center gap-2 text-brand-gray"><MapPin className="h-4 w-4" /> {property.address}</p>
            <PriceDisplay amount={property.annual_rent} currency={property.currency} size="lg" />
            <p className="text-sm text-brand-gray">Monthly equivalent: {Math.round(property.annual_rent / 12).toLocaleString("en-NG")} {property.currency}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              ["Bedrooms", property.bedrooms],
              ["Bathrooms", property.bathrooms],
              ["Toilets", property.toilets],
              ["Furnished", property.is_furnished ? "Yes" : "No"],
            ].map(([label, value]) => (
              <Card key={label} className="bg-white/95">
                <CardContent>
                  <p className="text-xs uppercase tracking-[0.1em] text-brand-gray">{label}</p>
                  <p className="mt-2 text-2xl font-semibold text-brand-dark-text">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <h3 className="text-brand-white">Amenities</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {property.amenities.map((amenity) => <Badge key={amenity}>{amenity}</Badge>)}
            </div>
          </div>

          <div>
            <h3 className="text-brand-white">Description</h3>
            <p className="mt-4 leading-8 text-brand-gray">{property.description}</p>
          </div>
        </div>

        <div className="lg:sticky lg:top-0 lg:h-fit">
          <Card className="bg-white/95">
            <CardContent className="space-y-5">
              <PriceDisplay amount={property.annual_rent} currency={property.currency} size="lg" />
              <p className="text-sm leading-7 text-brand-gray">
                This property is visible inside your authenticated workspace, so you can continue the property acquisition flow without being thrown back into the public site.
              </p>
              <InspectionBookingModal propertyId={property.id} propertyTitle={property.title} />
              <Button variant="outline" className="w-full">Contact About This Property</Button>
              <div className="rounded-3xl bg-brand-cream p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-brand-dark-text">
                  <ShieldCheck className="h-4 w-4 text-brand-gold" />
                  Listed by a verified landlord
                </p>
                <p className="mt-2 text-sm text-brand-gray">All activity stays inside your logged-in workflow.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
