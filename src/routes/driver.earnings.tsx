import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Wallet } from "lucide-react";
import { DriverShell } from "@/components/DriverShell";
import { currency } from "@/lib/data";
import { useDriver, weekEarnings } from "@/lib/driver";

export const Route = createFileRoute("/driver/earnings")({
  head: () => ({
    meta: [
      { title: "Weekly earnings — QuickBite Driver" },
      {
        name: "description",
        content: "See your QuickBite delivery earnings summary for the week in Rand, day by day.",
      },
      { property: "og:title", content: "Weekly earnings — QuickBite Driver" },
      {
        property: "og:description",
        content: "Daily payouts, trip counts and weekly totals for QuickBite delivery partners.",
      },
    ],
  }),
  component: DriverEarnings;
});

function DriverEarnings() {
  const { weekTotal, weekTrips, todayEarnings, completed } = useDriver();
  const max = Math.max(...weekEarnings.map((d) => d.amount), 1);
  const avg = weekTrips > 0 ? weekTotal / weekTrips : 0;

  return (
    <DriverShell>
      <section className="px-5 py-5">
        <h1 className="text-lg font-bold">Earnings this week</h1>
        <div className="mt-4 rounded-3xl bg-[image:var(--gradient-primary)] p-5 text-primary-foreground">
          <Wallet className="h-6 w-6" />
          <p className="mt-3 text-3xl font-bold">{currency(weekTotal)}</p>
          <p className="text-xs opacity-90">
            {weekTrips} trips · avg {currency(avg)} per trip
          </p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-card p-4 [box-shadow:var(--shadow-card)]">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Today</p>
            <p className="mt-1 text-lg font-bold">{currency(todayEarnings)}</p>
            <p className="text-xs text-muted-foreground">{completed.length} deliveries</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 [box-shadow:var(--shadow-card)]">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Best day</p>
            <p className="mt-1 text-lg font-bold">
              {currency(Math.max(...weekEarnings.map((d) => d.amount)))}
            </p>
            <p className="text-xs text-muted-foreground">
              {weekEarnings.reduce((a, b) => (b.amount > a.amount ? b : a)).day}
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 pb-10">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold">
          <TrendingUp className="h-4 w-4 text-primary" /> Daily breakdown
        </h2>
        <ul className="mt-4 space-y-3">
          {weekEarnings.map((d) => (
            <li key={d.day} className="flex items-center gap-3">
              <span className="w-9 text-xs font-semibold text-muted-foreground">{d.day}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(d.amount / max) * 100}%` }}
                />
              </div>
              <span className="w-24 text-right text-xs font-semibold">
                {currency(d.amount)}
                <span className="ml-1 font-normal text-muted-foreground">· {d.trips}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </DriverShell>
  );
}
