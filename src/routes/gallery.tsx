import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { CATEGORIES } from "@/lib/products";
import { subscribeProducts, type FirestoreProduct } from "@/lib/product-store";
import { WhatsAppButton } from "@/components/wa-button";

export const Route = createFileRoute("/gallery")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Gallery — Udita's Creation Jewelry" },
      { name: "description", content: "Explore handcrafted jhumkas, earrings, necklaces, bangles, bracelets, rings, anklets and jewelry sets from our Kolkata studio." },
      { property: "og:title", content: "Gallery — Udita's Creation Jewelry" },
      { property: "og:description", content: "Stylish, affordable and elegant handcrafted jewelry from Kolkata." },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

type Sort = "featured" | "price-asc" | "price-desc" | "newest";

function GalleryPage() {
  const [products, setProducts] = useState<FirestoreProduct[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [cat, setCat] = useState<string>("all");
  const [max, setMax] = useState<number>(5000);
  const [sort, setSort] = useState<Sort>("featured");

  useEffect(() => {
    const unsub = subscribeProducts((list) => {
      setProducts(list);
      setLoaded(true);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    let list = products.map((p, idx) => ({ ...p, _idx: idx }));
    if (cat !== "all") list = list.filter((p) => p.category === cat);
    list = list.filter((p) => p.price <= max);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "newest") {
      list.sort(
        (a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0),
      );
    }
    return list;
  }, [products, cat, max, sort]);

  const tabs = [{ slug: "all", name: "All" }, ...CATEGORIES.filter((c) => c.slug !== "new-arrivals")];

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-20">
      <div className="flex flex-col items-start gap-4">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">The Gallery</p>
        <h1 className="font-serif text-4xl md:text-6xl">Our jewelry collection</h1>
        <p className="max-w-xl text-muted-foreground">
          Handcrafted in our Kolkata studio. Tap any category below to explore, then order directly on WhatsApp.
        </p>
      </div>

      <div className="mt-10 -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
        {tabs.map((t) => {
          const active = cat === t.slug;
          return (
            <button
              key={t.slug}
              onClick={() => setCat(t.slug)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${active ? "border-gold bg-gold/10 text-gold" : "border-border text-foreground/70 hover:border-gold"}`}
            >
              {t.name}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 rounded-2xl border border-border/60 bg-card p-5 md:grid-cols-[1fr_auto] md:items-center md:p-6">
        <div>
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span>Max price</span>
            <span className="text-foreground">₹{max}</span>
          </div>
          <input
            type="range"
            min={0}
            max={5000}
            step={100}
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            className="mt-3 w-full accent-[color:var(--gold)]"
          />
          <div className="mt-1 flex justify-between text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <span>₹0</span><span>₹5000</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:items-end">
          <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Sort</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-gold"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      <p className="mt-8 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {loaded ? `${filtered.length} pieces` : "Loading…"}
      </p>

      {!loaded ? (
        <div className="mt-16 grid place-items-center">
          <Loader2 className="h-6 w-6 animate-spin text-gold" />
        </div>
      ) : (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 8) * 0.04 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card"
            >
              <Link to="/product/$id" params={{ id: p.id }} className="block overflow-hidden bg-beige">
                <img src={p.imageUrls[0]} alt={p.name} loading="lazy"
                     className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </Link>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{p.category}</p>
                    <Link to="/product/$id" params={{ id: p.id }} className="mt-1 block font-serif text-lg gold-underline">{p.name}</Link>
                  </div>
                  <p className="font-serif text-base text-gold">₹{p.price}</p>
                </div>
                {p.stockStatus !== "in-stock" ? (
                  <span className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] ${p.stockStatus === "out-of-stock" ? "border-red-500/40 text-red-600 dark:text-red-400" : "border-amber-500/40 text-amber-600 dark:text-amber-400"}`}>
                    {p.stockStatus.replace("-", " ")}
                  </span>
                ) : null}
                <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                <WhatsAppButton variant="outline" className="mt-auto w-full">
                  Order on WhatsApp
                </WhatsAppButton>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {loaded && filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          {products.length === 0
            ? "New pieces coming soon."
            : (
              <>
                No pieces match your filters.{" "}
                <button onClick={() => { setCat("all"); setMax(5000); setSort("featured"); }} className="text-gold underline">
                  Reset
                </button>
              </>
            )}
        </div>
      ) : null}
    </div>
  );
}
