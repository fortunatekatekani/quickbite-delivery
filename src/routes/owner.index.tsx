import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, DollarSign, Clock, UtensilsCrossed } from "lucide-react";
import { OwnerShell } from "@/components/OwnerShell";
import { currency } from "@/lib/data";
import { useOwner } from "@/lib/owner";

export const Route = createFileRoute("/owner/")({
  head: () => ({
    meta: [
      { title: "Partner dashboard — QuickBite" },
      {
        name: "description",
        content: "Track today's orders and sales for your restaurant on QuickBite.",
      },
      { property: "og:title", content: "Partner dashboard — QuickBite" },
      { property: "og:description", content: "Today's orders, sales and pending requests at a glance." },
    ],
  }),
  component: OwnerDashboard,
});

function OwnerDashboard() {
  const { orders, decisions, todayOrders, todaySales, menu } = useOwner();
  const pending = orders.filter((o) => !decisions[o.id]);

  return (
    <OwnerShell>
      <section className="px-5 py-5">
        <h1 className="text-lg font-bold">Today at a glance</h1>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            { icon: ClipboardList, label: "Orders today", value: String(todayOrders) },
            { icon: DollarSign, label: "Sales today", value: currency(todaySales) },
            { icon: Clock, label: "Pending requests", value: String(pending.length) },
            { icon: UtensilsCrossed, label: "Menu items", value: String(menu.length) },
          ].map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border border-border bg-card p-4 [box-shadow:var(--shadow-card)]"
            >
              <c.icon className="h-5 w-5 text-primary" />
              <p className="mt-3 text-xl font-bold">{c.value}</p>
              <p className="text-xs text-muted-foreground">{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Latest requests</h2>
          <Link to="/owner/orders" className="text-xs font-semibold text-primary">
            View all
          </Link>
        </div>
        {pending.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            No pending orders right now.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {pending.slice(0, 3).map((o) => (
              <li
                key={o.id}
                className="rounded-2xl border border-border bg-card p-4 [box-shadow:var(--shadow-card)]"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{o.customerName}</p>
                  <p className="text-sm font-bold">{currency(o.total)}</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  #{o.id} · {o.lines.reduce((s, l) => s + l.qty, 0)} items
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </OwnerShell>
  );
}
