"use client";

import { useEffect, useState } from "react";

import { resolveMediaUrl } from "@/lib/media";
import { SafeImage } from "@/components/ui/safe-image";

const PLACEHOLDER = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80&auto=format&fit=crop";

export function MiniSlideshow({ photoUrls, title }: { photoUrls: string[]; title: string }) {
  const images = photoUrls.length > 0
    ? photoUrls.map((url) => resolveMediaUrl(url)).filter(Boolean)
    : [PLACEHOLDER];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [photoUrls]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % images.length), 3500);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative h-full w-full">
      <SafeImage
        key={images[index]}
        src={images[index]}
        alt={title}
        fill
        className="object-cover transition-opacity duration-700"
        fallback={PLACEHOLDER}
      />
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Photo ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
