"use client";

import { usePathname } from "next/navigation";

import { ApiDebugLine } from "@/components/layout/api-debug-line";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export function AppShell({
  children,
  proxyTarget,
}: {
  children: React.ReactNode;
  proxyTarget: string;
}) {
  const pathname = usePathname();
  const inAccountArea = pathname.startsWith("/dashboard");

  return (
    <>
      {inAccountArea ? null : <Navbar />}
      {children}
      {inAccountArea ? null : <Footer />}
      <ApiDebugLine proxyTarget={proxyTarget} />
    </>
  );
}
