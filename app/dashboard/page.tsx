"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  ArrowRight,
  Bell,
  Compass,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  createProperty,
  fetchAppointments,
  fetchNotifications,
  fetchPayments,
  fetchProperties,
  updateMe,
} from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { RentalReminderBanner } from "@/components/dashboard/rental-reminder-banner";
import { StepForm } from "@/components/forms/step-form";
import { PropertyCard } from "@/components/properties/property-card";
import { StatusBadge } from "@/components/properties/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type DashboardSection =
  | "overview"
  | "search"
  | "saved"
  | "appointments"
  | "payments"
  | "notifications"
  | "list-property"
  | "settings";

type PropertyFormValues = {
  title: string;
  description: string;
  address: string;
  neighbourhood: string;
  city: string;
  state: string;
  property_type: string;
  bedrooms: string;
  bathrooms: string;
  toilets: string;
  annual_rent: string;
  security_deposit: string;
  amenities: string;
  photo_urls: string;
  document_urls: string;
  is_furnished: boolean;
  has_water: boolean;
  has_electricity: boolean;
  has_security: boolean;
  has_parking: boolean;
};

type SettingsFormValues = {
  full_name: string;
  email: string;
  phone_number: string;
  id_document_url: string;
};

type PreferencesState = {
  productUpdates: boolean;
  instantAlerts: boolean;
  listingDigest: boolean;
};

const propertyTypes = [
  "Flat",
  "Duplex",
  "Mini Flat",
  "Studio",
  "Bungalow",
  "Office Space",
  "Shop",
  "Warehouse",
];

const listingSteps = ["Property Basics", "Location & Pricing", "Media & Amenities"];

const listingStepFields: Array<Array<keyof PropertyFormValues>> = [
  ["title", "property_type", "description"],
  ["address", "neighbourhood", "city", "state", "bedrooms", "bathrooms", "toilets", "annual_rent"],
  ["amenities", "photo_urls", "document_urls"],
];

const defaultPreferences: PreferencesState = {
  productUpdates: true,
  instantAlerts: true,
  listingDigest: false,
};

function splitCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">{eyebrow}</p>
        <h1 className="mt-3 text-4xl leading-tight text-brand-white">{title}</h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-brand-gray">{description}</p>
      </div>
      {action}
    </div>
  );
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="border-dashed border-brand-border/80 bg-white/95">
      <CardContent className="space-y-3 py-10 text-center">
        <p className="text-xl font-semibold text-brand-dark-text">{title}</p>
        <p className="mx-auto max-w-xl text-sm leading-7 text-brand-gray">{description}</p>
        {action}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [active, setActive] = useState<DashboardSection>("overview");
  const [propertyStep, setPropertyStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [listingMessage, setListingMessage] = useState<string | null>(null);
  const [listingError, setListingError] = useState<string | null>(null);
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<PreferencesState>(defaultPreferences);

  const deferredSearch = useDeferredValue(searchTerm);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const setSession = useAuthStore((state) => state.setSession);

  const appointments = useQuery({
    queryKey: ["appointments", token],
    queryFn: () => fetchAppointments(token ?? ""),
    enabled: !!token,
  });

  const payments = useQuery({
    queryKey: ["payments", token],
    queryFn: () => fetchPayments(token ?? ""),
    enabled: !!token,
  });

  const notifications = useQuery({
    queryKey: ["notifications", token],
    queryFn: () => fetchNotifications(token ?? ""),
    enabled: !!token,
  });

  const myListings = useQuery({
    queryKey: ["my-properties", token],
    queryFn: () => fetchProperties("?include_mine=true"),
    enabled: !!token,
  });

  const searchResults = useQuery({
    queryKey: ["dashboard-search", deferredSearch],
    queryFn: () =>
      fetchProperties(
        deferredSearch.trim()
          ? `?q=${encodeURIComponent(deferredSearch.trim())}&page_size=6`
          : "?page_size=6",
      ),
    enabled: !!token,
  });

  const expiringPayment = useMemo(
    () => payments.data?.find((payment) => payment.tenancy_end_date),
    [payments.data],
  );

  const propertyForm = useForm<PropertyFormValues>({
    defaultValues: {
      title: "",
      description: "",
      address: "",
      neighbourhood: "",
      city: "",
      state: "",
      property_type: "",
      bedrooms: "",
      bathrooms: "",
      toilets: "",
      annual_rent: "",
      security_deposit: "",
      amenities: "",
      photo_urls: "",
      document_urls: "",
      is_furnished: false,
      has_water: true,
      has_electricity: true,
      has_security: false,
      has_parking: false,
    },
  });

  const settingsForm = useForm<SettingsFormValues>({
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      id_document_url: "",
    },
  });

  useEffect(() => {
    if (!user) return;
    settingsForm.reset({
      full_name: user.full_name ?? "",
      email: user.email ?? "",
      phone_number: user.phone_number ?? "",
      id_document_url: user.id_document_url ?? "",
    });
  }, [settingsForm, user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("gg-homes-dashboard-preferences");
    if (!saved) return;
    try {
      setPreferences({ ...defaultPreferences, ...JSON.parse(saved) });
    } catch {
      window.localStorage.removeItem("gg-homes-dashboard-preferences");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("gg-homes-dashboard-preferences", JSON.stringify(preferences));
  }, [preferences]);

  const goToNextListingStep = async () => {
    const isValid = await propertyForm.trigger(listingStepFields[propertyStep]);
    if (!isValid) return;
    setPropertyStep((current) => Math.min(current + 1, listingSteps.length - 1));
  };

  const submitProperty = propertyForm.handleSubmit(async (values) => {
    if (!token) return;
    try {
      setListingError(null);
      setListingMessage(null);
      await createProperty(token, {
        title: values.title,
        description: values.description,
        address: values.address,
        neighbourhood: values.neighbourhood,
        city: values.city,
        state: values.state,
        property_type: values.property_type,
        bedrooms: Number(values.bedrooms),
        bathrooms: Number(values.bathrooms),
        toilets: Number(values.toilets),
        annual_rent: Number(values.annual_rent),
        security_deposit: values.security_deposit ? Number(values.security_deposit) : 0,
        amenities: splitCsv(values.amenities),
        photo_urls: splitCsv(values.photo_urls),
        video_urls: [],
        document_urls: splitCsv(values.document_urls),
        is_furnished: values.is_furnished,
        has_water: values.has_water,
        has_electricity: values.has_electricity,
        has_security: values.has_security,
        has_parking: values.has_parking,
      });
      propertyForm.reset();
      setPropertyStep(0);
      await myListings.refetch();
      setListingMessage("Property submitted successfully. It is now queued for verification.");
      setActive("saved");
    } catch (error) {
      setListingError(error instanceof Error ? error.message : "Unable to submit the property right now.");
    }
  });

  const saveSettings = settingsForm.handleSubmit(async (values) => {
    if (!token || !user) return;
    try {
      setSettingsError(null);
      setSettingsMessage(null);
      const updatedUser = await updateMe(token, {
        full_name: values.full_name,
        email: values.email,
        phone_number: values.phone_number,
        id_document_url: values.id_document_url || null,
      });
      setSession(token, updatedUser);
      setSettingsMessage("Your account settings were updated successfully.");
    } catch (error) {
      setSettingsError(error instanceof Error ? error.message : "Unable to save your settings right now.");
    }
  });

  if (!token) {
    return (
      <main className="mx-auto max-w-4xl px-4 pb-20 pt-32 md:px-6">
        <h1>Please sign in to continue.</h1>
      </main>
    );
  }

  return (
    <DashboardLayout active={active} onSelect={(key) => setActive(key as DashboardSection)}>
      <div className="space-y-6">
        {active === "overview" ? (
          <>
            {expiringPayment ? (
              <RentalReminderBanner
                daysRemaining={30}
                propertyAddress="Your active tenancy"
                paymentLink="/pricing"
              />
            ) : null}
            <SectionHeader
              eyebrow="Dashboard Overview"
              title={`Welcome back, ${user?.full_name?.split(" ")[0] ?? "there"}.`}
              description="Everything in your real estate workspace is now organized in one place, from discovery and inspections to listings, payments, and profile controls."
              action={
                <Button variant="outline" onClick={() => setActive("list-property")}>
                  List a Property
                </Button>
              }
            />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: "My Listings",
                  value: myListings.data?.items.length ?? 0,
                  hint: "Properties currently in your account",
                },
                {
                  label: "Upcoming Inspections",
                  value: appointments.data?.length ?? 0,
                  hint: "Scheduled visits and follow-ups",
                },
                {
                  label: "Payments",
                  value: payments.data?.length ?? 0,
                  hint: "Transactions and rent activity",
                },
                {
                  label: "Notifications",
                  value: notifications.data?.length ?? 0,
                  hint: "Updates that still need attention",
                },
              ].map((item) => (
                <Card key={item.label} className="bg-white/95">
                  <CardContent className="space-y-3">
                    <p className="text-sm font-medium text-brand-gray">{item.label}</p>
                    <p className="text-4xl font-bold text-brand-dark-text">{item.value}</p>
                    <p className="text-sm leading-6 text-brand-gray">{item.hint}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <Card className="bg-white/95">
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold">
                        Listing Pulse
                      </p>
                      <h2 className="mt-2 text-2xl text-brand-dark-text">Your latest listings</h2>
                    </div>
                    <Button variant="ghost" onClick={() => setActive("saved")}>
                      View All
                    </Button>
                  </div>
                  {myListings.data?.items.length ? (
                    <div className="space-y-4">
                      {myListings.data.items.slice(0, 2).map((property) => (
                        <div
                          key={property.id}
                          className="rounded-3xl border border-brand-border bg-brand-cream/40 p-4"
                        >
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                              <p className="text-lg font-semibold text-brand-dark-text">{property.title}</p>
                              <p className="mt-2 flex items-center gap-2 text-sm text-brand-gray">
                                <MapPin className="h-4 w-4" />
                                {property.neighbourhood}, {property.city}
                              </p>
                            </div>
                            <StatusBadge value={property.status} />
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {property.is_verified ? (
                              <Badge className="border-brand-green/30 text-brand-green">Verified</Badge>
                            ) : null}
                            <Badge>{property.property_type.replaceAll("_", " ")}</Badge>
                            <Badge>NGN {property.annual_rent.toLocaleString("en-NG")} / year</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="No listings yet"
                      description="Start with the guided 3-step listing wizard and your properties will appear here as soon as you submit them."
                      action={
                        <div className="pt-2">
                          <Button onClick={() => setActive("list-property")}>Start Listing</Button>
                        </div>
                      }
                    />
                  )}
                </CardContent>
              </Card>
              <Card className="bg-white/95">
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-brand-gold/10 p-3 text-brand-gold">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold">
                        Smart Search
                      </p>
                      <h2 className="mt-1 text-2xl text-brand-dark-text">Jump back into discovery</h2>
                    </div>
                  </div>
                  <p className="text-sm leading-7 text-brand-gray">
                    Search live inventory, filter by what matters, and discover likely matches as you type.
                  </p>
                  <Button variant="dark" onClick={() => setActive("search")}>
                    Open Search Workspace
                  </Button>
                  <div className="rounded-3xl border border-brand-border bg-brand-cream/40 p-4">
                    <p className="text-sm font-semibold text-brand-dark-text">Fast actions</p>
                    <div className="mt-4 grid gap-3">
                      <button
                        type="button"
                        onClick={() => setActive("appointments")}
                        className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-left text-sm font-medium text-brand-dark-text"
                      >
                        View appointments
                        <ArrowRight className="h-4 w-4 text-brand-gold" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActive("settings")}
                        className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-left text-sm font-medium text-brand-dark-text"
                      >
                        Update account settings
                        <ArrowRight className="h-4 w-4 text-brand-gold" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}

        {active === "search" ? (
          <>
            <SectionHeader
              eyebrow="Search Workspace"
              title="Discover properties as you type."
              description="Enter a title, neighbourhood, address, or city. Results update continuously so the experience feels instant and exploratory."
            />
            <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
              <Card className="bg-white/95">
                <CardContent className="space-y-5">
                  <div className="rounded-[2rem] border border-brand-border bg-brand-cream/40 p-5">
                    <label className="text-sm font-semibold text-brand-dark-text">Search listings</label>
                    <div className="mt-3 flex items-center gap-3 rounded-2xl border border-brand-border bg-white px-4 py-3">
                      <Search className="h-5 w-5 text-brand-gold" />
                      <input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Try Lekki, duplex, waterfront, 3 bedroom..."
                        className="w-full border-0 bg-transparent text-base text-brand-dark-text outline-none placeholder:text-brand-gray"
                      />
                    </div>
                    <p className="mt-3 text-sm leading-7 text-brand-gray">
                      Results refresh while you type so you can spot relevant listings immediately.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-brand-dark-text">Quick prompts</p>
                    <div className="flex flex-wrap gap-2">
                      {["2 bedroom flat", "duplex in lekki", "student studio", "office space"].map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setSearchTerm(term)}
                          className="rounded-full border border-brand-border bg-white px-4 py-2 text-sm font-medium text-brand-dark-text transition hover:border-brand-gold hover:text-brand-gold"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-3xl bg-brand-black p-5 text-brand-white">
                    <div className="flex items-center gap-3">
                      <Compass className="h-5 w-5 text-brand-gold" />
                      <p className="font-semibold">Discovery insights</p>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-brand-white/75">
                      Use broad phrases first, then narrow with a neighbourhood or property type for sharper matches.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/95">
                <CardContent className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold">
                        Live Results
                      </p>
                      <h2 className="mt-2 text-2xl text-brand-dark-text">
                        {deferredSearch.trim() ? `Matches for "${deferredSearch.trim()}"` : "Popular inventory"}
                      </h2>
                    </div>
                    <Badge>{searchResults.data?.total ?? 0} found</Badge>
                  </div>
                  {searchResults.isLoading ? (
                    <p className="text-sm text-brand-gray">Refreshing results...</p>
                  ) : null}
                  {searchResults.data?.items.length ? (
                    <div className="grid gap-5">
                      {searchResults.data.items.map((property) => (
                        <PropertyCard key={property.id} property={property} variant="list" />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="No matches yet"
                      description="Try a broader location, a shorter phrase, or a different property type to expand the search."
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}

        {active === "saved" ? (
          <>
            <SectionHeader
              eyebrow="My Listings"
              title="Properties you have listed"
              description="This section now focuses on the properties tied to your account, including pending verification, active listings, and any listing metadata you need to track."
              action={
                <Button variant="outline" onClick={() => setActive("list-property")}>
                  Add Another Listing
                </Button>
              }
            />
            {myListings.data?.items.length ? (
              <div className="grid gap-6 xl:grid-cols-2">
                {myListings.data.items.map((property) => (
                  <div key={property.id} className="space-y-3">
                    <PropertyCard property={property} />
                    <div className="rounded-3xl border border-brand-border bg-white/95 p-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <StatusBadge value={property.status} />
                        {property.is_verified ? (
                          <Badge className="border-brand-green/30 text-brand-green">Verified</Badge>
                        ) : (
                          <Badge>Awaiting verification</Badge>
                        )}
                        <Badge>{property.city}</Badge>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-brand-gray">
                        Created on {new Date(property.created_at).toLocaleDateString()} and visible in your landlord workspace.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Your account has no listings yet"
                description="Once you submit a property through the 3-step listing flow, it will appear here automatically."
                action={
                  <div className="pt-2">
                    <Button onClick={() => setActive("list-property")}>List Your First Property</Button>
                  </div>
                }
              />
            )}
          </>
        ) : null}

        {active === "appointments" ? (
          <>
            <SectionHeader
              eyebrow="Appointments"
              title="Inspection activity and follow-ups"
              description="Track inspection schedules, outcomes, and completed visits from one clean table."
            />
            <Card className="bg-white/95">
              <CardContent>
                {appointments.data?.length ? (
                  <Table>
                    <thead>
                      <tr className="border-b border-brand-border text-sm text-brand-gray">
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Outcome</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.data.map((item) => (
                        <tr key={item.id} className="border-b border-brand-border/70">
                          <td className="py-4">{new Date(item.scheduled_date).toLocaleString()}</td>
                          <td className="py-4">
                            <StatusBadge value={item.status} />
                          </td>
                          <td className="py-4 text-sm capitalize text-brand-gray">
                            {item.outcome.replaceAll("_", " ")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <EmptyState
                    title="No appointments yet"
                    description="Inspection requests and booking outcomes will appear here once activity starts."
                  />
                )}
              </CardContent>
            </Card>
          </>
        ) : null}

        {active === "payments" ? (
          <>
            <SectionHeader
              eyebrow="Payments"
              title="Monitor your transaction history"
              description="Review references, amounts, and payment states without leaving your dashboard."
            />
            <Card className="bg-white/95">
              <CardContent>
                {payments.data?.length ? (
                  <Table>
                    <thead>
                      <tr className="border-b border-brand-border text-sm text-brand-gray">
                        <th className="pb-3">Reference</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.data.map((item) => (
                        <tr key={item.id} className="border-b border-brand-border/70">
                          <td className="py-4">{item.flutterwave_reference}</td>
                          <td className="py-4">₦{item.gross_amount.toLocaleString("en-NG")}</td>
                          <td className="py-4">
                            <StatusBadge value={item.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <EmptyState
                    title="No payments recorded yet"
                    description="Once payments are initialized and completed, they will be reflected here with live statuses."
                  />
                )}
              </CardContent>
            </Card>
          </>
        ) : null}

        {active === "notifications" ? (
          <>
            <SectionHeader
              eyebrow="Notifications"
              title="Stay on top of platform activity"
              description="Messages, reminders, and listing updates are gathered here so you can act quickly."
            />
            {notifications.data?.length ? (
              <div className="grid gap-4">
                {notifications.data.map((item) => (
                  <Card key={item.id} className="bg-white/95">
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl bg-brand-gold/10 p-3 text-brand-gold">
                            <Bell className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-brand-dark-text">{item.title}</p>
                            <p className="text-xs uppercase tracking-[0.14em] text-brand-gray">
                              {new Date(item.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {item.is_read ? <Badge>Read</Badge> : <Badge className="text-brand-red">Unread</Badge>}
                      </div>
                      <p className="text-sm leading-7 text-brand-gray">{item.message}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No notifications right now"
                description="Your alerts, reminders, and property updates will appear here once there is activity."
              />
            )}
          </>
        ) : null}

        {active === "list-property" ? (
          <>
            <SectionHeader
              eyebrow="List Property"
              title="Create a listing in three clean steps"
              description="The long scrolling form has been replaced with a guided workflow so you can move from details to pricing to media with less friction."
            />
            <Card className="bg-white/95">
              <CardContent className="space-y-6">
                {listingMessage ? (
                  <div className="rounded-2xl border border-brand-green/20 bg-brand-green/10 px-4 py-3 text-sm font-medium text-brand-green">
                    {listingMessage}
                  </div>
                ) : null}
                {listingError ? (
                  <div className="rounded-2xl border border-brand-red/20 bg-brand-red/10 px-4 py-3 text-sm font-medium text-brand-red">
                    {listingError}
                  </div>
                ) : null}
                <form className="space-y-6" onSubmit={submitProperty}>
                  <StepForm
                    steps={listingSteps}
                    currentStep={propertyStep}
                    onNext={goToNextListingStep}
                    onBack={() => setPropertyStep((current) => Math.max(current - 1, 0))}
                    isLastStep={propertyStep === listingSteps.length - 1}
                    nextLabel={propertyStep === listingSteps.length - 1 ? "Submit Listing" : "Continue"}
                  >
                    {propertyStep === 0 ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          placeholder="Property title"
                          className="md:col-span-2"
                          {...propertyForm.register("title", { required: true })}
                        />
                        <div className="space-y-3 md:col-span-2">
                          <Input
                            placeholder="Property type"
                            {...propertyForm.register("property_type", { required: true })}
                          />
                          <div className="flex flex-wrap gap-2">
                            {propertyTypes.map((type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => propertyForm.setValue("property_type", type)}
                                className="rounded-full border border-brand-border px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-brand-gray transition hover:border-brand-gold hover:text-brand-gold"
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>
                        <Textarea
                          placeholder="Describe the property, lifestyle fit, standout features, and nearby context"
                          className="min-h-40 md:col-span-2"
                          {...propertyForm.register("description", { required: true, minLength: 20 })}
                        />
                      </div>
                    ) : null}

                    {propertyStep === 1 ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          placeholder="Street address"
                          className="md:col-span-2"
                          {...propertyForm.register("address", { required: true })}
                        />
                        <Input
                          placeholder="Neighbourhood"
                          {...propertyForm.register("neighbourhood", { required: true })}
                        />
                        <Input placeholder="City" {...propertyForm.register("city", { required: true })} />
                        <Input
                          placeholder="State / Region"
                          {...propertyForm.register("state", { required: true })}
                        />
                        <Input
                          placeholder="Bedrooms"
                          type="number"
                          {...propertyForm.register("bedrooms", { required: true })}
                        />
                        <Input
                          placeholder="Bathrooms"
                          type="number"
                          {...propertyForm.register("bathrooms", { required: true })}
                        />
                        <Input
                          placeholder="Toilets"
                          type="number"
                          {...propertyForm.register("toilets", { required: true })}
                        />
                        <Input
                          placeholder="Annual rent"
                          type="number"
                          {...propertyForm.register("annual_rent", { required: true })}
                        />
                        <Input
                          placeholder="Security deposit"
                          type="number"
                          className="md:col-span-2"
                          {...propertyForm.register("security_deposit")}
                        />
                      </div>
                    ) : null}

                    {propertyStep === 2 ? (
                      <div className="space-y-5">
                        <Input
                          placeholder="Amenities separated by commas"
                          {...propertyForm.register("amenities", { required: true })}
                        />
                        <Input
                          placeholder="Photo URLs separated by commas"
                          {...propertyForm.register("photo_urls", { required: true })}
                        />
                        <Input
                          placeholder="Document URLs separated by commas"
                          {...propertyForm.register("document_urls", { required: true })}
                        />
                        <p className="text-sm leading-7 text-brand-gray">
                          Add at least 3 photo URLs and at least 1 document URL so the backend verification rules pass cleanly.
                        </p>
                        <div className="grid gap-3 md:grid-cols-2">
                          {[
                            ["is_furnished", "Furnished"],
                            ["has_water", "Water supply"],
                            ["has_electricity", "Electricity"],
                            ["has_security", "Security"],
                            ["has_parking", "Parking"],
                          ].map(([field, label]) => (
                            <div
                              key={field}
                              className="flex items-center justify-between rounded-2xl border border-brand-border bg-brand-cream/40 px-4 py-4"
                            >
                              <div>
                                <p className="font-medium text-brand-dark-text">{label}</p>
                                <p className="text-sm text-brand-gray">Include this in the listing details</p>
                              </div>
                              <Switch
                                checked={propertyForm.watch(field as keyof PropertyFormValues) as boolean}
                                onCheckedChange={(checked) =>
                                  propertyForm.setValue(field as keyof PropertyFormValues, checked as never)
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </StepForm>
                </form>
              </CardContent>
            </Card>
          </>
        ) : null}

        {active === "settings" ? (
          <>
            <SectionHeader
              eyebrow="Settings"
              title="Control your account experience"
              description="Update your profile, manage how the workspace behaves, and keep your identity details accurate from one settings hub."
            />
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="status">Account Status</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card className="bg-white/95">
                  <CardContent className="space-y-6">
                    {settingsMessage ? (
                      <div className="rounded-2xl border border-brand-green/20 bg-brand-green/10 px-4 py-3 text-sm font-medium text-brand-green">
                        {settingsMessage}
                      </div>
                    ) : null}
                    {settingsError ? (
                      <div className="rounded-2xl border border-brand-red/20 bg-brand-red/10 px-4 py-3 text-sm font-medium text-brand-red">
                        {settingsError}
                      </div>
                    ) : null}
                    <form className="grid gap-4 md:grid-cols-2" onSubmit={saveSettings}>
                      <Input
                        placeholder="Full name"
                        {...settingsForm.register("full_name", { required: true })}
                      />
                      <Input
                        placeholder="Email address"
                        type="email"
                        {...settingsForm.register("email", { required: true })}
                      />
                      <Input
                        placeholder="Phone number"
                        {...settingsForm.register("phone_number", { required: true })}
                      />
                      <Input
                        placeholder="Identity document URL"
                        {...settingsForm.register("id_document_url")}
                      />
                      <div className="md:col-span-2 flex justify-end">
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences">
                <div className="grid gap-6 xl:grid-cols-2">
                  <Card className="bg-white/95">
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold">
                          Workspace Preferences
                        </p>
                        <h2 className="mt-2 text-2xl text-brand-dark-text">Notification controls</h2>
                      </div>
                      {[
                        ["productUpdates", "Product updates", "Receive feature and platform improvement announcements."],
                        ["instantAlerts", "Instant alerts", "Get immediate reminders for inspections, payments, and listing changes."],
                        ["listingDigest", "Weekly listing digest", "Receive a summary of listing performance and attention points."],
                      ].map(([key, title, description]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-brand-border bg-brand-cream/40 px-4 py-4"
                        >
                          <div>
                            <p className="font-medium text-brand-dark-text">{title}</p>
                            <p className="text-sm leading-7 text-brand-gray">{description}</p>
                          </div>
                          <Switch
                            checked={preferences[key as keyof PreferencesState]}
                            onCheckedChange={(checked) =>
                              setPreferences((current) => ({
                                ...current,
                                [key]: checked,
                              }))
                            }
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <Card className="bg-white/95">
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-brand-gold/10 p-3 text-brand-gold">
                          <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold">
                            Account Care
                          </p>
                          <h2 className="mt-1 text-2xl text-brand-dark-text">Good to know</h2>
                        </div>
                      </div>
                      <p className="text-sm leading-7 text-brand-gray">
                        These toggles are saved for your current browser session profile so your dashboard can feel consistent every time you return.
                      </p>
                      <div className="rounded-3xl bg-brand-black p-5 text-brand-white">
                        <p className="font-semibold">Recommended setup</p>
                        <p className="mt-3 text-sm leading-7 text-brand-white/75">
                          Keep instant alerts enabled so listing approvals, appointments, and payment events are less likely to slip through.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="status">
                <div className="grid gap-6 xl:grid-cols-3">
                  <Card className="bg-white/95">
                    <CardContent className="space-y-3">
                      <p className="text-sm font-medium text-brand-gray">Account role</p>
                      <p className="text-2xl font-semibold text-brand-dark-text">
                        {user?.role.replaceAll("_", " ")}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/95">
                    <CardContent className="space-y-3">
                      <p className="text-sm font-medium text-brand-gray">Verification</p>
                      <p className="text-2xl font-semibold text-brand-dark-text">
                        {user?.id_verified ? "Verified" : "Pending"}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/95">
                    <CardContent className="space-y-3">
                      <p className="text-sm font-medium text-brand-gray">Listings in account</p>
                      <p className="text-2xl font-semibold text-brand-dark-text">
                        {myListings.data?.items.length ?? 0}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
