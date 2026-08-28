import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { OwnerShell } from "@/components/OwnerShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { currency } from "@/lib/data";
import { useOwner } from "@/lib/owner";

export const Route = createFileRoute("/owner/menu")({
  head: () => ({
    meta: [
      { title: "Manage menu — QuickBite Partners" },
      {
        name: "description",
        content: "Add dishes, update prices, upload photos and remove items from your QuickBite menu.",
      },
      { property: "og:title", content: "Manage menu — QuickBite Partners" },
      {
        property: "og:description",
        content: "Add dishes, edit prices and photos, and delete items from your menu.",
      },
    ],
  }),
  component: OwnerMenu,
});

function readImage(file: File, onDone: (dataUrl: string) => void) {
  const reader = new FileReader();
  reader.onload = () => onDone(String(reader.result));
  reader.readAsDataURL(file);
}

function OwnerMenu() {
  const { menu, addMenuItem, updateMenuItem, deleteMenuItem } = useOwner();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [section, setSection] = useState("Popular");
  const [image, setImage] = useState<string | undefined>();
  const newFileRef = useRef<HTMLInputElement>(null);

  const add = () => {
    const value = Number(price);
    if (!name.trim() || !Number.isFinite(value) || value <= 0) {
      toast.error("Add a name and a valid price");
      return;
    }
    addMenuItem({ name: name.trim(), description: description.trim(), price: value, section, image });
    setName("");
    setPrice("");
    setDescription("");
    setImage(undefined);
    if (newFileRef.current) newFileRef.current.value = "";
    toast.success("Menu item added");
  };

  return (
    <OwnerShell>
      <header className="border-b border-border px-5 py-4">
        <h1 className="text-lg font-bold">Manage menu</h1>
        <p className="text-xs text-muted-foreground">{menu.length} items on your menu</p>
      </header>

      <section className="border-b border-border px-5 py-5">
        <h2 className="text-sm font-semibold">Add new food</h2>
        <div className="mt-3 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Truffle Fries" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="6.50"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="section">Section</Label>
              <Input id="section" value={section} onChange={(e) => setSection(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Crispy fries, truffle oil, parmesan"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-semibold">
              <ImagePlus className="h-4 w-4 text-primary" />
              Upload image
              <input
                ref={newFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) readImage(file, setImage);
                }}
              />
            </label>
            {image ? (
              <img src={image} alt="New item preview" className="h-12 w-12 rounded-xl object-cover" />
            ) : null}
          </div>
          <Button onClick={add} className="w-full rounded-full">
            <Plus className="mr-1 h-4 w-4" /> Add to menu
          </Button>
        </div>
      </section>

      <section className="px-5 py-5">
        <h2 className="text-sm font-semibold">Your items</h2>
        <ul className="mt-3 space-y-3">
          {menu.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-border bg-card p-4 [box-shadow:var(--shadow-card)]"
            >
              <div className="flex items-start gap-3">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-14 w-14 rounded-xl object-cover" />
                ) : (
                  <span className="grid h-14 w-14 place-items-center rounded-xl bg-muted text-muted-foreground">
                    <ImagePlus className="h-5 w-5" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{item.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{item.description}</p>
                  <p className="mt-1 text-xs font-medium text-primary">{item.section}</p>
                </div>
                <button
                  onClick={() => {
                    deleteMenuItem(item.id);
                    toast(`${item.name} removed`);
                  }}
                  aria-label={`Delete ${item.name}`}
                  className="text-muted-foreground"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Label htmlFor={`price-${item.id}`} className="text-xs text-muted-foreground">
                  Price
                </Label>
                <Input
                  id={`price-${item.id}`}
                  type="number"
                  step="0.1"
                  value={item.price}
                  onChange={(e) => updateMenuItem(item.id, { price: Number(e.target.value) })}
                  className="h-9 w-24"
                />
                <span className="text-xs text-muted-foreground">{currency(item.price)}</span>
                <label className="ml-auto flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary">
                  <ImagePlus className="h-4 w-4" />
                  Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) readImage(file, (url) => updateMenuItem(item.id, { image: url }));
                    }}
                  />
                </label>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </OwnerShell>
  );
}
