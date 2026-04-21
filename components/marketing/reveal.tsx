"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  distance = 28,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
}) {
  return (
    <motion.div
      className={cn("will-change-transform", className)}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
