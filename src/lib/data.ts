import burger from "@/assets/r-burger.jpg";
import pizza from "@/assets/r-pizza.jpg";
import sushi from "@/assets/r-sushi.jpg";
import salad from "@/assets/r-salad.jpg";
import tacos from "@/assets/r-tacos.jpg";
import ramen from "@/assets/r-ramen.jpg";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  section: string;
};

export type Restaurant = {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  deliveryMinutes: string;
  deliveryFee: number;
  priceLevel: string;
  tags: string[];
  menu: MenuItem[];
};

export const categories = [
  { id: "all", label: "All", emoji: "🍽️" },
  { id: "burgers", label: "Burgers", emoji: "🍔" },
  { id: "pizza", label: "Pizza", emoji: "🍕" },
  { id: "sushi", label: "Sushi", emoji: "🍣" },
  { id: "healthy", label: "Healthy", emoji: "🥗" },
  { id: "mexican", label: "Mexican", emoji: "🌮" },
  { id: "asian", label: "Asian", emoji: "🍜" },
];

const menu = (
  items: [string, string, number, string][],
  prefix: string,
): MenuItem[] =>
  items.map(([name, description, price, section], i) => ({
    id: `${prefix}-${i}`,
    name,
    description,
    price,
    section,
  }));

export const restaurants: Restaurant[] = [
  {
    id: "green-grill",
    name: "Green Grill Burgers",
    category: "burgers",
    image: burger,
    rating: 4.8,
    reviews: 1240,
    deliveryMinutes: "20-30",
    deliveryFee: 1.99,
    priceLevel: "$$",
    tags: ["Burgers", "Fries", "Fast food"],
    menu: menu(
      [
        ["Classic Cheeseburger", "Beef patty, cheddar, lettuce, house sauce", 9.5, "Popular"],
        ["Double Smash", "Two patties, pickles, smoked cheese", 12.9, "Popular"],
        ["Crispy Chicken Burger", "Buttermilk chicken, slaw, chipotle mayo", 10.4, "Burgers"],
        ["Garden Veggie Burger", "Bean patty, avocado, tomato", 9.9, "Burgers"],
        ["Loaded Fries", "Cheese sauce, spring onion, crispy onions", 5.5, "Sides"],
        ["Lemon Iced Tea", "Freshly brewed, lightly sweet", 2.8, "Drinks"],
      ],
      "gg",
    ),
  },
  {
    id: "forno-verde",
    name: "Forno Verde Pizzeria",
    category: "pizza",
    image: pizza,
    rating: 4.7,
    reviews: 980,
    deliveryMinutes: "25-35",
    deliveryFee: 2.49,
    priceLevel: "$$",
    tags: ["Pizza", "Italian"],
    menu: menu(
      [
        ["Margherita", "San Marzano tomato, fior di latte, basil", 11.0, "Popular"],
        ["Diavola", "Spicy salami, chilli honey, mozzarella", 13.5, "Popular"],
        ["Quattro Formaggi", "Four cheese blend, black pepper", 14.0, "Pizza"],
        ["Garlic Focaccia", "Rosemary, sea salt, olive oil", 5.0, "Sides"],
        ["Tiramisu", "Classic mascarpone and espresso", 6.5, "Desserts"],
      ],
      "fv",
    ),
  },
  {
    id: "sakura-house",
    name: "Sakura House Sushi",
    category: "sushi",
    image: sushi,
    rating: 4.9,
    reviews: 2110,
    deliveryMinutes: "30-40",
    deliveryFee: 3.49,
    priceLevel: "$$$",
    tags: ["Sushi", "Japanese"],
    menu: menu(
      [
        ["Salmon Nigiri (4pc)", "Fresh salmon over seasoned rice", 8.9, "Popular"],
        ["Rainbow Roll", "Crab, avocado, assorted sashimi", 15.5, "Popular"],
        ["Spicy Tuna Roll", "Tuna, sriracha mayo, cucumber", 12.0, "Rolls"],
        ["Edamame", "Steamed, sea salt", 4.5, "Sides"],
        ["Green Tea", "Hot sencha", 2.5, "Drinks"],
      ],
      "sh",
    ),
  },
  {
    id: "leaf-bowl",
    name: "Leaf & Bowl",
    category: "healthy",
    image: salad,
    rating: 4.6,
    reviews: 640,
    deliveryMinutes: "15-25",
    deliveryFee: 0,
    priceLevel: "$$",
    tags: ["Salads", "Bowls", "Vegan"],
    menu: menu(
      [
        ["Avocado Quinoa Bowl", "Quinoa, avocado, greens, lemon dressing", 11.5, "Popular"],
        ["Chicken Caesar Salad", "Grilled chicken, parmesan, croutons", 12.5, "Popular"],
        ["Falafel Wrap", "Hummus, pickled veg, tahini", 9.5, "Wraps"],
        ["Green Smoothie", "Spinach, apple, banana, ginger", 5.9, "Drinks"],
      ],
      "lb",
    ),
  },
  {
    id: "casa-taco",
    name: "Casa Taco",
    category: "mexican",
    image: tacos,
    rating: 4.5,
    reviews: 870,
    deliveryMinutes: "20-30",
    deliveryFee: 1.49,
    priceLevel: "$",
    tags: ["Tacos", "Mexican"],
    menu: menu(
      [
        ["Street Tacos (3pc)", "Corn tortillas, salsa verde, onion, coriander", 9.9, "Popular"],
        ["Chicken Burrito", "Rice, beans, cheese, chipotle crema", 11.9, "Popular"],
        ["Loaded Nachos", "Queso, jalapeños, pico de gallo", 8.5, "Sides"],
        ["Horchata", "Cinnamon rice drink", 3.5, "Drinks"],
      ],
      "ct",
    ),
  },
  {
    id: "noodle-lane",
    name: "Noodle Lane Ramen",
    category: "asian",
    image: ramen,
    rating: 4.7,
    reviews: 1520,
    deliveryMinutes: "25-35",
    deliveryFee: 2.29,
    priceLevel: "$$",
    tags: ["Ramen", "Noodles", "Asian"],
    menu: menu(
      [
        ["Shoyu Ramen", "Soy broth, egg, greens, chashu", 13.5, "Popular"],
        ["Spicy Miso Ramen", "Miso chilli broth, corn, scallion", 14.2, "Popular"],
        ["Veggie Ramen", "Mushroom broth, tofu, bok choy", 12.5, "Ramen"],
        ["Pork Gyoza (5pc)", "Pan fried, ponzu dip", 6.9, "Sides"],
      ],
      "nl",
    ),
  },
];

export const getRestaurant = (id: string) => restaurants.find((r) => r.id === id);

export const currency = (n: number) => `R ${n.toFixed(2)}`;
