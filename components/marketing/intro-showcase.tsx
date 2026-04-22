"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

const slides = [
  {
    title: "G & G Properties",
    copy: "Verified homes, direct access to landlords, and a smoother rental experience across Ebonyi State.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80&auto=format&fit=crop",
  },
  {
    title: "Elegant spaces that move with you",
    copy: "Browse flats, duplexes, and family homes with inspection-ready details before you commit.",
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1600&q=80&auto=format&fit=crop",
  },
  {
    title: "RentEase by G & G Homes",
    copy: "One account to search, inspect, pay, save, and list properties with zero agent friction.",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80&auto=format&fit=crop",
  },
];

export function IntroShowcase() {
  const [hidden, setHidden] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("gg-intro-seen");
    if (alreadySeen) return;

    setHidden(false);
    sessionStorage.setItem("gg-intro-seen", "true");

    const interval = window.setInterval(() => emblaApi?.scrollNext(), 2200);
    const timeout = window.setTimeout(() => setHidden(true), 6200);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [emblaApi]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 transition-all duration-1000 ease-out ${hidden ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100"}`}
      aria-hidden={hidden}
    >
      <div className="absolute inset-0 bg-brand-black/95 backdrop-blur-md" />
      <div className="relative flex h-full items-center justify-center px-4">
        <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-brand-gold/20 bg-brand-black/80 shadow-[0_30px_120px_rgba(0,0,0,0.5)]">
          <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
            <div className="p-8 md:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">Welcome to RentEase</p>
              <h2 className="mt-4 text-4xl font-semibold text-brand-white md:text-5xl">G &amp; G Properties</h2>
              <p className="mt-5 max-w-xl text-lg leading-9 text-brand-white/75">
                The original intro experience is back first, then the full website opens with the same premium property-led mood.
              </p>
            </div>
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {slides.map((slide) => (
                  <div key={slide.title} className="relative min-w-0 flex-[0_0_100%]">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${slide.image}')` }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/45 to-transparent" />
                    <div className="relative flex min-h-[320px] flex-col justify-end p-8 text-brand-white">
                      <p className="text-xs uppercase tracking-[0.2em] text-brand-gold">Property Slide</p>
                      <h3 className="mt-3 text-2xl">{slide.title}</h3>
                      <p className="mt-3 text-base leading-8 text-brand-white/75">{slide.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
