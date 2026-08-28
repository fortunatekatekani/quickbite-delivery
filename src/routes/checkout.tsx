import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CreditCard, Wallet } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/cart";
import { currency, getRestaurant } from "@/lib/data";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — QuickBite" },
      { name: "description", content: "Confirm your delivery address and place your QuickBite order." },
      { property: "og:title", content: "Checkout — QuickBite" },
      { property: "og:description", content: "Confirm your address and place your QuickBite order." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, subtotal, placeOrder } = useCart();
  const [address, setAddress] = useState("24 Oak Avenue, Apt 3B");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState<"card" | "cash">("card");

  const restaurant = cart.restaurantId ? getRestaurant(cart.restaurantId) : undefined;
  const deliveryFee = restaurant?.deliveryFee ?? 0;
  const serviceFee = cart.lines.length ? 1.5 : 0;
  const total = subtotal + deliveryFee + serviceFee;

  const submit = () => {
    if (!address.trim()) {
      toast.error("Add a delivery address first");
      return;
    }
    const order = placeOrder(address.trim(), total);
    if (!order) {
      toast.error("Your cart is empty");
      return;
    }
    toast.success("Order placed!");
    navigate({ to: "/orders/$id", params: { id: order.id } });
  };

  return (
    <AppShell>
      <header className="flex items-center gap-3 border-b border-border px-5 py-4">
        <Link to="/cart" aria-label="Back to cart" className="text-muted-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold">Checkout</h1>
      </header>

      {cart.lines.length === 0 ? (
        <div className="px-5 py-20 text-center">
          <h2 className="font-semibold">Nothing to check out</h2>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/">Browse restaurants</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6 px-5 py-5">
          <section className="space-y-3">
            <h2 className="text-sm font-semibold">Delivery details</h2>
            <div className="space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes for the driver</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Leave at the door"
              />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold">Payment</h2>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { id: "card", label: "Card ••4291", icon: CreditCard },
                  { id: "cash", label: "Cash on delivery", icon: Wallet },
                ] as const
              ).map((option) => (
                <button
                  key={option.id}
                  onClick={() => setPayment(option.id)}
                  className={`flex flex-col items-start gap-2 rounded-2xl border p-4 text-left text-sm font-medium transition-colors ${
                    payment === option.id
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border bg-card"
                  }`}
                >
                  <option.icon className="h-4 w-4" />
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold">Order summary</h2>
            <dl className="mt-3 space-y-2 rounded-2xl bg-muted p-4 text-sm">
              {cart.lines.map((l) => (
                <div key={l.itemId} className="flex justify-between">
                  <dt className="text-muted-foreground">
                    {l.qty}× {l.name}
                  </dt>
                  <dd>{currency(l.price * l.qty)}</dd>
                </div>
              ))}
              <div className="flex justify-between border-t border-border pt-2">
                <dt className="text-muted-foreground">Delivery + service</dt>
                <dd>{currency(deliveryFee + serviceFee)}</dd>
              </div>
              <div className="flex justify-between font-semibold">
                <dt>Total</dt>
                <dd>{currency(total)}</dd>
              </div>
            </dl>
          </section>

          <Button size="lg" className="w-full rounded-full" onClick={submit}>
            Place order · {currency(total)}
          </Button>
        </div>
      )}
    </AppShell>
  );
}
