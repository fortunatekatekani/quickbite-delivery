import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bike } from "lucide-react";
import { toast } from "sonner";
import { ViewToggle } from "@/components/ViewToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { driverAccounts, useDriver } from "@/lib/driver";

export const Route = createFileRoute("/driver-login")({
  head: () => ({
    meta: [
      { title: "Driver login — QuickBite Delivery" },
      {
        name: "description",
        content: "Sign in to the QuickBite driver app to accept deliveries and track weekly earnings.",
      },
      { property: "og:title", content: "Driver login — QuickBite Delivery" },
      {
        property: "og:description",
        content: "Accept delivery requests, update delivery status and see your weekly earnings in Rand.",
      },
    ],
  }),
  component: DriverLogin,
});

function DriverLogin() {
  const navigate = useNavigate();
  const { login } = useDriver();
  const [email, setEmail] = useState("driver@quickbite.com");
  const [password, setPassword] = useState("quickbite");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      toast.success("You're online — ride safe!");
      navigate({ to: "/driver" });
    } else {
      toast.error("Invalid driver email or password");
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col bg-background">
      <div className="border-b border-border bg-card/95 px-5 py-2">
        <ViewToggle active="driver" />
      </div>

      <header className="rounded-b-3xl bg-[image:var(--gradient-primary)] px-5 pb-8 pt-8 text-primary-foreground">
        <Bike className="h-8 w-8" />
        <h1 className="mt-3 text-2xl font-bold">QuickBite Delivery</h1>
        <p className="mt-1 text-sm opacity-90">
          Accept requests, deliver orders and track your weekly earnings.
        </p>
      </header>

      <form onSubmit={submit} className="space-y-4 px-5 py-6">
        <div className="space-y-1.5">
          <Label htmlFor="email">Driver email</Label>
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
          Go online
        </Button>
      </form>

      <section className="px-5 pb-10">
        <h2 className="text-sm font-semibold">Demo account</h2>
        <ul className="mt-3 space-y-2">
          {driverAccounts.map((a) => (
            <li key={a.email}>
              <button
                onClick={() => {
                  setEmail(a.email);
                  setPassword(a.password);
                }}
                className="w-full rounded-2xl border border-border bg-card p-3 text-left [box-shadow:var(--shadow-card)]"
              >
                <p className="text-sm font-semibold">{a.name}</p>
                <p className="text-xs text-muted-foreground">
                  {a.email} · password: {a.password}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
