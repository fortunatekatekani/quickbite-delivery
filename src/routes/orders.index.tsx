import { createFileRoute, Link } from "@tanstack/react-router";
import { Receipt } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { currency } from "@/lib/data";

const statusLabel = {
  preparing: "Preparing",
  "on-the-way": "On the way",
  delivered: "Delivered",
} as const;

export const Route = createFileRoute("/orders/")({
  head: () => ({
    meta: [
      { title: "Your orders — QuickBite" },
      { name: "description", content: "See your current and past QuickBite deliveries." },
      { property: "og:title", content: "Your orders — QuickBite" },
      { property: "og:description", content: "See your current and past QuickBite deliveries." },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const { orders } = useCart();

  return (
    <AppShell>
      <header className="border-b border-border px-5 py-4">
        <h1 className="text-lg font-bold">Your orders</h1>
      </header>

      {orders.length === 0 ? (
        <div className="px-5 py-20 text-center">
          <Receipt className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 font-semibold">No orders yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Your deliveries will appear here.</p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/">Order something</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-3 px-5 py-5">
          {orders.map((o) => (
            <li key={o.id}>
              <Link
                to="/orders/$id"
                params={{ id: o.id }}
                className="block rounded-2xl border border-border bg-card p-4 [box-shadow:var(--shadow-card)]"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold">{o.restaurantName}</h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      o.status === "delivered"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {statusLabel[o.status]}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  #{o.id} · {o.lines.reduce((s, l) => s + l.qty, 0)} items · {currency(o.total)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
