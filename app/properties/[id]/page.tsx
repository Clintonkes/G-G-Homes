import { MapPin, ShieldCheck } from "lucide-react";

import { InspectionBookingModal } from "@/components/forms/inspection-booking-modal";
import { Reveal } from "@/components/marketing/reveal";
import { PriceDisplay } from "@/components/properties/price-display";
import { PropertyGallery } from "@/components/properties/property-gallery";
import { StatusBadge } from "@/components/properties/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchProperty } from "@/lib/api";

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await fetchProperty(params.id).catch(() => null);

  if (!property) {
    return <main className="mx-auto max-w-5xl px-4 pb-20 pt-32 md:px-6"><h1>Property not found</h1></main>;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 md:px-6">
      <Reveal>
        <PropertyGallery photoUrls={property.photo_urls} videoUrls={property.video_urls} title={property.title} />
      </Reveal>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_0.8fr]">
        <Reveal className="space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge value={property.status} />
              {property.is_verified ? <Badge className="border-brand-green/30 text-brand-green">Verified</Badge> : null}
            </div>
            <h1>{property.title}</h1>
            <p className="flex items-center gap-2 text-brand-gray"><MapPin className="h-4 w-4" /> {property.address}</p>
            <PriceDisplay amount={property.annual_rent} size="lg" />
            <p className="text-sm text-brand-gray">Monthly equivalent: {Math.round(property.annual_rent / 12).toLocaleString("en-NG")} NGN</p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              ["Bedrooms", property.bedrooms],
              ["Bathrooms", property.bathrooms],
              ["Toilets", property.toilets],
              ["Furnished", property.is_furnished ? "Yes" : "No"],
            ].map(([label, value]) => (
              <Card key={label} className="interactive-panel">
                <CardContent>
                  <p className="text-xs uppercase tracking-[0.1em] text-brand-gray">{label}</p>
                  <p className="mt-2 text-2xl font-semibold text-brand-dark-text">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <h3>Amenities</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {property.amenities.map((amenity) => <Badge key={amenity}>{amenity}</Badge>)}
            </div>
          </div>

          <div>
            <h3>Description</h3>
            <p className="mt-4 leading-8 text-brand-gray">{property.description}</p>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:sticky lg:top-28 lg:h-fit">
          <Card className="interactive-panel border-brand-gold bg-white">
            <CardContent className="space-y-5">
              <PriceDisplay amount={property.annual_rent} size="lg" />
              <p className="text-sm leading-7 text-brand-gray">
                This property is listed by a verified landlord through G &amp; G Homes. We connect you directly, and no agent fees apply.
              </p>
              <InspectionBookingModal propertyId={property.id} propertyTitle={property.title} />
              <Button variant="outline" className="w-full">Contact About This Property</Button>
              <div className="rounded-3xl bg-brand-cream p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-brand-dark-text">
                  <ShieldCheck className="h-4 w-4 text-brand-gold" />
                  Listed by a verified landlord
                </p>
                <p className="mt-2 text-sm text-brand-gray">Personal landlord contact details stay private. All communication routes through the platform.</p>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </main>
  );
}
