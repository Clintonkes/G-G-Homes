"use client";

import { useEffect } from "react";

export function HomeScrollTarget() {
  useEffect(() => {
    const target = sessionStorage.getItem("gg-scroll-target");
    if (!target) return;

    sessionStorage.removeItem("gg-scroll-target");
    window.requestAnimationFrame(() => {
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }, []);

  return null;
}
