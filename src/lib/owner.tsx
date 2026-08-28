import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { restaurants, type MenuItem } from "./data";
import { useCart, type CartLine } from "./cart";

export type OwnerMenuItem = MenuItem & { image?: string };

export type IncomingOrder = {
  id: string;
  restaurantId: string;
  customerName: string;
  address: string;
  lines: CartLine[];
  total: number;
  placedAt: number;
};

export type Decision = "accepted" | "rejected";

/** Demo restaurant owner accounts (prototype only, no real auth). */
export const ownerAccounts = restaurants.map((r, i) => ({
  email: `owner@${r.id}.com`,
  password: "quickbite",
  restaurantId: r.id,
  restaurantName: r.name,
  order: i,
}));

const demoOrders: IncomingOrder[] = [
  {
    id: "QB100241",
    restaurantId: "green-grill",
    customerName: "Naledi M.",
    address: "12 Rosebank Road, Apt 5",
    lines: [
      { itemId: "gg-0", name: "Classic Cheeseburger", price: 171, qty: 2 },
      { itemId: "gg-4", name: "Loaded Fries", price: 99, qty: 1 },
    ],
    total: 476.82,
    placedAt: Date.now() - 6 * 60_000,
  },
  {
    id: "QB100242",
    restaurantId: "green-grill",
    customerName: "Peter H.",
    address: "8 Maple Street",
    lines: [{ itemId: "gg-1", name: "Double Smash", price: 232.2, qty: 1 }],
    total: 295.02,
    placedAt: Date.now() - 22 * 60_000,
  },
  {
    id: "QB100243",
    restaurantId: "forno-verde",
    customerName: "Lerato S.",
    address: "44 Vine Avenue, Unit 2",
    lines: [
      { itemId: "fv-0", name: "Margherita", price: 198, qty: 1 },
      { itemId: "fv-3", name: "Garlic Focaccia", price: 90, qty: 2 },
    ],
    total: 440.82,
    placedAt: Date.now() - 40 * 60_000,
  },
  {
    id: "QB100244",
    restaurantId: "sakura-house",
    customerName: "Thabo N.",
    address: "3 Harbour Lane",
    lines: [{ itemId: "sh-1", name: "Rainbow Roll", price: 279, qty: 2 }],
    total: 620.82,
    placedAt: Date.now() - 3 * 60_000,
  },
];

type Ctx = {
  session: { restaurantId: string; restaurantName: string; email: string } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  menu: OwnerMenuItem[];
  addMenuItem: (item: Omit<OwnerMenuItem, "id">) => void;
  updateMenuItem: (id: string, patch: Partial<OwnerMenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  orders: IncomingOrder[];
  decisions: Record<string, Decision>;
  decide: (orderId: string, decision: Decision) => void;
  todayOrders: number;
  todaySales: number;
};

const OwnerContext = createContext<Ctx | null>(null);

const SESSION_KEY = "quickbite.owner.session";
const MENUS_KEY = "quickbite.owner.menus";
const DECISIONS_KEY = "quickbite.owner.decisions";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function OwnerProvider({ children }: { children: ReactNode }) {
  const { orders: customerOrders } = useCart();
  const [session, setSession] = useState<Ctx["session"]>(null);
  const [menus, setMenus] = useState<Record<string, OwnerMenuItem[]>>({});
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSession(read<Ctx["session"]>(SESSION_KEY, null));
    setMenus(read<Record<string, OwnerMenuItem[]>>(MENUS_KEY, {}));
    setDecisions(read<Record<string, Decision>>(DECISIONS_KEY, {}));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }, [session, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem(MENUS_KEY, JSON.stringify(menus));
  }, [menus, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem(DECISIONS_KEY, JSON.stringify(decisions));
  }, [decisions, hydrated]);

  const value = useMemo<Ctx>(() => {
    const rid = session?.restaurantId ?? null;
    const base = rid ? (restaurants.find((r) => r.id === rid)?.menu ?? []) : [];
    const menu: OwnerMenuItem[] = rid ? (menus[rid] ?? base) : [];

    const setMenu = (next: OwnerMenuItem[]) => {
      if (!rid) return;
      setMenus((prev) => ({ ...prev, [rid]: next }));
    };

    const orders: IncomingOrder[] = rid
      ? [
          ...customerOrders
            .filter((o) => o.restaurantId === rid)
            .map((o) => ({
              id: o.id,
              restaurantId: o.restaurantId,
              customerName: "Fortunate K.",
              address: o.address,
              lines: o.lines,
              total: o.total,
              placedAt: o.placedAt,
            })),
          ...demoOrders.filter((o) => o.restaurantId === rid),
        ].sort((a, b) => b.placedAt - a.placedAt)
      : [];

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const today = orders.filter(
      (o) => o.placedAt >= startOfDay.getTime() && decisions[o.id] !== "rejected",
    );

    return {
      session,
      login: (email, password) => {
        const acct = ownerAccounts.find(
          (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password,
        );
        if (!acct) return false;
        setSession({
          restaurantId: acct.restaurantId,
          restaurantName: acct.restaurantName,
          email: acct.email,
        });
        return true;
      },
      logout: () => setSession(null),
      menu,
      addMenuItem: (item) =>
        setMenu([...menu, { ...item, id: `own-${Date.now()}` }]),
      updateMenuItem: (id, patch) =>
        setMenu(menu.map((m) => (m.id === id ? { ...m, ...patch } : m))),
      deleteMenuItem: (id) => setMenu(menu.filter((m) => m.id !== id)),
      orders,
      decisions,
      decide: (orderId, decision) =>
        setDecisions((prev) => ({ ...prev, [orderId]: decision })),
      todayOrders: today.length,
      todaySales: today.reduce((s, o) => s + o.total, 0),
    };
  }, [session, menus, decisions, customerOrders]);

  return <OwnerContext.Provider value={value}>{children}</OwnerContext.Provider>;
}

export function useOwner() {
  const ctx = useContext(OwnerContext);
  if (!ctx) throw new Error("useOwner must be used inside OwnerProvider");
  return ctx;
}
