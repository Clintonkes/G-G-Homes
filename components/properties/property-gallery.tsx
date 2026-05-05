"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { isVideoUrl, resolveMediaUrl } from "@/lib/media";

export function PropertyGallery({ photoUrls, videoUrls, title }: { photoUrls: string[]; videoUrls: string[]; title: string }) {
  const media = useMemo(() => {
    const uploaded = [
      ...photoUrls.map((url) => ({ type: "image" as const, url: resolveMediaUrl(url) })),
      ...videoUrls.map((url) => ({ type: "video" as const, url: resolveMediaUrl(url) })),
    ].filter((item) => item.url);

    return uploaded.length
      ? uploaded
      : [
          {
            type: "image" as const,
            url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80&auto=format&fit=crop",
          },
        ];
  }, [photoUrls, videoUrls]);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = media[activeIndex] ?? media[0];

  useEffect(() => {
    setActiveIndex(0);
  }, [media]);

  useEffect(() => {
    if (media.length <= 1) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % media.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, [media.length]);

  return (
    <div className="space-y-4">
      <div className="relative h-[18rem] overflow-hidden rounded-[1.5rem] bg-brand-black sm:h-[28rem] sm:rounded-[2rem]">
        {active.type === "video" || isVideoUrl(active.url) ? (
          <video key={active.url} controls muted playsInline className="h-full w-full object-cover">
            <source src={active.url} />
          </video>
        ) : (
          <Image src={active.url} alt={title} fill className="object-cover" unoptimized />
        )}
      </div>
      <div className="grid grid-cols-4 gap-3 md:grid-cols-6">
        {media.slice(0, 6).map((item, index) => (
          <button
            key={`${item.url}-${index}`}
            type="button"
            className={cn(
              "relative h-20 overflow-hidden rounded-2xl border transition sm:h-24",
              index === activeIndex ? "border-brand-gold" : "border-transparent hover:border-brand-gold/60",
            )}
            onClick={() => setActiveIndex(index)}
          >
            {item.type === "video" || isVideoUrl(item.url) ? (
              <>
                <video muted playsInline className="h-full w-full object-cover">
                  <source src={item.url} />
                </video>
                <span className="absolute inset-0 grid place-items-center bg-brand-black/35 text-brand-white">
                  <Play className="h-5 w-5" />
                </span>
              </>
            ) : (
              <Image src={item.url} alt={title} fill className="object-cover" unoptimized />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
