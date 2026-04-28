"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function ApiDebugLine({ proxyTarget }: { proxyTarget: string }) {
  const pathname = usePathname();
  const [status, setStatus] = useState<"checking" | "connected" | "missing">("checking");

  useEffect(() => {
    let cancelled = false;

    async function checkBackend() {
      setStatus("checking");
      try {
        const response = await fetch("/api/health", { cache: "no-store" });
        if (!cancelled) {
          setStatus(response.ok ? "connected" : "missing");
        }
      } catch {
        if (!cancelled) {
          setStatus("missing");
        }
      }
    }

    checkBackend();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return (
    <div className="fixed bottom-3 right-3 z-50 rounded-full border border-brand-gold/30 bg-brand-black/90 px-3 py-1.5 text-[11px] text-brand-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur">
      API Proxy {"->"} {proxyTarget} · Backend: {status}
    </div>
  );
}
