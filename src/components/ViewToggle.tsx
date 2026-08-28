import { Link } from "@tanstack/react-router";

export function ViewToggle({ active }: { active: "customer" | "restaurant" | "driver" }) {
  const base =
    "flex-1 rounded-full px-3 py-1.5 text-center text-[12px] font-semibold transition-colors";
  const cls = (key: typeof active) =>
    `${base} ${
      active === key
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div className="flex gap-1 rounded-full border border-border bg-muted/60 p-1">
      <Link to="/" className={cls("customer")}>
        Customer
      </Link>
      <Link to="/owner" className={cls("restaurant")}>
        Restaurant
      </Link>
      <Link to="/driver" className={cls("driver")}>
        Driver
      </Link>
    </div>
  );
}
