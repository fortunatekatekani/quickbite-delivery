import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Bike, Clock, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { currency, getRestaurant } from "@/lib/data";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/restaurant/$id")({
  loader: ({ params }) => {
    const restaurant = getRestaurant(params.id);
    if (!restaurant) throw notFound();
    return { restaurant };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Restaurant not found — QuickBite" }, { name: "robots", content: "noindex" }],
      };
    }
    const { restaurant } = loaderData;
    const title = `${restaurant.name} — Menu & delivery | QuickBite`;
    const description = `Order from ${restaurant.name}. ${restaurant.tags.join(", ")} delivered in ${restaurant.deliveryMinutes} minutes.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: RestaurantPage,
});

function RestaurantPage() {
  const { restaurant } = Route.useLoaderData();
  const { addItem, itemCount, subtotal } = useCart();

  const sections = [...new Set(restaurant.menu.map((m) => m.section))];

  return (
    <AppShell>
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          width={800}
          height={600}
          className="h-52 w-full object-cover"
        />
        <Link
          to="/"
          aria-label="Back to restaurants"
          className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-card/90 text-foreground backdrop-blur"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      <div className="px-5 pt-5">
        <h1 className="text-xl font-bold tracking-tight">{restaurant.name}</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {restaurant.tags.join(" · ")} · {restaurant.priceLevel}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {restaurant.rating}
            <span className="font-normal text-muted-foreground">({restaurant.reviews})</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {restaurant.deliveryMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <Bike className="h-3.5 w-3.5" />
            {restaurant.deliveryFee === 0
              ? "Free delivery"
              : `${currency(restaurant.deliveryFee)} delivery`}
          </span>
        </div>
      </div>

      <div className="space-y-7 px-5 py-6">
        {sections.map((section) => (
          <section key={section}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {section}
            </h2>
            <div className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {restaurant.menu
                .filter((m) => m.section === section)
                .map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold">{item.name}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
                      <p className="mt-2 text-sm font-semibold text-primary">
                        {currency(item.price)}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      aria-label={`Add ${item.name} to cart`}
                      onClick={() => {
                        addItem(restaurant.id, restaurant.name, item);
                        toast.success(`${item.name} added to cart`);
                      }}
                      className="h-9 w-9 rounded-full"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>

      {itemCount > 0 && (
        <div className="fixed inset-x-0 bottom-20 z-30 mx-auto max-w-lg px-5">
          <Button asChild size="lg" className="w-full justify-between rounded-full">
            <Link to="/cart">
              <span>
                View cart · {itemCount} item{itemCount === 1 ? "" : "s"}
              </span>
              <span>{currency(subtotal)}</span>
            </Link>
          </Button>
        </div>
      )}
    </AppShell>
  );
}
