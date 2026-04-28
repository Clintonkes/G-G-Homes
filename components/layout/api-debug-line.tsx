const proxyTarget = process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "missing";

export function ApiDebugLine() {
  return (
    <div className="fixed bottom-3 right-3 z-50 rounded-full border border-brand-gold/30 bg-brand-black/90 px-3 py-1.5 text-[11px] text-brand-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur">
      API Proxy {"->"} {proxyTarget}
    </div>
  );
}
