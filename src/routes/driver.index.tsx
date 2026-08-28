import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Navigation, Package, Route as RouteIcon } from "lucide-react";
import { toast } from "sonner";
import { DeliveryMap } from "@/components/DeliveryMap";
import { DriverShell } from "@/components/DriverShell";
import { Button } from "@/components/ui/button";
import { currency } from "@/lib/data";
import { useDriver } from "@/lib/driver";

export const Route = createFileRoute("/driver/")({
  head: () => ({
    meta: [
      { title: "Delivery requests — QuickBite Driver" },
      {
        name: "description",
        content: "See available QuickBite delivery requests on a map with pickup and drop-off addresses.",
      },
      { property: "og:title", content: "Delivery requests — QuickBite Driver" },
      {
        property: "og:description",
        content: "Available deliveries near you with pickup, drop-off and payout in Rand.",
      },
    ],
  }),
  component: DriverRequests;
});

function DriverRequests() {
  const { available, accept, active } = useDriver();

  return (
    <DriverShell>
      <section className="px-5 py-5">
        <h1 className="text-lg font-bold">Available deliveries</h1>
        <p className="text-xs text-muted-foreground">
          {available.length} request{available.length === 1 ? "" : "s"} near you ·{" "}
          {active.length} in progress
        </p>
        <DeliveryMap jobs={available} className="mt-4" />
      </section>

      {available.length === 0 ? (
        <div className="px-5 pb-20 text-center">
          <Navigation className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 font-semibold">No requests right now</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Check your trips tab to update deliveries you already accepted.
          </p>
        </div>
      ) : (
        <ul className="space-y-3 px-5 pb-8">
          {available.map((j) => (
            <li
              key={j.id}
              className="rounded-2xl border border-border bg-card p-4 [box-shadow:var(--shadow-card)]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold">{j.restaurantName}</h2>
                  <p className="text-xs text-muted-foreground">
                    #{j.id} · {j.items} items · {j.distanceKm} km
                  </p>
                </div>
                <p className="text-sm font-bold text-primary">{currency(j.payout)}</p>
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
              </div>

              <Button
                className="mt-3 w-full rounded-full"
                onClick={() => {
                  accept(j.id);
                  toast.success(`Delivery #${j.id} accepted`);
                }}
              >
                <Package className="h-4 w-4" /> Accept delivery
              </Button>
            </li>
          ))}
        </ul>
      )}
    </DriverShell>
  );
}
