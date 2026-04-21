"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { register as registerUser } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RegisterPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<{ full_name: string; email: string; phone_number: string; password: string }>();

  const submit = (role: "TENANT" | "LANDLORD") =>
    handleSubmit(async (values) => {
      try {
        const response = await registerUser({ ...values, role });
        setSession(response.access_token, response.user);
        router.push("/dashboard");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Registration failed");
      }
    });

  const fields = (
    <>
      <Input placeholder="Full name" {...register("full_name", { required: true })} />
      <Input placeholder="Email" type="email" {...register("email", { required: true })} />
      <Input placeholder="Phone number" {...register("phone_number", { required: true })} />
      <Input placeholder="Password" type="password" {...register("password", { required: true })} />
      {error ? <p className="text-sm text-brand-red">{error}</p> : null}
    </>
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-cream px-4 pt-20">
      <Card className="w-full max-w-2xl">
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-lg font-bold text-brand-gold">Create your account</p>
            <h2 className="mt-3">One sign-up, full platform access</h2>
          </div>
          <Tabs defaultValue="tenant">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tenant">Tenant</TabsTrigger>
              <TabsTrigger value="landlord">Landlord</TabsTrigger>
            </TabsList>
            <TabsContent value="tenant">
              <form className="mt-6 space-y-4" onSubmit={submit("TENANT")}>
                {fields}
                <Button className="w-full">Create Tenant Account</Button>
              </form>
            </TabsContent>
            <TabsContent value="landlord">
              <form className="mt-6 space-y-4" onSubmit={submit("LANDLORD")}>
                {fields}
                <p className="text-sm leading-7 text-brand-gray">Landlords can list properties, upload documents, and manage inspections from the same dashboard after sign in.</p>
                <Button className="w-full">Create Landlord Account</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
