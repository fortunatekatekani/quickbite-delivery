import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { currency, getRestaurant } from "@/lib/data";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — QuickBite" },
      { name: "description", content: "Review your QuickBite order before checkout." },
      { property: "og:title", content: "Your cart — QuickBite" },
      { property: "og:description", content: "Review your QuickBite order before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, subtotal, setQty } = useCart();
  const restaurant = cart.restaurantId ? getRestaurant(cart.restaurantId) : undefined;
  const deliveryFee = restaurant?.deliveryFee ?? 0;
  const serviceFee = cart.lines.length ? 1.5 : 0;
  const total = subtotal + deliveryFee + serviceFee;

  return (
    <AppShell>
      <header className="flex items-center gap-3 border-b border-border px-5 py-4">
        <Link to="/" aria-label="Back" className="text-muted-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold">Your cart</h1>
      </header>

      {cart.lines.length === 0 ? (
        <div className="px-5 py-20 text-center">
          <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 font-semibold">Your cart is empty</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a few dishes and they will show up here.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/">Browse restaurants</Link>
          </Button>
        </div>
      ) : (
        <div className="px-5 py-5">
          <p className="text-xs text-muted-foreground">Order from</p>
          <h2 className="font-semibold">{cart.restaurantName}</h2>

          <div className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {cart.lines.map((line) => (
              <div key={line.itemId} className="flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold">{line.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{currency(line.price)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    aria-label={`Decrease ${line.name}`}
                    className="h-8 w-8 rounded-full"
                    onClick={() => setQty(line.itemId, line.qty - 1)}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <span className="w-5 text-center text-sm font-semibold">{line.qty}</span>
                  <Button
                    size="icon"
                    aria-label={`Increase ${line.name}`}
                    className="h-8 w-8 rounded-full"
                    onClick={() => setQty(line.itemId, line.qty + 1)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <span className="w-16 text-right text-sm font-semibold">
                  {currency(line.price * line.qty)}
                </span>
              </div>
            ))}
          </div>

          <dl className="mt-5 space-y-2 rounded-2xl bg-muted p-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{currency(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd>{deliveryFee === 0 ? "Free" : currency(deliveryFee)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Service fee</dt>
              <dd>{currency(serviceFee)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-semibold">
              <dt>Total</dt>
              <dd>{currency(total)}</dd>
            </div>
          </dl>

          <Button asChild size="lg" className="mt-6 w-full rounded-full">
            <Link to="/checkout">Go to checkout</Link>
          </Button>
        </div>
      )}
    </AppShell>
  );
}
