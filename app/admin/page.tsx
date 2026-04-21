import { Card, CardContent } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 md:px-6">
      <h1>Admin Workspace</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-4">
        {["Total Users", "Total Properties", "Pending Verifications", "Pending Remittances"].map((label) => (
          <Card key={label}><CardContent><p className="text-sm text-brand-gray">{label}</p><p className="mt-2 text-3xl font-bold text-brand-gold">API</p></CardContent></Card>
        ))}
      </div>
    </main>
  );
}
