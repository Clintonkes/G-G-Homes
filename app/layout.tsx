import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import "@/app/globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "G & G Homes by RentEase",
  description: "Where Every Home Tells a Story. Direct landlord-to-tenant rentals across Ebonyi State with zero agent fees.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <QueryProvider>
          <Navbar />
          {children}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
