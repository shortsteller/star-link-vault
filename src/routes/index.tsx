import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import { WhatsAppButton } from "@/components/wa-button";
import { subscribeProducts, type FirestoreProduct } from "@/lib/product-store";

export const Route = createFileRoute("/")({
  component: Index,
});

const testimonials = [
  { name: "Ananya S.", city: "Mumbai", quote: "The craftsmanship is exceptional. I get compliments every time I wear my Meher choker." },
  { name: "Priya R.", city: "Bengaluru", quote: "Beautifully packaged and even more beautiful in person. My go-to for gifting." },
  { name: "Ritika M.", city: "Kolkata", quote: "Affordable luxury done right. Feels heirloom-worthy." },
];

function Index() {
  const [items, setItems] = useState<FirestoreProduct[]>([]);
  useEffect(() => {
    const unsub = subscribeProducts((list) => setItems(list));
    return () => unsub();
  }, []);
  const featured = items.filter((p) => p.featuredCollection);
  const best = items.filter((p) => p.bestSeller);
  const insta = [0, 1, 2, 3, 4, 5];

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-10 md:grid-cols-[1.05fr_1fr] md:gap-16 md:px-8 md:pb-24 md:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center"
          >
            <span className="inline-flex items-center gap-2 self-start rounded-full border border-border/70 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-gold" /> New Festive Edit 2026
            </span>
            <h1 className="mt-6 text-balance font-serif text-5xl leading-[1.05] md:text-7xl">
              Elegant Jewelry
              <br />
              for <em className="text-gold not-italic">Every</em> Occasion.
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted-foreground md:text-lg">
              Handcrafted in small batches in our Kolkata studio. Udita's Creation blends
              timeless silhouettes with contemporary polish — stylish, affordable and elegant
              jewelry for every occasion.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-xs uppercase tracking-[0.25em] text-primary-foreground transition hover:opacity-90"
              >
                View Gallery <ArrowRight className="h-4 w-4" />
              </Link>
              <WhatsAppButton variant="outline">
                Chat on WhatsApp
              </WhatsAppButton>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border/60 pt-8">
              {[
                ["Handcrafted", "Small-batch artisans"],
                ["Free Shipping", "Across India"],
                ["7-day", "Easy exchange"],
              ].map(([t, s]) => (
                <div key={t}>
                  <p className="font-serif text-lg md:text-xl">{t}</p>
                  <p className="text-xs text-muted-foreground md:text-sm">{s}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-gold/25 via-beige to-transparent blur-2xl" />
            <div className="overflow-hidden rounded-[2rem] border border-border/60 bg-beige">
              <img
                src={hero}
                alt="Model wearing handcrafted gold jewelry"
                width={1600}
                height={1200}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden max-w-[220px] rounded-2xl border border-border/60 bg-background/90 p-4 backdrop-blur md:block">
              <div className="flex items-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-current" />
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                “Feels heirloom-worthy” — <span className="text-foreground">Vogue India</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Featured</p>
            <h2 className="mt-2 font-serif text-3xl md:text-5xl">Curated collections</h2>
          </div>
          <Link to="/gallery" className="hidden text-xs uppercase tracking-[0.25em] gold-underline md:inline">
            View all
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {featured.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card"
            >
              <Link to="/product/$id" params={{ id: p.id }}>
                <div className="aspect-[4/5] overflow-hidden bg-beige">
                  <img
                    src={p.imageUrls?.[0]}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-end justify-between gap-4 p-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      {p.category}
                    </p>
                    <p className="mt-1 font-serif text-xl">{p.name}</p>
                  </div>
                  <p className="font-serif text-lg text-gold">₹{p.price}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-beige/50 py-12">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {CATEGORIES.slice(0, 7).map((c) => (
              <Link
                key={c.slug}
                to="/gallery"
                className="rounded-full border border-border bg-background px-5 py-2 text-xs uppercase tracking-[0.2em] transition hover:border-gold hover:text-gold"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Beloved</p>
            <h2 className="mt-2 font-serif text-3xl md:text-5xl">Best sellers</h2>
          </div>
          <Link to="/gallery" className="hidden text-xs uppercase tracking-[0.25em] gold-underline md:inline">
            View gallery
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {best.map((p) => (
            <Link
              key={p.id}
              to="/product/$id"
              params={{ id: p.id }}
              className="group block"
            >
              <div className="overflow-hidden rounded-2xl bg-beige">
                <img
                  src={p.imageUrls?.[0]}
                  alt={p.name}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <p className="font-serif text-base">{p.name}</p>
                <p className="text-sm text-gold">₹{p.price}</p>
              </div>
              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{p.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Kind words</p>
          <h2 className="mt-2 font-serif text-3xl md:text-5xl">Loved by 12,000+ women</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.blockquote
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6"
              >
                <div className="flex gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-3 w-3 fill-current" />
                  ))}
                </div>
                <p className="mt-4 font-serif text-xl leading-snug">“{t.quote}”</p>
                <footer className="mt-6 text-xs uppercase tracking-[0.25em] text-primary-foreground/70">
                  {t.name} · {t.city}
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="flex flex-col items-center text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">@uditascreation</p>
          <h2 className="mt-2 font-serif text-3xl md:text-5xl">Follow the story</h2>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground">
            Get styling inspiration, backstage peeks and first access to drops.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-6">
          {insta.map((i) => {
            const p = PRODUCTS[i % PRODUCTS.length];
            return (
              <a key={i} href="https://instagram.com" target="_blank" rel="noreferrer"
                 className="group relative aspect-square overflow-hidden rounded-xl bg-beige">
                <img src={p.image} alt="Instagram" loading="lazy"
                     className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-primary/0 transition-colors group-hover:bg-primary/30" />
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}