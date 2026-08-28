import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { MenuItem } from "./data";

export type CartLine = {
  itemId: string;
  name: string;
  price: number;
  qty: number;
};

export type OrderStatus = "preparing" | "on-the-way" | "delivered";

export type Order = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  lines: CartLine[];
  total: number;
  address: string;
  placedAt: number;
  status: OrderStatus;
};

type CartState = {
  restaurantId: string | null;
  restaurantName: string | null;
  lines: CartLine[];
};

const empty: CartState = { restaurantId: null, restaurantName: null, lines: [] };

type Ctx = {
  cart: CartState;
  itemCount: number;
  subtotal: number;
  addItem: (restaurantId: string, restaurantName: string, item: MenuItem) => void;
  setQty: (itemId: string, qty: number) => void;
  clear: () => void;
  orders: Order[];
  placeOrder: (address: string, total: number) => Order | null;
  getOrder: (id: string) => Order | undefined;
};

const CartContext = createContext<Ctx | null>(null);

const CART_KEY = "quickbite.cart";
const ORDERS_KEY = "quickbite.orders";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(empty);
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(read<CartState>(CART_KEY, empty));
    setOrders(read<Order[]>(ORDERS_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders, hydrated]);

  // Prototype: orders progress through statuses automatically.
  useEffect(() => {
    if (!hydrated) return;
    const tick = () => {
      setOrders((prev) => {
        let changed = false;
        const next = prev.map((o) => {
          const age = Date.now() - o.placedAt;
          const status: OrderStatus =
            age > 40_000 ? "delivered" : age > 15_000 ? "on-the-way" : "preparing";
          if (status !== o.status) {
            changed = true;
            return { ...o, status };
          }
          return o;
        });
        return changed ? next : prev;
      });
    };
    tick();
    const id = setInterval(tick, 2000);
    return () => clearInterval(id);
  }, [hydrated]);

  const value = useMemo<Ctx>(() => {
    const subtotal = cart.lines.reduce((s, l) => s + l.price * l.qty, 0);
    return {
      cart,
      subtotal,
      itemCount: cart.lines.reduce((s, l) => s + l.qty, 0),
      addItem: (restaurantId, restaurantName, item) =>
        setCart((prev) => {
          const base =
            prev.restaurantId && prev.restaurantId !== restaurantId
              ? { restaurantId, restaurantName, lines: [] }
              : { ...prev, restaurantId, restaurantName };
          const existing = base.lines.find((l) => l.itemId === item.id);
          const lines = existing
            ? base.lines.map((l) => (l.itemId === item.id ? { ...l, qty: l.qty + 1 } : l))
            : [...base.lines, { itemId: item.id, name: item.name, price: item.price, qty: 1 }];
          return { ...base, lines };
        }),
      setQty: (itemId, qty) =>
        setCart((prev) => {
          const lines = prev.lines
            .map((l) => (l.itemId === itemId ? { ...l, qty } : l))
            .filter((l) => l.qty > 0);
          return lines.length ? { ...prev, lines } : empty;
        }),
      clear: () => setCart(empty),
      orders,
      getOrder: (id) => orders.find((o) => o.id === id),
      placeOrder: (address, total) => {
        if (!cart.restaurantId || cart.lines.length === 0) return null;
        const order: Order = {
          id: `QB${Math.floor(100000 + Math.random() * 899999)}`,
          restaurantId: cart.restaurantId,
          restaurantName: cart.restaurantName ?? "",
          lines: cart.lines,
          total,
          address,
          placedAt: Date.now(),
          status: "preparing",
        };
        setOrders((prev) => [order, ...prev]);
        setCart(empty);
        return order;
      },
    };
  }, [cart, orders]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
