"use client";

import Image from "next/image";
import { useState } from "react";

const PLACEHOLDER = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80&auto=format&fit=crop";

export function SafeImage({
  src,
  alt,
  fallback = PLACEHOLDER,
  ...props
}: React.ComponentProps<typeof Image> & { fallback?: string }) {
  const [errored, setErrored] = useState(false);

  return (
    <Image
      {...props}
      src={errored || !src ? fallback : src}
      alt={alt}
      unoptimized
      onError={() => setErrored(true)}
    />
  );
}
