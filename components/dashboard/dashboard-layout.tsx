"use client";

import Image from "next/image";
import Link from "next/link";
import { Home, Bell, CreditCard, Heart, LayoutDashboard, PlusCircle, Search, Settings } from "lucide-react";

import { cn, initialsFromName } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";

const items = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "search", label: "Search", icon: Search },
  { key: "saved", label: "Saved", icon: Heart },
  { key: "appointments", label: "Appointments", icon: Home },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "list-property", label: "List Property", icon: PlusCircle },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "settings", label: "Settings", icon: Settings },
];

export function DashboardLayout({
  active,
  onSelect,
  children,
}: {
  active: string;
  onSelect: (key: string) => void;
  children: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 pt-28 md:grid-cols-[280px_1fr] md:px-6">
      <aside className="rounded-[2rem] bg-brand-black p-6 text-brand-white">
        <Link href="/" className="block">
          <div className="inline-flex rounded-[1.5rem] bg-white/95 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <Image
              src="/gghomes-logo.png"
              alt="G & G Homes"
              width={220}
              height={71}
              className="h-auto w-[220px]"
              priority
            />
          </div>
          <p className="mt-3 text-sm text-brand-gray">Unified real estate workspace</p>
        </Link>
        <div className="mt-8 flex items-center gap-4 rounded-3xl bg-brand-white/5 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold text-brand-black">{initialsFromName(user?.full_name ?? "GG")}</div>
          <div>
            <p className="font-semibold">{user?.full_name ?? "Guest User"}</p>
            <p className="text-sm text-brand-gray">{user ? "Unified renter / landlord access" : "Guest access"}</p>
          </div>
        </div>
        <nav className="mt-8 space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => onSelect(item.key)}
                className={cn("flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition", active === item.key ? "bg-brand-gold text-brand-black" : "text-brand-white/80 hover:bg-brand-white/10")}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}
