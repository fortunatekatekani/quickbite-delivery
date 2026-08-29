import { createFileRoute } from "@tanstack/react-router";
import { Bike, CheckCircle2, MapPin, Route as RouteIcon } from "lucide-react";
import { toast } from "sonner";
import { DriverShell } from "@/components/DriverShell";
import { Button } from "@/components/ui/button";
import { currency } from "@/lib/data";
import { statusLabel, useDriver, type DeliveryStatus } from "@/lib/driver";

export const Route = createFileRoute("/driver/deliveries")({
  head: () => ({
    meta: [
      { title: "My trips — QuickBite Driver" },
      {
        name: "description",
        content: "Update your QuickBite delivery status from picked up to on the way to delivered.",
      },
      { property: "og:title", content: "My trips — QuickBite Driver" },
      {
        property: "og:description",
        content: "Track accepted deliveries and move each trip through pickup, on the way and delivered.",
      },
    ],
  }),
  component: DriverDeliveries,
});

const nextLabel: Record<DeliveryStatus, string> = {
  available: "Accept delivery",
  accepted: "Mark picked up",
  "picked-up": "Start delivery",
  "on-the-way": "Mark delivered",
  delivered: "Completed",
};

function DriverDeliveries() {
  const { active, completed, statusOf, advance } = useDriver();

  return (
    <DriverShell>
      <section className="px-5 py-5">
        <h1 className="text-lg font-bold">My trips</h1>
        <p className="text-xs text-muted-foreground">
          {active.length} in progress · {completed.length} completed today
        </p>
      </section>

      {active.length === 0 ? (
        <div className="px-5 pb-10 text-center">
          <Bike className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 font-semibold">No active trips</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Accept a request from the Requests tab to get started.
          </p>
        </div>
      ) : (
        <ul className="space-y-3 px-5 pb-6">
          {active.map((j) => {
            const status = statusOf(j.id);
            return (
              <li
                key={j.id}
                className="rounded-2xl border border-border bg-card p-4 [box-shadow:var(--shadow-card)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-semibold">{j.restaurantName}</h2>
                    <p className="text-xs text-muted-foreground">
                      #{j.id} · {j.distanceKm} km
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                    {statusLabel[status]}
                  </span>
                </div>

                <div className="mt-3 space-y-2 border-t border-border pt-3 text-xs">
                  <p className="flex items-start gap-1.5">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>
                      <span className="font-semibold">Pickup · </span>
                      {j.pickupAddress}
                    </span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <RouteIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>
                      <span className="font-semibold">Drop-off · </span>
                      {j.dropoffAddress} ({j.customerName})
                    </span>
                  </p>
                  <p className="font-semibold text-primary">Payout {currency(j.payout)}</p>
                </div>

                <Button
                  className="mt-3 w-full rounded-full"
                  onClick={() => {
                    advance(j.id);
                    toast.success(`#${j.id} → ${nextLabel[status]}`);
                  }}
                >
                  {nextLabel[status]}
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      {completed.length > 0 && (
        <section className="px-5 pb-8">
          <h2 className="text-sm font-semibold">Completed</h2>
          <ul className="mt-3 space-y-2">
            {completed.map((j) => (
              <li
                key={j.id}
                className="flex items-center gap-2 rounded-2xl border border-border bg-card p-3 text-xs"
              >
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="flex-1 font-medium">{j.restaurantName}</span>
                <span className="font-semibold text-primary">{currency(j.payout)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </DriverShell>
  );
}
