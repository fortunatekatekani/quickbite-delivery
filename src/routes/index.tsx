import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin, Search, Star, Clock, Bike } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { categories, currency, restaurants } from "@/lib/data";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QuickBite — Order food from local restaurants" },
      {
        name: "description",
        content:
          "Browse restaurants by category, order in a few taps and follow your delivery from kitchen to door.",
      },
      { property: "og:title", content: "QuickBite — Order food from local restaurants" },
      {
        property: "og:description",
        content: "Browse restaurants by category, order in a few taps and track your delivery.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("all");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return restaurants.filter((r) => {
      const inCategory = active === "all" || r.category === active;
      const matches =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)) ||
        r.menu.some((m) => m.name.toLowerCase().includes(q));
      return inCategory && matches;
    });
  }, [query, active]);

  return (
    <AppShell>
      <header className="rounded-b-3xl bg-[image:var(--gradient-primary)] px-5 pb-8 pt-6 text-primary-foreground">
        <p className="flex items-center gap-1.5 text-xs opacity-90">
          <MapPin className="h-3.5 w-3.5" /> Deliver to · 24 Oak Avenue
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          Hungry? QuickBite has you covered.
        </h1>
        <div className="relative mt-5">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search restaurants or dishes"
            aria-label="Search restaurants or dishes"
            className="h-12 rounded-full border-0 bg-card pl-10 text-foreground shadow-none"
          />
        </div>
      </header>

      <section className="px-5 pt-6">
        <h2 className="text-sm font-semibold">Categories</h2>
        <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
          {categories.map((c) => {
            const isActive = active === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-accent"
                }`}
              >
                <span aria-hidden>{c.emoji}</span>
                {c.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="px-5 py-6">
        <h2 className="text-sm font-semibold">
          {list.length} restaurant{list.length === 1 ? "" : "s"} near you
        </h2>
        <div className="mt-3 space-y-4">
          {list.map((r) => (
            <Link
              key={r.id}
              to="/restaurant/$id"
              params={{ id: r.id }}
              className="block overflow-hidden rounded-2xl border border-border bg-card [box-shadow:var(--shadow-card)] transition-transform active:scale-[0.99]"
            >
              <img
                src={r.image}
                alt={r.name}
                width={800}
                height={600}
                loading="lazy"
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold">{r.name}</h3>
                  <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                    <Star className="h-3 w-3 fill-current" /> {r.rating}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {r.tags.join(" · ")} · {r.priceLevel}
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {r.deliveryMinutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Bike className="h-3.5 w-3.5" />
                    {r.deliveryFee === 0 ? "Free delivery" : `${currency(r.deliveryFee)} delivery`}
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {list.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No restaurants match that search yet.
            </p>
          )}
        </div>
      </section>
    </AppShell>
  );
}
