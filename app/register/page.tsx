"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { register as registerUser } from "@/lib/api";
import { getPasswordValidationMessage } from "@/lib/password-rules";
import { AuthShell } from "@/components/marketing/auth-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordRequirements } from "@/components/ui/password-requirements";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ full_name: string; email: string; phone_number: string; password: string }>({ mode: "onChange" });
  const password = watch("password", "");

  const submit = handleSubmit(async (values) => {
    try {
      setError(null);
      await registerUser({ ...values, role: "LANDLORD" });
      router.push("/login?registered=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  });

  return (
    <AuthShell
      eyebrow="One Unified Sign Up"
      title="Create one account and unlock both renter and landlord tools."
      description="Create your account once, then sign in to access your full real estate workspace."
      ctaHref="/login"
      ctaLabel="Already have an account?"
    >
      <Card className="w-full border-0 shadow-none hover:translate-y-0 hover:scale-100 hover:shadow-none">
        <CardContent className="space-y-6 p-8 md:p-10">
          <div className="text-center">
            <p className="text-lg font-bold text-brand-gold">Create your account</p>
            <h2 className="mt-3">One sign-up, full platform access</h2>
            <p className="mt-3 text-sm leading-7 text-brand-gray">
              Save properties, book inspections, manage payments, and list homes from the same account.
            </p>
          </div>
          <form className="space-y-4" onSubmit={submit}>
            <Input placeholder="Full name" {...register("full_name", { required: true })} />
            <Input placeholder="Email" type="email" {...register("email", { required: true })} />
            <Input placeholder="Phone number" {...register("phone_number", { required: true })} />
            <PasswordInput
              placeholder="Password"
              {...register("password", {
                validate: getPasswordValidationMessage,
              })}
            />
            <PasswordRequirements password={password} />
            {errors.password ? <p className="text-sm text-brand-red">{errors.password.message}</p> : null}
            {error ? <p className="text-sm text-brand-red">{error}</p> : null}
            <p className="rounded-2xl bg-brand-cream px-4 py-3 text-sm leading-7 text-brand-gray">
              After signup, you will be redirected to login and then taken into your full dashboard workspace.
            </p>
            <Button className="w-full">Create Account</Button>
            <Link href="/login" className="block text-center text-sm font-medium text-brand-dark-text">
              Already registered? <span className="text-brand-gold">Sign in</span>
            </Link>
          </form>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
