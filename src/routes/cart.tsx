import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle } from "lucide-react";
import { useCart, updateQuantity, removeFromCart, cartTotals } from "@/lib/cart-store";
import { waLink } from "@/lib/site";

export const Route = createFileRoute("/cart")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Your Cart — Udita's Creation" },
      { name: "description", content: "Review the pieces in your cart and send your enquiry on WhatsApp." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function buildProductLink(id: string) {
  if (typeof window === "undefined") return `/product/${id}`;
  return `${window.location.origin}/product/${id}`;
}

function CartPage() {
  const items = useCart();
  const { totalItems, totalQuantity, grandTotal } = cartTotals(items);

  const buildMessage = () => {
    const lines: string[] = [];
    lines.push("Hello! I would like to enquire about the following products.\n");
    items.forEach((it, idx) => {
      lines.push(`${idx + 1}.`);
      lines.push(`Product Name: ${it.name}`);
      lines.push(`Category: ${it.category}`);
      lines.push(`Price: ₹${it.price}`);
      lines.push(`Quantity: ${it.quantity}`);
      lines.push(`Product Link: ${buildProductLink(it.id)}`);
      lines.push("");
    });
    lines.push("--------------------------------");
    lines.push(`Total Items: ${totalQuantity}`);
    lines.push(`Grand Total: ₹${grandTotal}`);
    lines.push("");
    lines.push("I am interested in purchasing these products. Please provide further details.");
    return lines.join("\n");
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-gold" />
        <h1 className="mt-6 font-serif text-4xl">Your cart is empty</h1>
        <p className="mt-3 text-muted-foreground">Add pieces from the gallery to send an enquiry on WhatsApp.</p>
        <Link to="/gallery" className="mt-8 inline-flex rounded-full border border-gold px-6 py-3 text-xs uppercase tracking-[0.25em] text-gold transition hover:bg-gold/10">
          Browse gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <div className="flex flex-col items-start gap-3">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Cart</p>
        <h1 className="font-serif text-4xl md:text-5xl">Your selected pieces</h1>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="flex flex-col gap-4">
          {items.map((it) => {
            const subtotal = it.price * it.quantity;
            return (
              <li key={it.id} className="flex gap-4 rounded-2xl border border-border/60 bg-card p-4">
                <Link to="/product/$id" params={{ id: it.id }} className="block h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-beige md:h-28 md:w-28">
                  <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{it.category}</p>
                      <Link to="/product/$id" params={{ id: it.id }} className="font-serif text-lg gold-underline">{it.name}</Link>
                    </div>
                    <button
                      onClick={() => removeFromCart(it.id)}
                      aria-label="Remove"
                      className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-red-500/60 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center rounded-full border border-border">
                      <button
                        onClick={() => updateQuantity(it.id, it.quantity - 1)}
                        aria-label="Decrease"
                        className="grid h-9 w-9 place-items-center text-foreground/80 transition hover:text-gold"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm">{it.quantity}</span>
                      <button
                        onClick={() => updateQuantity(it.id, it.quantity + 1)}
                        aria-label="Increase"
                        className="grid h-9 w-9 place-items-center text-foreground/80 transition hover:text-gold"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Subtotal</p>
                      <p className="font-serif text-lg text-gold">₹{subtotal}</p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit rounded-2xl border border-border/60 bg-card p-6">
          <h2 className="font-serif text-2xl">Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Total products</dt>
              <dd>{totalItems}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Total quantity</dt>
              <dd>{totalQuantity}</dd>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
              <dt className="text-xs uppercase tracking-[0.25em]">Grand total</dt>
              <dd className="font-serif text-2xl text-gold">₹{grandTotal}</dd>
            </div>
          </dl>
          <a
            href={waLink(buildMessage())}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs uppercase tracking-[0.25em] text-primary-foreground transition hover:bg-primary/90"
          >
            <MessageCircle className="h-4 w-4" />
            Send Cart on WhatsApp
          </a>
          <Link
            to="/gallery"
            className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-border px-6 py-3 text-xs uppercase tracking-[0.25em] text-foreground/80 transition hover:border-gold hover:text-gold"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
