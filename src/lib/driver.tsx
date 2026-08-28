import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type DeliveryStatus = "available" | "accepted" | "picked-up" | "on-the-way" | "delivered";

export type DeliveryJob = {
  id: string;
  restaurantName: string;
  pickupAddress: string;
  dropoffAddress: string;
  customerName: string;
  distanceKm: number;
  payout: number;
  items: number;
  /** Relative map coordinates in percent (0-100) used by the prototype map. */
  pickup: { x: number; y: number };
  dropoff: { x: number; y: number };
};

export const driverAccounts = [
  {
    email: "driver@quickbite.com",
    password: "quickbite",
    name: "Sipho D.",
    vehicle: "Scooter · CA 214-981",
  },
];

export const deliveryJobs: DeliveryJob[] = [
  {
    id: "DL-4821",
    restaurantName: "Green Grill Burgers",
    pickupAddress: "22 Kloof Street, Gardens",
    dropoffAddress: "12 Rosebank Road, Apt 5",
    customerName: "Naledi M.",
    distanceKm: 3.4,
    payout: 48,
    items: 3,
    pickup: { x: 22, y: 68 },
    dropoff: { x: 72, y: 30 },
  },
  {
    id: "DL-4822",
    restaurantName: "Forno Verde",
    pickupAddress: "5 Bree Street, CBD",
    dropoffAddress: "44 Vine Avenue, Unit 2",
    customerName: "Lerato S.",
    distanceKm: 5.1,
    payout: 62,
    items: 3,
    pickup: { x: 34, y: 24 },
    dropoff: { x: 80, y: 72 },
  },
  {
    id: "DL-4823",
    restaurantName: "Sakura House",
    pickupAddress: "18 Harbour Edge, Waterfront",
    dropoffAddress: "3 Harbour Lane",
    customerName: "Thabo N.",
    distanceKm: 2.2,
    payout: 39,
    items: 2,
    pickup: { x: 58, y: 52 },
    dropoff: { x: 26, y: 40 },
  },
  {
    id: "DL-4824",
    restaurantName: "Leaf & Bowl",
    pickupAddress: "77 Long Street",
    dropoffAddress: "9 Orchard Close",
    customerName: "Peter H.",
    distanceKm: 6.8,
    payout: 74,
    items: 4,
    pickup: { x: 44, y: 78 },
    dropoff: { x: 86, y: 20 },
  },
];

/** Completed deliveries this week (prototype earnings history, in Rand). */
export const weekEarnings = [
  { day: "Mon", trips: 8, amount: 412 },
  { day: "Tue", trips: 6, amount: 318 },
  { day: "Wed", trips: 9, amount: 489 },
  { day: "Thu", trips: 7, amount: 366 },
  { day: "Fri", trips: 11, amount: 604 },
  { day: "Sat", trips: 13, amount: 742 },
  { day: "Sun", trips: 4, amount: 208 },
];

export const statusFlow: DeliveryStatus[] = ["accepted", "picked-up", "on-the-way", "delivered"];

export const statusLabel: Record<DeliveryStatus, string> = {
  available: "Available",
  accepted: "Accepted",
  "picked-up": "Picked up",
  "on-the-way": "On the way",
  delivered: "Delivered",
};

type Ctx = {
  session: { email: string; name: string; vehicle: string } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  statuses: Record<string, DeliveryStatus>;
  available: DeliveryJob[];
  active: DeliveryJob[];
  completed: DeliveryJob[];
  statusOf: (id: string) => DeliveryStatus;
  accept: (id: string) => void;
  advance: (id: string) => void;
  setStatus: (id: string, status: DeliveryStatus) => void;
  weekTotal: number;
  weekTrips: number;
  todayEarnings: number;
};

const DriverContext = createContext<Ctx | null>(null);

const SESSION_KEY = "quickbite.driver.session";
const STATUS_KEY = "quickbite.driver.statuses";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function DriverProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Ctx["session"]>(null);
  const [statuses, setStatuses] = useState<Record<string, DeliveryStatus>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSession(read<Ctx["session"]>(SESSION_KEY, null));
    setStatuses(read<Record<string, DeliveryStatus>>(STATUS_KEY, {}));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }, [session, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem(STATUS_KEY, JSON.stringify(statuses));
  }, [statuses, hydrated]);

  const value = useMemo<Ctx>(() => {
    const statusOf = (id: string): DeliveryStatus => statuses[id] ?? "available";
    const completed = deliveryJobs.filter((j) => statusOf(j.id) === "delivered");
    const todayEarnings = completed.reduce((s, j) => s + j.payout, 0);
    const weekTotal = weekEarnings.reduce((s, d) => s + d.amount, 0) + todayEarnings;
    const weekTrips = weekEarnings.reduce((s, d) => s + d.trips, 0) + completed.length;

    return {
      session,
      login: (email, password) => {
        const acct = driverAccounts.find(
          (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password,
        );
        if (!acct) return false;
        setSession({ email: acct.email, name: acct.name, vehicle: acct.vehicle });
        return true;
      },
      logout: () => setSession(null),
      statuses,
      statusOf,
      available: deliveryJobs.filter((j) => statusOf(j.id) === "available"),
      active: deliveryJobs.filter((j) => {
        const s = statusOf(j.id);
        return s !== "available" && s !== "delivered";
      }),
      completed,
      accept: (id) => setStatuses((prev) => ({ ...prev, [id]: "accepted" })),
      advance: (id) =>
        setStatuses((prev) => {
          const current = prev[id] ?? "available";
          const idx = statusFlow.indexOf(current);
          const next = statusFlow[Math.min(idx + 1, statusFlow.length - 1)]!;
          return { ...prev, [id]: current === "available" ? "accepted" : next };
        }),
      setStatus: (id, status) => setStatuses((prev) => ({ ...prev, [id]: status })),
      weekTotal,
      weekTrips,
      todayEarnings,
    };
  }, [session, statuses]);

  return <DriverContext.Provider value={value}>{children}</DriverContext.Provider>;
}

export function useDriver() {
  const ctx = useContext(DriverContext);
  if (!ctx) throw new Error("useDriver must be used inside DriverProvider");
  return ctx;
}
