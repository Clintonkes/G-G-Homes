"use client";

import { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

export function Toast({
  message,
  duration = 5000,
  onDismiss,
}: {
  message: string | null;
  duration?: number;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onDismiss]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl border border-brand-green/25 bg-white px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.14)]"
    >
      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
      <p className="flex-1 text-sm leading-6 text-brand-dark-text">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 text-brand-gray hover:text-brand-dark-text"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
