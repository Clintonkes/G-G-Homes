"use client";

import { Home, Bell, CreditCard, Heart, LayoutDashboard, PlusCircle, Search, Settings } from "lucide-react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { BrandLockup } from "@/components/layout/brand-lockup";
import { cn, initialsFromName } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const items = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "search", label: "Search", icon: Search },
  { key: "saved", label: "My Listings", icon: Heart },
  { key: "appointments", label: "Appointments", icon: Home },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "list-property", label: "List Property", icon: PlusCircle },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "settings", label: "Settings", icon: Settings },
];

export function DashboardLayout ({
  active,
  onSelect,
  children,
}: {
  active: string;
  onSelect: (key: string) => void;
  children: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 pt-6 md:h-[calc(100vh-2rem)] md:grid-cols-[280px_minmax(0,1fr)] md:px-6 md:pb-6 md:pt-8">
      <aside className="rounded-[2rem] bg-brand-black p-6 text-brand-white md:flex md:h-full md:flex-col md:overflow-hidden">
        <div className="shrink-0">
          <BrandLockup
            className="items-start"
            markWidth={48}
            titleClassName="text-xl"
            subtitle="Unified real estate workspace"
            subtitleClassName="text-sm text-brand-gray"
          />
          <div className="mt-8 flex items-center gap-4 rounded-3xl bg-brand-white/5 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold text-brand-black">{initialsFromName(user?.full_name ?? "GG")}</div>
            <div>
              <p className="font-semibold">{user?.full_name ?? "Guest User"}</p>
              <p className="text-sm text-brand-gray">{user ? "Unified renter / landlord access" : "Guest access"}</p>
            </div>
          </div>
        </div>
        <nav className="mt-8 space-y-2 md:flex-1 md:overflow-y-auto md:overscroll-contain md:pr-1 scrollbar-hidden">
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
          <button
            onClick={() => setLogoutOpen(true)}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-brand-white/80 transition hover:bg-brand-white/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </nav>
      </aside>
      <main className="min-w-0 md:h-full md:overflow-y-auto md:overscroll-contain md:pr-1 scrollbar-hidden">{children}</main>
      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="max-w-md">
          <div className="space-y-4">
            <h3>Log out of your account?</h3>
            <p className="text-sm leading-7 text-brand-gray">
              You will need to sign in again to access your dashboard, saved activity, and listing tools.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => setLogoutOpen(false)}>Cancel</Button>
              <Button variant="dark" type="button" onClick={handleLogout}>Log Out</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
