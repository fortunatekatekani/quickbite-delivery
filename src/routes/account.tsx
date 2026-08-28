import { createFileRoute, Link } from "@tanstack/react-router";
import { ChefHat, Bike, ShieldCheck, MapPin, CreditCard, Bell } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — QuickBite" },
      { name: "description", content: "Manage your QuickBite profile, addresses and payment methods." },
      { property: "og:title", content: "Account — QuickBite" },
      { property: "og:description", content: "Manage your QuickBite profile, addresses and payments." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  return (
    <AppShell>
      <header className="rounded-b-3xl bg-[image:var(--gradient-primary)] px-5 pb-8 pt-7 text-primary-foreground">
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-primary-foreground/20 text-lg font-bold">
            FK
          </span>
          <div>
            <h1 className="text-xl font-bold">Fortunate K.</h1>
            <p className="text-xs opacity-90">fortunate@example.com</p>
          </div>
        </div>
      </header>

      <ul className="divide-y divide-border px-5">
        {[
          { icon: MapPin, label: "Saved addresses", detail: "2 addresses" },
          { icon: CreditCard, label: "Payment methods", detail: "Card ••4291" },
          { icon: Bell, label: "Notifications", detail: "Order updates on" },
        ].map((row) => (
          <li key={row.label} className="flex items-center gap-3 py-4">
            <row.icon className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{row.label}</p>
              <p className="text-xs text-muted-foreground">{row.detail}</p>
            </div>
          </li>
        ))}
      </ul>

      <section className="px-5 pb-8">
        <h2 className="text-sm font-semibold">Other QuickBite apps</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Restaurant, driver and admin experiences are coming next.
        </p>
        <div className="mt-3 grid gap-3">
          {[
            { icon: ChefHat, label: "Restaurant dashboard" },
            { icon: Bike, label: "Driver app" },
            { icon: ShieldCheck, label: "Admin console" },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center gap-3 rounded-2xl border border-dashed border-border p-4"
            >
              <row.icon className="h-5 w-5 text-muted-foreground" />
              <p className="flex-1 text-sm font-medium">{row.label}</p>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                Soon
              </span>
            </div>
          ))}
        </div>
        <Link to="/" className="mt-6 inline-block text-sm font-semibold text-primary">
          Back to home
        </Link>
      </section>
    </AppShell>
  );
}
