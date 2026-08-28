import { Link } from "@tanstack/react-router";
import { Home, ShoppingBag, Receipt, User } from "lucide-react";
import type { ReactNode } from "react";
import { useCart } from "@/lib/cart";

export function AppShell({ children }: { children: ReactNode }) {
  const { itemCount } = useCart();

  const tabs = [
    { to: "/", label: "Home", icon: Home },
    { to: "/cart", label: "Cart", icon: ShoppingBag, badge: itemCount },
    { to: "/orders", label: "Orders", icon: Receipt },
    { to: "/account", label: "Account", icon: User },
  ] as const;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col bg-background pb-20">
      <div className="sticky top-0 z-30 border-b border-border bg-card/95 px-5 py-2 backdrop-blur">
        <ViewToggle active="customer" />
      </div>
      <main className="flex-1">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-lg border-t border-border bg-card/95 backdrop-blur [box-shadow:var(--shadow-float)]">
        <ul className="grid grid-cols-4">
          {tabs.map((t) => (
            <li key={t.to}>
              <Link
                to={t.to}
                activeOptions={{ exact: t.to === "/" }}
                activeProps={{ className: "text-primary" }}
                inactiveProps={{ className: "text-muted-foreground" }}
                className="relative flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors"
              >
                <t.icon className="h-5 w-5" />
                {t.label}
                {"badge" in t && t.badge ? (
                  <span className="absolute right-1/2 top-1.5 -mr-4 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {t.badge}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
