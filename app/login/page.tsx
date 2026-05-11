import { Suspense } from "react";

import { LoginForm } from "@/app/login/login-form";
import { AuthShell } from "@/components/marketing/auth-shell";

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center px-4 pt-20 text-brand-white">Loading login...</main>}>
      <AuthShell
        eyebrow="Welcome Back"
        title="Sign in and continue your rental journey."
        description="Access your full real estate workspace — search properties, manage listings, track inspections, and stay on top of payments, all in one place."
        ctaHref="/register"
        ctaLabel="Go to Sign Up"
      >
        <LoginForm />
      </AuthShell>
    </Suspense>
  );
}
