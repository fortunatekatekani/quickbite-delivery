import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Store } from "lucide-react";
import { toast } from "sonner";
import { ViewToggle } from "@/components/ViewToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ownerAccounts, useOwner } from "@/lib/owner";

export const Route = createFileRoute("/restaurant-login")({
  head: () => ({
    meta: [
      { title: "Restaurant login — QuickBite Partners" },
      {
        name: "description",
        content: "Sign in to the QuickBite partner dashboard to manage incoming orders and your menu.",
      },
      { property: "og:title", content: "Restaurant login — QuickBite Partners" },
      {
        property: "og:description",
        content: "Manage incoming orders, your menu and daily sales in the QuickBite partner dashboard.",
      },
    ],
  }),
  component: RestaurantLogin,
});

function RestaurantLogin() {
  const navigate = useNavigate();
  const { login } = useOwner();
  const [email, setEmail] = useState("owner@green-grill.com");
  const [password, setPassword] = useState("quickbite");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      toast.success("Welcome back!");
      navigate({ to: "/owner" });
    } else {
      toast.error("Invalid partner email or password");
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col bg-background">
      <div className="border-b border-border bg-card/95 px-5 py-2">
        <ViewToggle active="restaurant" />
      </div>

      <header className="rounded-b-3xl bg-[image:var(--gradient-primary)] px-5 pb-8 pt-8 text-primary-foreground">
        <Store className="h-8 w-8" />
        <h1 className="mt-3 text-2xl font-bold">QuickBite Partners</h1>
        <p className="mt-1 text-sm opacity-90">Manage orders, menu and sales for your restaurant.</p>
      </header>

      <form onSubmit={submit} className="space-y-4 px-5 py-6">
        <div className="space-y-1.5">
          <Label htmlFor="email">Partner email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full rounded-full">
          Sign in
        </Button>
      </form>

      <section className="px-5 pb-10">
        <h2 className="text-sm font-semibold">Demo accounts</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Password for all demo partners: <span className="font-semibold">quickbite</span>
        </p>
        <ul className="mt-3 space-y-2">
          {ownerAccounts.map((a) => (
            <li key={a.email}>
              <button
                onClick={() => {
                  setEmail(a.email);
                  setPassword("quickbite");
                }}
                className="w-full rounded-2xl border border-border bg-card p-3 text-left [box-shadow:var(--shadow-card)]"
              >
                <p className="text-sm font-semibold">{a.restaurantName}</p>
                <p className="text-xs text-muted-foreground">{a.email}</p>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
