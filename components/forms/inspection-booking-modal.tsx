"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { createAppointment } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function InspectionBookingModal({ propertyId, propertyTitle }: { propertyId: string; propertyTitle: string }) {
  const token = useAuthStore((state) => state.token);
  const [message, setMessage] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<{ scheduledDate: string; tenantNotes: string }>();

  const onSubmit = handleSubmit(async (values) => {
    if (!token) {
      window.location.href = `/login?returnUrl=/properties/${propertyId}`;
      return;
    }
    try {
      await createAppointment(token, {
        property_id: propertyId,
        scheduled_date: values.scheduledDate,
        tenant_notes: values.tenantNotes,
      });
      setMessage("Inspection request submitted successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to book inspection.");
    }
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Schedule Inspection</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-gold">Book inspection</p>
            <h3 className="mt-2">{propertyTitle}</h3>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input type="datetime-local" {...register("scheduledDate", { required: true })} />
            <Textarea placeholder="Preferred time, access notes, or questions" {...register("tenantNotes")} />
            {message ? <p className="text-sm text-brand-gray">{message}</p> : null}
            <Button type="submit" className="w-full">Confirm Request</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
