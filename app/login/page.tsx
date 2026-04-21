import { Suspense } from "react";

import { LoginForm } from "@/app/login/login-form";
import { AuthShell } from "@/components/marketing/auth-shell";

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center px-4 pt-20 text-brand-white">Loading login...</main>}>
      <AuthShell
        eyebrow="Welcome Back"
        title="Sign in and continue your rental journey."
        description="The dark visual shell now stays continuous here too, so login feels like part of the same site experience instead of a separate page."
        ctaHref="/register"
        ctaLabel="Go to Sign Up"
      >
        <LoginForm />
      </AuthShell>
    </Suspense>
  );
}
