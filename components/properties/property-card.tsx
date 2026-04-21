import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@/lib/types";
import { PriceDisplay } from "@/components/properties/price-display";

export function PropertyCard({ property, variant = "grid" }: { property: Property; showSaveButton?: boolean; variant?: "grid" | "list" }) {
  const image = property.thumbnail_url || property.photo_urls[0] || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80&auto=format&fit=crop";

  return (
    <Card className={variant === "list" ? "interactive-panel overflow-hidden md:grid md:grid-cols-[320px_1fr]" : "interactive-panel overflow-hidden"}>
      <div className="relative min-h-64">
        <Image src={image} alt={property.title} fill className="object-cover" />
      </div>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge>{property.property_type.replaceAll("_", " ")}</Badge>
          {property.is_verified ? <Badge className="border-brand-green/30 text-brand-green">Verified</Badge> : null}
        </div>
        <div>
          <h3 className="text-2xl text-brand-dark-text">{property.title}</h3>
          <p className="mt-2 flex items-center gap-2 text-sm text-brand-gray">
            <MapPin className="h-4 w-4" />
            {property.neighbourhood}, {property.city}
          </p>
        </div>
        <div className="flex gap-6 text-sm text-brand-gray">
          <span className="flex items-center gap-2"><BedDouble className="h-4 w-4" /> {property.bedrooms} Beds</span>
          <span className="flex items-center gap-2"><Bath className="h-4 w-4" /> {property.bathrooms} Baths</span>
        </div>
        <div className="flex items-center justify-between">
          <PriceDisplay amount={property.annual_rent} />
          <Link href={`/properties/${property.id}`}>
            <Button variant="dark">View Property</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
