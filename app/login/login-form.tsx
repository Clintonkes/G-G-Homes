"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { login } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<{ email: string; password: string }>();

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await login(values.email, values.password);
      setSession(response.access_token, response.user);
      router.push(searchParams.get("returnUrl") || "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  });

  return (
    <Card className="w-full max-w-lg">
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-lg font-bold text-brand-gold">G &amp; G Homes</p>
          <h2 className="mt-3">Welcome Back</h2>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input placeholder="Email" type="email" {...register("email", { required: true })} />
          <Input placeholder="Password" type="password" {...register("password", { required: true })} />
          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-brand-gold">
              Forgot Password?
            </Link>
          </div>
          {error ? <p className="text-sm text-brand-red">{error}</p> : null}
          <Button className="w-full" type="submit">
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
