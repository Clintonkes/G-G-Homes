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
  Upload,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  createProperty,
  fetchAppointments,
  fetchNotifications,
  fetchPayments,
  fetchProperties,
  updateMe,
  uploadAsset,
} from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { RentalReminderBanner } from "@/components/dashboard/rental-reminder-banner";
import { StepForm } from "@/components/forms/step-form";
import { UploadZone } from "@/components/forms/upload-zone";
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
import { formatMoney } from "@/lib/utils";

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
  currency: string;
  security_deposit: string;
  amenities: string;
  photo_urls: string[];
  document_urls: string[];
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

const propertyTypeOptions = [
  { value: "SELF_CONTAIN", label: "Self Contain" },
  { value: "FLAT", label: "Flat" },
  { value: "DUPLEX", label: "Duplex" },
  { value: "BUNGALOW", label: "Bungalow" },
  { value: "OFFICE_SPACE", label: "Office Space" },
  { value: "WAREHOUSE", label: "Warehouse" },
];

const currencyOptions = ["NGN", "USD", "GBP", "EUR", "KES", "GHS", "ZAR"];
const commercialPropertyTypes = new Set(["OFFICE_SPACE", "WAREHOUSE"]);

const listingSteps = ["Property Basics", "Location & Pricing", "Media & Amenities"];
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

