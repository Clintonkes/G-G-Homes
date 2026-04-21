"use client";

import Image from "next/image";
import { useState } from "react";

export function PropertyGallery({ photoUrls, videoUrls, title }: { photoUrls: string[]; videoUrls: string[]; title: string }) {
  const images = photoUrls.length
    ? photoUrls
    : ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80&auto=format&fit=crop"];
  const [active, setActive] = useState(images[0]);

  return (
    <div className="space-y-4">
      <div className="relative h-[28rem] overflow-hidden rounded-[2rem]">
        <Image src={active} alt={title} fill className="object-cover" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.slice(0, 4).map((url) => (
          <button key={url} className="relative h-24 overflow-hidden rounded-2xl" onClick={() => setActive(url)}>
            <Image src={url} alt={title} fill className="object-cover" />
          </button>
        ))}
      </div>
      {videoUrls[0] ? (
        <video controls className="w-full rounded-[2rem] border border-brand-border">
          <source src={videoUrls[0]} />
        </video>
      ) : null}
    </div>
  );
}
