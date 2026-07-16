import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, ChevronRight, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { getProductById, subscribeProducts, type FirestoreProduct } from "@/lib/product-store";
import { addToCart } from "@/lib/cart-store";
import { WhatsAppButton } from "@/components/wa-button";

export const Route = createFileRoute("/product/$id")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Product — Udita's Creation" },
      { property: "og:type", content: "product" },
    ],
  }),
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
  const { id } = Route.useParams();
  const [product, setProduct] = useState<FirestoreProduct | null>(null);
  const [related, setRelated] = useState<FirestoreProduct[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState({ x: 50, y: 50, on: false });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const p = await getProductById(id);
        if (cancelled) return;
        if (!p) {
          setStatus("missing");
          return;
        }
        setProduct(p);
        setActive(0);
        setStatus("ready");
      } catch (err) {
        if (!cancelled) {
          toast.error((err as Error).message);
          setStatus("missing");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!product) return;
    const unsub = subscribeProducts((list) => {
      setRelated(list.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4));
    });
    return () => unsub();
  }, [product]);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (!product) return;
    if (navigator.share) {
      try { await navigator.share({ title: product.name, url }); } catch { /* noop */ }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    }
  };

  if (status === "loading") {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }
  if (status === "missing" || !product) {
    throw notFound();
  }

  const gallery = product.imageUrls.length > 0 ? product.imageUrls : [""];

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
              src={gallery[active]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500"
              style={zoom.on ? { transform: `scale(1.6)`, transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            />
          </div>
          {gallery.length > 1 ? (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {gallery.map((g, i) => (
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
          <span
            className={`mt-3 inline-flex rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.25em] ${
              product.stockStatus === "in-stock"
                ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                : product.stockStatus === "out-of-stock"
                ? "border-red-500/40 text-red-600 dark:text-red-400"
                : "border-amber-500/40 text-amber-600 dark:text-amber-400"
            }`}
          >
            {product.stockStatus.replace("-", " ")}
          </span>
          <p className="mt-6 whitespace-pre-line text-muted-foreground">{product.description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <WhatsAppButton
              className="min-w-[220px]"
              message={`Hello! I would like to enquire about this product.\n\nProduct Name: ${product.name}\nCategory: ${product.category}\nPrice: ₹${product.price}\n\nProduct Link:\n${typeof window !== "undefined" ? window.location.href : ""}\n\nI am interested in purchasing this item. Please provide more details.`}
            >
              Order on WhatsApp
            </WhatsAppButton>
            <button onClick={share}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-xs uppercase tracking-[0.25em] transition hover:border-gold hover:text-gold">
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>

          <dl className="mt-10 divide-y divide-border/60 rounded-2xl border border-border/60">
            {[
              ["Category", product.category],
              ["Availability", product.stockStatus.replace("-", " ")],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[120px_1fr] gap-4 px-5 py-4 text-sm">
                <dt className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{k}</dt>
                <dd className="text-foreground/90 capitalize">{v}</dd>
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
                  <img src={p.imageUrls[0]} alt={p.name} loading="lazy"
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