function FilePills({
  urls,
  onRemove,
}: {
  urls: string[];
  onRemove: (value: string) => void;
}) {
  if (!urls.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {urls.map((url, index) => (
        <div
          key={url}
          className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-white px-3 py-2 text-xs text-brand-dark-text"
        >
          <span className="max-w-[12rem] truncate">{`File ${index + 1}`}</span>
          <button type="button" onClick={() => onRemove(url)} className="text-brand-gray hover:text-brand-red">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [active, setActive] = useState<DashboardSection>("overview");
  const [propertyStep, setPropertyStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [listingMessage, setListingMessage] = useState<string | null>(null);
  const [listingError, setListingError] = useState<string | null>(null);
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<PreferencesState>(defaultPreferences);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);

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
          ? `?q=${encodeURIComponent(deferredSearch.trim())}&page_size=8`
          : "?page_size=8",
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
      currency: "NGN",
      security_deposit: "",
      amenities: "",
      photo_urls: [],
      document_urls: [],
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

  const propertyType = propertyForm.watch("property_type");
  const isCommercialListing = commercialPropertyTypes.has(propertyType);
  const photoUrls = propertyForm.watch("photo_urls");
  const documentUrls = propertyForm.watch("document_urls");
  const showSuggestions = Boolean(searchTerm.trim()) && Boolean(searchResults.data?.items.length);

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
    if (!isCommercialListing) return;
    propertyForm.setValue("bedrooms", "0");
    propertyForm.setValue("bathrooms", "0");
  }, [isCommercialListing, propertyForm]);

  useEffect(() => {
    propertyForm.register("photo_urls", {
      validate: (value) => value.length >= 3 || "At least 3 property photos are required.",
    });
    propertyForm.register("document_urls", {
      validate: (value) => value.length >= 1 || "At least 1 ownership document is required.",
    });
  }, [propertyForm]);

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

  const handleFileUpload = async (field: "photo_urls" | "document_urls", files: File[]) => {
    if (!token || !files.length) return;

    const setUploading = field === "photo_urls" ? setUploadingPhotos : setUploadingDocuments;
    try {
      setListingError(null);
      setUploading(true);
      const uploaded = await Promise.all(files.map((file) => uploadAsset(token, file)));
      const nextUrls = [...propertyForm.getValues(field), ...uploaded.map((item) => item.url)];
      propertyForm.setValue(field, nextUrls, { shouldValidate: true, shouldDirty: true });
      await propertyForm.trigger(field);
    } catch (error) {
      setListingError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const removeUploadedFile = (field: "photo_urls" | "document_urls", url: string) => {
    const nextUrls = propertyForm.getValues(field).filter((item) => item !== url);
    propertyForm.setValue(field, nextUrls, { shouldValidate: true, shouldDirty: true });
    propertyForm.trigger(field);
  };

  const goToNextListingStep = async () => {
    let fields: Array<keyof PropertyFormValues> = [];

    if (propertyStep === 0) {
      fields = ["title", "property_type", "description"];
    }

    if (propertyStep === 1) {
      fields = [
        "address",
        "neighbourhood",
        "city",
        "state",
        "toilets",
        "annual_rent",
        "currency",
        "security_deposit",
      ];
      if (!isCommercialListing) {
        fields.push("bedrooms", "bathrooms");
      }
    }

    if (propertyStep === 2) {
      fields = ["amenities", "photo_urls", "document_urls"];
    }

    const isValid = await propertyForm.trigger(fields);
    if (!isValid) return;
    setPropertyStep((current) => Math.min(current + 1, listingSteps.length - 1));
  };

  const submitProperty = propertyForm.handleSubmit(async (values) => {
    if (!token) return;
    const isValid = await propertyForm.trigger();
    if (!isValid) return;

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
        bedrooms: isCommercialListing ? 0 : Number(values.bedrooms),
        bathrooms: isCommercialListing ? 0 : Number(values.bathrooms),
        toilets: Number(values.toilets),
        annual_rent: Number(values.annual_rent),
        currency: values.currency,
        security_deposit: Number(values.security_deposit),
        amenities: splitCsv(values.amenities),
        photo_urls: values.photo_urls,
        video_urls: [],
        document_urls: values.document_urls,
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
          </>
        ) : null}

        {active === "search" ? (
          <>
            <SectionHeader
              eyebrow="Search Workspace"
              title="Discover properties as you type."
              description="Search suggestions now respond to neighbourhood, city, and state together, so people can reach the right listing with less effort."
            />
            <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
              <Card className="bg-white/95">
                <CardContent className="space-y-5">
                  <div className="rounded-[2rem] border border-brand-border bg-brand-cream/40 p-5">
                    <label className="text-sm font-semibold text-brand-dark-text">Search listings</label>
                    <div className="relative mt-3">
                      <div className="flex items-center gap-3 rounded-2xl border border-brand-border bg-white px-4 py-3">
                        <Search className="h-5 w-5 text-brand-gold" />
                        <input
                          value={searchTerm}
                          onChange={(event) => setSearchTerm(event.target.value)}
                          placeholder="Try Lekki, Asokoro, Ikeja, Abuja, Lagos..."
                          className="w-full border-0 bg-transparent text-base text-brand-dark-text outline-none placeholder:text-brand-gray"
                        />
                      </div>
                      {showSuggestions ? (
                        <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-30 rounded-[1.5rem] border border-brand-border bg-white p-3 shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
                          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold">
                            Suggestions from your database
                          </p>
                          <div className="space-y-2">
                            {searchResults.data?.items.slice(0, 6).map((property) => (
                              <button
                                key={property.id}
                                type="button"
                                onClick={() => router.push(`/properties/${property.id}`)}
                                className="flex w-full items-start justify-between rounded-2xl px-3 py-3 text-left transition hover:bg-brand-cream"
                              >
                                <div>
                                  <p className="font-semibold text-brand-dark-text">{property.title}</p>
                                  <p className="mt-1 text-sm text-brand-gray">
                                    {property.neighbourhood}, {property.city}, {property.state}
                                  </p>
                                </div>
                                <ArrowRight className="mt-1 h-4 w-4 text-brand-gold" />
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <p className="mt-3 text-sm leading-7 text-brand-gray">
                      As users type, matching locations and properties are pulled from your live inventory.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-brand-dark-text">Quick prompts</p>
                    <div className="flex flex-wrap gap-2">
                      {["Lekki Lagos", "Asokoro Abuja", "Ikeja Lagos", "Kisumu Kenya"].map((term) => (
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
                      The suggestion layer now favors location signals so users can go straight from search intent into property acquisition.
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
                  {searchResults.data?.items.length ? (
                    <div className="grid gap-5">
                      {searchResults.data.items.map((property) => (
                        <PropertyCard key={property.id} property={property} variant="list" />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="No matches yet"
                      description="Try a broader neighbourhood, city, or state phrase to surface more suggestions and results."
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
              description="This section focuses on the properties tied to your account, including pending verification, active listings, and listing metadata."
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
                        <Badge>{formatMoney(property.annual_rent, property.currency)}</Badge>
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
              description="The form adapts to the type of property, supports flexible currencies, and now uses proper side-by-side multi-upload boxes for photos and documents."
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
                          {...propertyForm.register("title", { required: "Property title is required." })}
                        />
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-brand-dark-text">Property type</label>
                          <select
                            className="flex h-11 w-full rounded-2xl border border-brand-border bg-white px-4 py-2 text-sm text-brand-dark-text focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                            {...propertyForm.register("property_type", { required: "Select a property type." })}
                          >
                            <option value="">Select property type</option>
                            {propertyTypeOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="rounded-2xl border border-brand-border bg-brand-cream/40 px-4 py-4">
                          <p className="text-sm font-semibold text-brand-dark-text">Adaptive form</p>
                          <p className="mt-2 text-sm leading-7 text-brand-gray">
                            Warehouse and office space listings automatically skip bedroom and bathroom entry.
                          </p>
                        </div>
                        <Textarea
                          placeholder="Describe the property, its use case, standout features, and nearby context"
                          className="min-h-40 md:col-span-2"
                          {...propertyForm.register("description", {
                            required: "Property description is required.",
                            minLength: { value: 20, message: "Description should be at least 20 characters." },
                          })}
                        />
                      </div>
                    ) : null}

                    {propertyStep === 1 ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          placeholder="Street address"
                          className="md:col-span-2"
                          {...propertyForm.register("address", { required: "Address is required." })}
                        />
                        <Input
                          placeholder="Neighbourhood"
                          {...propertyForm.register("neighbourhood", { required: "Neighbourhood is required." })}
                        />
                        <Input placeholder="City" {...propertyForm.register("city", { required: "City is required." })} />
                        <Input
                          placeholder="State / Region"
                          {...propertyForm.register("state", { required: "State or region is required." })}
                        />
                        {!isCommercialListing ? (
                          <>
                            <Input
                              placeholder="Bedrooms"
                              type="number"
                              {...propertyForm.register("bedrooms", { required: "Bedrooms are required." })}
                            />
                            <Input
                              placeholder="Bathrooms"
                              type="number"
                              {...propertyForm.register("bathrooms", { required: "Bathrooms are required." })}
                            />
                          </>
                        ) : null}
                        <Input
                          placeholder="Toilets"
                          type="number"
                          {...propertyForm.register("toilets", { required: "Toilets are required." })}
                        />
                        <div className="grid grid-cols-[1fr_110px] gap-3">
                          <Input
                            placeholder="Annual rent"
                            type="number"
                            {...propertyForm.register("annual_rent", { required: "Annual rent is required." })}
                          />
                          <select
                            className="flex h-11 w-full rounded-2xl border border-brand-border bg-white px-4 py-2 text-sm text-brand-dark-text focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                            {...propertyForm.register("currency", { required: true })}
                          >
                            {currencyOptions.map((currency) => (
                              <option key={currency} value={currency}>
                                {currency}
                              </option>
                            ))}
                          </select>
                        </div>
                        <Input
                          placeholder="Security deposit"
                          type="number"
                          className="md:col-span-2"
                          {...propertyForm.register("security_deposit", { required: "Security deposit is required." })}
                        />
                      </div>
                    ) : null}

                    {propertyStep === 2 ? (
                      <div className="space-y-5">
                        <Input
                          placeholder="Amenities separated by commas"
                          {...propertyForm.register("amenities", { required: "Amenities are required." })}
                        />
                        <div className="grid gap-4 lg:grid-cols-2">
                          <div className="space-y-3">
                            <UploadZone
                              label={uploadingPhotos ? "Uploading photos..." : "Property photos"}
                              hint="Add multiple photos at once or one by one. At least 3 photos are required."
                              accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
                              maxFiles={12}
                              existingUrls={photoUrls}
                              disabled={uploadingPhotos}
                              onUploadComplete={(files) => handleFileUpload("photo_urls", files)}
                            />
                            <FilePills urls={photoUrls} onRemove={(url) => removeUploadedFile("photo_urls", url)} />
                          </div>
                          <div className="space-y-3">
                            <UploadZone
                              label={uploadingDocuments ? "Uploading documents..." : "Ownership documents"}
                              hint="Upload documents side by side with photos. At least 1 document is required."
                              accept={{
                                "application/pdf": [".pdf"],
                                "image/*": [".png", ".jpg", ".jpeg"],
                              }}
                              maxFiles={8}
                              existingUrls={documentUrls}
                              disabled={uploadingDocuments}
                              onUploadComplete={(files) => handleFileUpload("document_urls", files)}
                            />
                            <FilePills urls={documentUrls} onRemove={(url) => removeUploadedFile("document_urls", url)} />
                          </div>
                        </div>
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
                        <div className="rounded-2xl border border-brand-border bg-brand-cream/40 px-4 py-4 text-sm text-brand-gray">
                          <div className="flex items-center gap-2 font-semibold text-brand-dark-text">
                            <Upload className="h-4 w-4 text-brand-gold" />
                            Submission guardrails
                          </div>
                          <p className="mt-2 leading-7">
                            The engine will not submit until all visible fields are filled, at least 3 photos are uploaded, and at least 1 document is attached.
                          </p>
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
                        These toggles are saved for your current browser profile so your dashboard can feel consistent every time you return.
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
