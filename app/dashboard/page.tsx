"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { fetchAppointments, fetchNotifications, fetchPayments, fetchProperties, fetchSaved, createProperty } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { RentalReminderBanner } from "@/components/dashboard/rental-reminder-banner";
import { PropertyCard } from "@/components/properties/property-card";
import { StatusBadge } from "@/components/properties/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

export default function DashboardPage() {
  const [active, setActive] = useState("overview");
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

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
  const saved = useQuery({
    queryKey: ["saved", token],
    queryFn: () => fetchSaved(token ?? ""),
    enabled: !!token,
  });
  const myListings = useQuery({
    queryKey: ["my-properties", token],
    queryFn: () => fetchProperties("?include_mine=true"),
    enabled: !!token,
  });

  const expiringPayment = useMemo(() => payments.data?.find((payment) => payment.tenancy_end_date), [payments.data]);
  const propertyForm = useForm({
    defaultValues: {
      title: "",
      description: "",
      address: "",
      neighbourhood: "",
      city: "Abakaliki",
      state: "Ebonyi State",
      property_type: "FLAT",
      bedrooms: 2,
      bathrooms: 2,
      toilets: 2,
      annual_rent: 1200000,
      amenities: "Water Supply, Prepaid Meter, Parking Space",
      photo_urls: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80&auto=format&fit=crop,https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80&auto=format&fit=crop,https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80&auto=format&fit=crop",
      document_urls: "https://example.com/document.pdf",
    },
  });

  const submitProperty = propertyForm.handleSubmit(async (values) => {
    if (!token) return;
    await createProperty(token, {
      ...values,
      bathrooms: Number(values.bathrooms),
      bedrooms: Number(values.bedrooms),
      toilets: Number(values.toilets),
      annual_rent: Number(values.annual_rent),
      is_furnished: false,
      has_water: true,
      has_electricity: true,
      has_security: true,
      has_parking: true,
      security_deposit: 0,
      amenities: values.amenities.split(",").map((item) => item.trim()),
      photo_urls: values.photo_urls.split(",").map((item) => item.trim()),
      video_urls: [],
      document_urls: values.document_urls.split(",").map((item) => item.trim()),
    });
    propertyForm.reset();
    myListings.refetch();
    setActive("overview");
  });

  if (!token) {
    return <main className="mx-auto max-w-4xl px-4 pb-20 pt-32 md:px-6"><h1>Please sign in to continue.</h1></main>;
  }

  return (
    <DashboardLayout active={active} onSelect={setActive}>
      {active === "overview" ? (
        <div className="space-y-6">
          {expiringPayment ? <RentalReminderBanner daysRemaining={30} propertyAddress="Your active property" paymentLink="/pricing" /> : null}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-gold">Overview</p>
            <h1 className="mt-3">Welcome back, {user?.full_name?.split(" ")[0]}</h1>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {[
              ["Saved Properties", saved.data?.length ?? 0],
              ["Upcoming Inspections", appointments.data?.length ?? 0],
              ["My Listings", myListings.data?.items.length ?? 0],
              ["Notifications", notifications.data?.length ?? 0],
            ].map(([label, value]) => (
              <Card key={label}><CardContent><p className="text-sm text-brand-gray">{label}</p><p className="mt-2 text-3xl font-bold text-brand-gold">{value}</p></CardContent></Card>
            ))}
          </div>
        </div>
      ) : null}

      {active === "saved" ? (
        <div className="space-y-6">
          <h2>Saved Properties</h2>
          <div className="grid gap-6 xl:grid-cols-2">
            {saved.data?.map((item) => <PropertyCard key={item.id} property={item.property} />)}
          </div>
        </div>
      ) : null}

      {active === "appointments" ? (
        <Card>
          <CardContent>
            <h2 className="mb-6">My Appointments</h2>
            <Table>
              <thead><tr className="border-b border-brand-border text-sm text-brand-gray"><th className="pb-3">Date</th><th className="pb-3">Status</th><th className="pb-3">Outcome</th></tr></thead>
              <tbody>
                {appointments.data?.map((item) => (
                  <tr key={item.id} className="border-b border-brand-border/70">
                    <td className="py-4">{new Date(item.scheduled_date).toLocaleString()}</td>
                    <td className="py-4"><StatusBadge value={item.status} /></td>
                    <td className="py-4 text-sm text-brand-gray">{item.outcome.replaceAll("_", " ")}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardContent>
        </Card>
      ) : null}

      {active === "payments" ? (
        <Card>
          <CardContent>
            <h2 className="mb-6">Payments</h2>
            <Table>
              <thead><tr className="border-b border-brand-border text-sm text-brand-gray"><th className="pb-3">Reference</th><th className="pb-3">Amount</th><th className="pb-3">Status</th></tr></thead>
              <tbody>
                {payments.data?.map((item) => (
                  <tr key={item.id} className="border-b border-brand-border/70">
                    <td className="py-4">{item.flutterwave_reference}</td>
                    <td className="py-4">₦{item.gross_amount.toLocaleString("en-NG")}</td>
                    <td className="py-4"><StatusBadge value={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardContent>
        </Card>
      ) : null}

      {active === "notifications" ? (
        <div className="space-y-4">
          <h2>Notifications</h2>
          {notifications.data?.map((item) => (
            <Card key={item.id}><CardContent><p className="font-semibold">{item.title}</p><p className="mt-2 text-sm leading-7 text-brand-gray">{item.message}</p></CardContent></Card>
          ))}
        </div>
      ) : null}

      {active === "list-property" ? (
        <Card>
          <CardContent>
            <h2 className="mb-6">Add New Property</h2>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={submitProperty}>
              <Input placeholder="Property title" {...propertyForm.register("title")} />
              <Input placeholder="Property type" {...propertyForm.register("property_type")} />
              <Input placeholder="Bedrooms" type="number" {...propertyForm.register("bedrooms")} />
              <Input placeholder="Bathrooms" type="number" {...propertyForm.register("bathrooms")} />
              <Input placeholder="Toilets" type="number" {...propertyForm.register("toilets")} />
              <Input placeholder="Annual rent" type="number" {...propertyForm.register("annual_rent")} />
              <Input placeholder="Address" className="md:col-span-2" {...propertyForm.register("address")} />
              <Input placeholder="Neighbourhood" {...propertyForm.register("neighbourhood")} />
              <Input placeholder="City" {...propertyForm.register("city")} />
              <Textarea placeholder="Property description" className="md:col-span-2" {...propertyForm.register("description")} />
              <Input placeholder="Amenities separated by commas" className="md:col-span-2" {...propertyForm.register("amenities")} />
              <Input placeholder="Photo URLs separated by commas" className="md:col-span-2" {...propertyForm.register("photo_urls")} />
              <Input placeholder="Document URLs separated by commas" className="md:col-span-2" {...propertyForm.register("document_urls")} />
              <div className="md:col-span-2">
                <Button type="submit">Submit for Verification</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}
    </DashboardLayout>
  );
}
