import { Link } from "@tanstack/react-router";

export function ViewToggle({ active }: { active: "customer" | "restaurant" }) {
  const base =
    "flex-1 rounded-full px-3 py-1.5 text-center text-[12px] font-semibold transition-colors";
  return (
    <div className="flex gap-1 rounded-full border border-border bg-muted/60 p-1">
      <Link
        to="/"
        className={`${base} ${
          active === "customer"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Customer
      </Link>
      <Link
        to="/owner"
        className={`${base} ${
          active === "restaurant"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Restaurant
      </Link>
    </div>
  );
}
