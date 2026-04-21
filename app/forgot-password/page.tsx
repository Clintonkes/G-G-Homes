"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<{ email: string }>();

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-cream px-4 pt-20">
      <Card className="w-full max-w-lg">
        <CardContent className="space-y-6">
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
    </main>
  );
}
