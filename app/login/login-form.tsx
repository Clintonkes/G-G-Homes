"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { login } from "@/lib/api";
import { getPasswordValidationMessage } from "@/lib/password-rules";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordRequirements } from "@/components/ui/password-requirements";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);
  const [error, setError] = useState<string | null>(null);
  const [showSignupToast, setShowSignupToast] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({ mode: "onChange" });
  const password = watch("password", "");

  const onSubmit = handleSubmit(async (values) => {
    try {
      setError(null);
      const response = await login(values.email, values.password);
      setSession(response.access_token, response.user);
      router.push(searchParams.get("returnUrl") || "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  });

  useEffect(() => {
    if (searchParams.get("registered") !== "1") return;
    setShowSignupToast(true);
    const timeout = window.setTimeout(() => setShowSignupToast(false), 4500);
    return () => window.clearTimeout(timeout);
  }, [searchParams]);

  return (
    <>
      {showSignupToast ? (
        <div className="fixed right-4 top-24 z-40 w-[min(92vw,24rem)] rounded-3xl border border-brand-green/20 bg-white/95 px-5 py-4 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-green">Signup successful</p>
          <p className="mt-2 text-sm leading-7 text-brand-dark-text">
            Your account is ready. Log in now to enter your dashboard.
          </p>
        </div>
      ) : null}
      <Card className="w-full max-w-lg">
        <CardContent className="space-y-6 p-8 md:p-10">
          {showSignupToast ? (
            <div className="rounded-2xl border border-brand-green/20 bg-brand-green/10 px-4 py-3 text-sm font-medium text-brand-green">
              Signup successful. Please log in to continue to your dashboard.
            </div>
          ) : null}
          <div className="text-center">
            <p className="text-lg font-bold text-brand-gold">G &amp; G Homes</p>
            <h2 className="mt-3">Welcome Back</h2>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input placeholder="Email" type="email" {...register("email", { required: true })} />
            <PasswordInput
              placeholder="Password"
              {...register("password", {
                validate: getPasswordValidationMessage,
              })}
            />
            <PasswordRequirements password={password} />
            {errors.password ? <p className="text-sm text-brand-red">{errors.password.message}</p> : null}
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-brand-gold">
                Forgot Password?
              </Link>
            </div>
            {error ? <p className="text-sm text-brand-red">{error}</p> : null}
            <Button className="w-full" type="submit">
              Sign In
            </Button>
            <Link href="/register" className="block text-center text-sm font-medium text-brand-dark-text">
              Need an account? <span className="text-brand-gold">Create one here</span>
            </Link>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
