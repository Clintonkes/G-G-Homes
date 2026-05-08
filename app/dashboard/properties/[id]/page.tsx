"use client";

import Link from "next/link";
import { ArrowLeft, Building2, ExternalLink, LayoutDashboard, MapPin, Search, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { PropertyGallery } from "@/components/properties/property-gallery";
import { PriceDisplay } from "@/components/properties/price-display";
import { StatusBadge } from "@/components/properties/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InspectionBookingModal } from "@/components/forms/inspection-booking-modal";
import { fetchProperty, toggleOccupancy } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function DashboardPropertyDetailPage({ params }: { params: { id: string } }) {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [togglingOccupancy, setTogglingOccupancy] = useState(false);

  const propertyQuery = useQuery({
    queryKey: ["dashboard-property", params.id, token],
    queryFn: () => fetchProperty(params.id, token),
    enabled: !!token,
  });

  const property = propertyQuery.data;
  const isOwner = !!user && !!property && user.id === property.landlord_id;

  const handleToggleOccupancy = async () => {
    if (!token || !property) return;
    try {
      setTogglingOccupancy(true);
      await toggleOccupancy(token, property.id);
      await queryClient.invalidateQueries({ queryKey: ["dashboard-property", params.id, token] });
      await propertyQuery.refetch();
    } finally {
      setTogglingOccupancy(false);
    }
  };

  if (propertyQuery.isLoading) {
    return (
      <main className="space-y-6">
        <div className="h-72 rounded-[2rem] bg-white/10" />
        <div className="h-64 rounded-[2rem] bg-white/10" />
      </main>
    );
  }

  if (!property) {
    return <main className="mx-auto max-w-5xl px-1 py-6"><h1>Property not found</h1></main>;
  }

  return (
    <main className="space-y-10 pb-6">
      {/* Sticky nav */}
      <div className="sticky top-0 z-20 -mx-1 flex flex-wrap items-center gap-2 border-b border-brand-gold/15 bg-brand-black/95 px-1 py-3 backdrop-blur">
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2 text-brand-white hover:text-brand-dark-text">
            <LayoutDashboard className="h-4 w-4" />
            My Listings
          </Button>
        </Link>
        <Link href="/properties">
          <Button variant="ghost" size="sm" className="gap-2 text-brand-white hover:text-brand-dark-text">
            <Search className="h-4 w-4" />
            Public Search
          </Button>
        </Link>
        {!isOwner && (
          <Link href={`/properties/${property.id}`} className="ml-auto">
            <Button variant="ghost" size="sm" className="gap-2 text-brand-white hover:text-brand-dark-text">
              <ExternalLink className="h-4 w-4" />
              Public View
            </Button>
          </Link>
        )}
      </div>

      <PropertyGallery photoUrls={property.photo_urls} videoUrls={property.video_urls} title={property.title} />

      <div className="grid gap-10 lg:grid-cols-[1.5fr_0.8fr]">
        {/* Main info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge value={property.status} />
              {property.is_verified ? <Badge className="border-brand-green/30 text-brand-green">Verified</Badge> : null}
              <Badge>{property.property_type.replaceAll("_", " ")}</Badge>
              {property.is_fully_occupied ? <Badge className="border-amber-300 bg-amber-50 text-amber-700">Fully Occupied</Badge> : null}
            </div>
            <h1 className="text-brand-white">{property.title}</h1>
            <PriceDisplay amount={property.annual_rent} currency={property.currency} size="lg" />
            <p className="text-sm text-brand-gray">Monthly equivalent: {Math.round(property.annual_rent / 12).toLocaleString()} {property.currency}</p>
          </div>

          {/* Full location breakdown */}
          <Card className="bg-white/95">
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-brand-gold/10 p-3 text-brand-gold">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-brand-dark-text">Location</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Street address", property.address],
                  ["Neighbourhood", property.neighbourhood],
                  ["City", property.city],
                  ["State / Region", property.state],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-brand-border bg-brand-cream/40 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-gray">{label}</p>
                    <p className="mt-1 font-medium text-brand-dark-text">{value}</p>
                  </div>
                ))}
              </div>
              {property.latitude && property.longitude ? (
                <a
                  href={`https://maps.google.com/?q=${property.latitude},${property.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-brand-gold hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open in Google Maps
                </a>
              ) : null}
            </CardContent>
          </Card>

          {/* Property specs */}
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ["Bedrooms", property.bedrooms],
              ["Bathrooms", property.bathrooms],
              ["Toilets", property.toilets],
              ["Furnished", property.is_furnished ? "Yes" : "No"],
            ].map(([label, value]) => (
              <Card key={String(label)} className="bg-white/95">
                <CardContent>
                  <p className="text-xs uppercase tracking-[0.1em] text-brand-gray">{label}</p>
                  <p className="mt-2 text-2xl font-semibold text-brand-dark-text">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Utilities */}
          <div>
            <h3 className="text-brand-white">Utilities included</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {property.has_water && <Badge>Water</Badge>}
              {property.has_electricity && <Badge>Electricity</Badge>}
              {property.has_security && <Badge>Security</Badge>}
              {property.has_parking && <Badge>Parking</Badge>}
              {!property.has_water && !property.has_electricity && !property.has_security && !property.has_parking && (
                <p className="text-sm text-brand-gray">No utilities specified.</p>
              )}
            </div>
          </div>

          {/* Amenities */}
          {property.amenities.length > 0 ? (
            <div>
              <h3 className="text-brand-white">Amenities</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {property.amenities.map((amenity) => <Badge key={amenity}>{amenity}</Badge>)}
              </div>
            </div>
          ) : null}

          {/* Description */}
          <div>
            <h3 className="text-brand-white">Description</h3>
            <p className="mt-4 leading-8 text-brand-gray">{property.description}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5 lg:sticky lg:top-20 lg:h-fit">
          {isOwner ? (
            <>
              {/* Owner management panel */}
              <Card className="bg-white/95">
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-brand-gold/10 p-3 text-brand-gold">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-gold">Your Listing</p>
                      <p className="mt-0.5 font-semibold text-brand-dark-text">Owner controls</p>
                    </div>
                  </div>
                  <p className="text-sm leading-7 text-brand-gray">
                    This is your listing. Manage occupancy status below and visit the dashboard to handle appointments and notifications.
                  </p>

                  {property.status === "ACTIVE" && (
                    <div className="space-y-2 rounded-3xl border border-brand-border bg-brand-cream/40 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-brand-dark-text">
                            {property.is_fully_occupied ? "Fully occupied" : "Space available"}
                          </p>
                          <p className="mt-0.5 text-xs text-brand-gray">
                            {property.is_fully_occupied
                              ? "Property is hidden from public search"
                              : "Property is visible in public search"}
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={togglingOccupancy}
                          onClick={handleToggleOccupancy}
                          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${property.is_fully_occupied ? "bg-brand-gold" : "bg-brand-border"}`}
                        >
                          <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${property.is_fully_occupied ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                      </div>
                      <p className="text-xs text-brand-gray">
                        {property.is_fully_occupied
                          ? "Toggle off when a unit becomes available."
                          : "Toggle on when all units are filled by occupants."}
                      </p>
                    </div>
                  )}

                  <Link href="/dashboard">
                    <Button variant="dark" className="w-full">Manage in Dashboard</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Verification status */}
              <Card className="bg-white/95">
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className={`h-4 w-4 ${property.is_verified ? "text-brand-green" : "text-brand-gold"}`} />
                    <p className="text-sm font-semibold text-brand-dark-text">
                      {property.is_verified ? "Verified listing" : "Awaiting verification"}
                    </p>
                  </div>
                  <p className="text-sm leading-7 text-brand-gray">
                    {property.is_verified
                      ? "This listing has passed admin verification and is visible to renters."
                      : "A G&G Homes admin will visit and verify this listing before it goes live."}
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* Visitor / tenant panel */}
              <Card className="bg-white/95">
                <CardContent className="space-y-5">
                  <PriceDisplay amount={property.annual_rent} currency={property.currency} size="lg" />
                  <p className="text-sm leading-7 text-brand-gray">
                    This property is visible inside your authenticated workspace so you can continue the acquisition flow without leaving your dashboard.
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

              <Card className="bg-white/95">
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-brand-gold" />
                    <p className="text-sm font-semibold text-brand-dark-text">No agent fees</p>
                  </div>
                  <p className="text-sm leading-7 text-brand-gray">
                    Connect directly with the landlord. G&amp;G Homes charges no agent commission on inspections or listings.
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
