import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-brand-black text-brand-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-4 md:px-6">
        <div className="space-y-4">
          <div>
            <p className="text-xl font-bold text-brand-gold">G &amp; G Homes</p>
            <p className="text-sm text-brand-gray">Where Every Home Tells a Story</p>
          </div>
          <p className="text-sm leading-7 text-brand-gray">
            G &amp; G Homes helps landlords and tenants connect directly across multiple cities and regions without house agents.
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-brand-gold">Quick Links</p>
          <div className="space-y-2 text-sm text-brand-gray">
            <Link href="/properties" className="block">Properties</Link>
            <Link href="/about" className="block">About</Link>
            <Link href="/pricing" className="block">Pricing</Link>
            <Link href="/contact" className="block">Contact</Link>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-brand-gold">For Landlords</p>
          <div className="space-y-2 text-sm text-brand-gray">
            <Link href="/landlords" className="block">Why List With Us</Link>
            <Link href="/register" className="block">Create Account</Link>
            <Link href="/dashboard" className="block">Dashboard</Link>
          </div>
        </div>
        <div className="space-y-3 text-sm text-brand-gray">
          <p className="font-semibold uppercase tracking-[0.1em] text-brand-gold">Contact</p>
          <p>+2348078330008</p>
          <p>5 Camp David Estate Street, Abakaliki, Ebonyi State, Nigeria</p>
          <p>RC Number 9020123</p>
        </div>
      </div>
      <div className="border-t border-brand-gold/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-brand-gray md:flex-row md:items-center md:justify-between md:px-6">
          <p>© 2026 G &amp; G Homes LTD. RC Number 9020123.</p>
          <div className="flex gap-4">
            <Link href="/about">Privacy Policy</Link>
            <Link href="/about">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
