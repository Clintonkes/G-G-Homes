"use client";

import { useEffect, useRef, useState } from "react";

export function CountUpStat({
  value,
  label,
  prefix = "",
  suffix = "",
  duration = 1400,
}: {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;

    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      setCount(Math.round(progress * value));
      if (progress < 1) window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  }, [active, duration, value]);

  return (
    <div ref={ref} className="group rounded-[1.75rem] border border-brand-gold/15 bg-white/5 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:border-brand-gold/40 hover:bg-white/10">
      <p className="text-3xl font-bold text-brand-gold md:text-4xl">
        {prefix}
        {count.toLocaleString("en-NG")}
        {suffix}
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-brand-white/75">{label}</p>
    </div>
  );
}
