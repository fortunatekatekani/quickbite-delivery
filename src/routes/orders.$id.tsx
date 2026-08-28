import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bike, ChefHat, PackageCheck, Phone, MessageSquare } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useCart, type OrderStatus } from "@/lib/cart";
import { currency } from "@/lib/data";

const steps: { id: OrderStatus; label: string; detail: string; icon: typeof ChefHat }[] = [
  { id: "preparing", label: "Preparing", detail: "The kitchen is cooking your food", icon: ChefHat },
  { id: "on-the-way", label: "On the way", detail: "Sam is riding to your address", icon: Bike },
  { id: "delivered", label: "Delivered", detail: "Enjoy your meal!", icon: PackageCheck },
];

export const Route = createFileRoute("/orders/$id")({
  head: () => ({
    meta: [
      { title: "Track your order — QuickBite" },
      { name: "description", content: "Follow your QuickBite order from the kitchen to your door." },
      { property: "og:title", content: "Track your order — QuickBite" },
      { property: "og:description", content: "Follow your QuickBite order from kitchen to door." },
    ],
  }),
  component: TrackOrderPage,
});

function TrackOrderPage() {
  const { id } = Route.useParams();
  const { getOrder } = useCart();
  const order = getOrder(id);

  if (!order) {
    return (
      <AppShell>
        <div className="px-5 py-20 text-center">
          <h1 className="font-semibold">Order not found</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            We couldn&apos;t find order #{id} on this device.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/orders">Back to orders</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const currentIndex = steps.findIndex((s) => s.id === order.status);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <AppShell>
      <header className="rounded-b-3xl bg-[image:var(--gradient-primary)] px-5 pb-7 pt-5 text-primary-foreground">
        <Link to="/orders" aria-label="Back to orders" className="inline-flex opacity-90">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="mt-4 text-xs opacity-90">Order #{order.id}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          {steps[currentIndex]?.label ?? "Preparing"}
        </h1>
        <p className="mt-1 text-sm opacity-90">{steps[currentIndex]?.detail}</p>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-primary-foreground/30">
          <div
            className="h-full rounded-full bg-primary-foreground transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <ol className="space-y-4 px-5 pt-6">
        {steps.map((step, i) => {
          const done = i <= currentIndex;
          return (
            <li key={step.id} className="flex items-start gap-3">
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border ${
                  done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                <step.icon className="h-5 w-5" />
              </span>
              <div className="pt-1.5">
                <p className={`text-sm font-semibold ${done ? "" : "text-muted-foreground"}`}>
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground">{step.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <section className="mt-6 px-5">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
            SM
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Sam M.</p>
            <p className="text-xs text-muted-foreground">Your driver · 4.9 ★</p>
          </div>
          <Button size="icon" variant="outline" aria-label="Call driver" className="rounded-full">
            <Phone className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" aria-label="Message driver" className="rounded-full">
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <section className="px-5 py-6">
        <h2 className="text-sm font-semibold">{order.restaurantName}</h2>
        <p className="mt-1 text-xs text-muted-foreground">Delivering to {order.address}</p>
        <dl className="mt-3 space-y-2 rounded-2xl bg-muted p-4 text-sm">
          {order.lines.map((l) => (
            <div key={l.itemId} className="flex justify-between">
              <dt className="text-muted-foreground">
                {l.qty}× {l.name}
              </dt>
              <dd>{currency(l.price * l.qty)}</dd>
            </div>
          ))}
          <div className="flex justify-between border-t border-border pt-2 font-semibold">
            <dt>Total paid</dt>
            <dd>{currency(order.total)}</dd>
          </div>
        </dl>
      </section>
    </AppShell>
  );
}
