import { Link } from "@tanstack/react-router";
import { LayoutDashboard, ClipboardList, UtensilsCrossed, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { ViewToggle } from "@/components/ViewToggle";
import { Button } from "@/components/ui/button";
import { useOwner } from "@/lib/owner";

const tabs = [
  { to: "/owner", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/owner/orders", label: "Orders", icon: ClipboardList, exact: false },
  { to: "/owner/menu", label: "Menu", icon: UtensilsCrossed, exact: false },
] as const;

export function OwnerShell({ children }: { children: ReactNode }) {
  const { session, logout } = useOwner();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col bg-background pb-20">
      <div className="sticky top-0 z-30 border-b border-border bg-card/95 px-5 py-2 backdrop-blur">
        <ViewToggle active="restaurant" />
      </div>

      {session ? (
        <>
          <header className="flex items-center gap-3 border-b border-border px-5 py-3">
            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Restaurant partner
              </p>
              <h2 className="text-sm font-bold">{session.restaurantName}</h2>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1 text-xs font-semibold text-muted-foreground"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </header>
          <main className="flex-1">{children}</main>
          <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-lg border-t border-border bg-card/95 backdrop-blur [box-shadow:var(--shadow-float)]">
            <ul className="grid grid-cols-3">
              {tabs.map((t) => (
                <li key={t.to}>
                  <Link
                    to={t.to}
                    activeOptions={{ exact: t.exact }}
                    activeProps={{ className: "text-primary" }}
                    inactiveProps={{ className: "text-muted-foreground" }}
                    className="flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors"
                  >
                    <t.icon className="h-5 w-5" />
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </>
      ) : (
        <div className="px-5 py-20 text-center">
          <h1 className="text-lg font-bold">Restaurant login required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with your partner account to manage orders and your menu.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/restaurant-login">Go to restaurant login</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
