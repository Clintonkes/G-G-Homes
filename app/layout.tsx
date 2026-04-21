import type { Metadata } from "next";

import "@/app/globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "RentEase by G & G Homes",
  description: "Where Every Home Tells a Story. Direct landlord-to-tenant rentals across Ebonyi State with zero agent fees.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen bg-brand-black">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(217,175,60,0.2),_transparent_28%),linear-gradient(180deg,_#070707_0%,_#101010_48%,_#070707_100%)]" />
          <div className="absolute left-[-10%] top-[15%] h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl" />
          <div className="absolute bottom-[8%] right-[-6%] h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl" />
        </div>
        <QueryProvider>
          <Navbar />
          <div className="relative z-10">
            {children}
            <Footer />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
