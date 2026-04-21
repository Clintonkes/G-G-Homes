import { Suspense } from "react";

import { LoginForm } from "@/app/login/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-cream px-4 pt-20">
      <Suspense fallback={<div className="w-full max-w-lg rounded-3xl border border-brand-border bg-white p-8 text-center text-brand-gray">Loading login...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
