import { createFileRoute } from "@tanstack/react-router";
import { MapPin, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { OwnerShell } from "@/components/OwnerShell";
import { Button } from "@/components/ui/button";
import { currency } from "@/lib/data";
import { useOwner } from "@/lib/owner";

export const Route = createFileRoute("/owner/orders")({
  head: () => ({
    meta: [
      { title: "Incoming orders — QuickBite Partners" },
      {
        name: "description",
        content: "Review incoming QuickBite orders with customer details and accept or reject them.",
      },
      { property: "og:title", content: "Incoming orders — QuickBite Partners" },
      {
        property: "og:description",
        content: "Accept or reject incoming orders and see customer address and items.",
      },
    ],
  }),
  component: OwnerOrders,
});

function OwnerOrders() {
  const { orders, decisions, decide } = useOwner();

  return (
    <OwnerShell>
      <header className="border-b border-border px-5 py-4">
        <h1 className="text-lg font-bold">Incoming orders</h1>
        <p className="text-xs text-muted-foreground">Accept or reject new requests.</p>
      </header>

      {orders.length === 0 ? (
        <div className="px-5 py-20 text-center">
          <ClipboardList className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 font-semibold">No orders yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            New customer orders will show up here.
          </p>
        </div>
      ) : (
        <ul className="space-y-3 px-5 py-5">
          {orders.map((o) => {
            const decision = decisions[o.id];
            return (
              <li
                key={o.id}
                className="rounded-2xl border border-border bg-card p-4 [box-shadow:var(--shadow-card)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-semibold">{o.customerName}</h2>
                    <p className="text-xs text-muted-foreground">
                      #{o.id} · {new Date(o.placedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <p className="text-sm font-bold">{currency(o.total)}</p>
                </div>

                <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {o.address}
                </p>

                <ul className="mt-3 space-y-1 border-t border-border pt-3">
                  {o.lines.map((l) => (
                    <li key={l.itemId} className="flex justify-between text-xs">
                      <span>
                        {l.qty}× {l.name}
                      </span>
                      <span className="text-muted-foreground">{currency(l.price * l.qty)}</span>
                    </li>
                  ))}
                </ul>

                {decision ? (
                  <p
                    className={`mt-3 rounded-full px-3 py-1 text-center text-[11px] font-semibold ${
                      decision === "accepted"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {decision === "accepted" ? "Accepted" : "Rejected"}
                  </p>
                ) : (
                  <div className="mt-3 flex gap-2">
                    <Button
                      className="flex-1 rounded-full"
                      onClick={() => {
                        decide(o.id, "accepted");
                        toast.success(`Order #${o.id} accepted`);
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 rounded-full"
                      onClick={() => {
                        decide(o.id, "rejected");
                        toast(`Order #${o.id} rejected`);
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </OwnerShell>
  );
}
