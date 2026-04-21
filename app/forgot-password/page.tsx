"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthShell } from "@/components/marketing/auth-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<{ email: string }>();

  return (
    <AuthShell
      eyebrow="Password Help"
      title="Reset access without leaving the same site experience."
      description="This page now sits on the same continuous dark background as the rest of the project, so auth screens feel connected to the brand."
      ctaHref="/register"
      ctaLabel="Create an account"
    >
      <Card className="w-full border-0 shadow-none hover:translate-y-0 hover:scale-100 hover:shadow-none">
        <CardContent className="space-y-6 p-8 md:p-10">
          <div className="text-center">
            <p className="text-lg font-bold text-brand-gold">Password Help</p>
            <h2 className="mt-3">Forgot your password?</h2>
          </div>
          <form
            onSubmit={handleSubmit(async ({ email }) => {
              await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
              });
              reset();
              setMessage("If your account exists, reset instructions have been sent.");
            })}
            className="space-y-4"
          >
            <Input placeholder="Email" type="email" {...register("email", { required: true })} />
            {message ? <p className="text-sm text-brand-gray">{message}</p> : null}
            <Button type="submit" className="w-full">Send reset link</Button>
          </form>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
