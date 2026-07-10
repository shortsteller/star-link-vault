import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getProduct, PRODUCTS, type Product } from "@/lib/products";
import { WhatsAppButton } from "@/components/wa-button";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Not found — Udita's Creation" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    return {
      meta: [
        { title: `${product.name} — Udita's Creation` },
        { name: "description", content: product.short },
        { property: "og:title", content: `${product.name} — Udita's Creation` },
        { property: "og:description", content: product.short },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/product/${product.id}` },
      ],
      links: [{ rel: "canonical", href: `/product/${product.id}` }],
    };
  },
  component: ProductPage,
  notFoundComponent: ProductNotFound,
});

function ProductNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="font-serif text-4xl">Piece not found</h1>
      <p className="mt-3 text-muted-foreground">This item may have sold out or moved.</p>
      <Link to="/gallery" className="mt-6 inline-flex items-center gap-2 gold-underline">Back to gallery <ChevronRight className="h-4 w-4" /></Link>
    </div>
  );
}

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const [active, setActive] = useState(0);
  const [color, setColor] = useState(product.colors[0]);
  const [zoom, setZoom] = useState({ x: 50, y: 50, on: false });

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try { await navigator.share({ title: product.name, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    }
  };

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-16">
      <Link to="/gallery" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground gold-underline">
        <ArrowLeft className="h-4 w-4" /> Back to gallery
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-[1.1fr_1fr] md:gap-16">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div
            className="relative aspect-square overflow-hidden rounded-3xl border border-border/60 bg-beige"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, on: true });
            }}
            onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
          >
            <img
              src={product.gallery[active] || product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500"
              style={zoom.on ? { transform: `scale(1.6)`, transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            />
          </div>
          {product.gallery.length > 1 ? (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.gallery.map((g: string, i: number) => (
                <button key={i} onClick={() => setActive(i)}
                        className={`overflow-hidden rounded-xl border transition ${active === i ? "border-gold" : "border-border/50"}`}>
                  <img src={g} alt="" className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">{product.category}</p>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl">{product.name}</h1>
          <p className="mt-3 font-serif text-2xl text-gold">₹{product.price}</p>
          <p className="mt-6 text-muted-foreground">{product.description}</p>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Color</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.colors.map((c: string) => (
                <button key={c} onClick={() => setColor(c)}
                        className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${color === c ? "border-gold bg-gold/10 text-gold" : "border-border hover:border-gold"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <WhatsAppButton className="min-w-[220px]">
              Order on WhatsApp
            </WhatsAppButton>
            <button onClick={share}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-xs uppercase tracking-[0.25em] transition hover:border-gold hover:text-gold">
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>

          <dl className="mt-10 divide-y divide-border/60 rounded-2xl border border-border/60">
            {[
              ["Material", product.material],
              ["Care", product.care],
              ["Shipping", "Free shipping across India. Ships in 2–3 days."],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[120px_1fr] gap-4 px-5 py-4 text-sm">
                <dt className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{k}</dt>
                <dd className="text-foreground/90">{v}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>

      {related.length > 0 ? (
        <section className="mt-24">
          <h2 className="font-serif text-2xl md:text-3xl">You may also love</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <Link key={p.id} to="/product/$id" params={{ id: p.id }} className="group">
                <div className="overflow-hidden rounded-2xl bg-beige">
                  <img src={p.image} alt={p.name} loading="lazy"
                       className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="font-serif text-base">{p.name}</p>
                  <p className="text-sm text-gold">₹{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}