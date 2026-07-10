import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import hero from "@/assets/hero.jpg";
import bangles from "@/assets/cat-bangles.jpg";
import sets from "@/assets/cat-sets.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Udita's Creation Jewelry" },
      { name: "description", content: "Udita's Creation is a Kolkata-based fashion jewelry studio offering stylish, affordable and elegant jewelry for every occasion." },
      { property: "og:title", content: "Our Story — Udita's Creation Jewelry" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Our story</p>
          <h1 className="mt-3 font-serif text-4xl leading-[1.05] md:text-6xl">
            A little family studio, made with a lot of love.
          </h1>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>
              Udita's Creation is a Kolkata-based fashion jewelry studio. It began at a
              kitchen table in Kolkata, West Bengal, where three generations of women in
              our family strung their first jhumkas together for a cousin's wedding. What
              started as a gift turned into a small studio — and then into a promise.
            </p>
            <p>
              Every piece we make is designed in-house and handcrafted with artisan partners
              we've known for years. We use ethically sourced brass, real freshwater pearls
              and hand-set kundan to create stylish, affordable and elegant jewelry that
              feels heirloom-worthy but stays kind on your budget.
            </p>
            <p>
              We believe beautiful things should be worn often — not saved for occasions.
              So we obsess over comfort, finish and the small details that make a piece
              feel like <em>yours</em>, for every occasion.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border/60 pt-8">
            {[
              ["12k+", "Happy customers"],
              ["8 yrs", "Since 2018"],
              ["100%", "Handcrafted"],
            ].map(([n, l]) => (
              <div key={l as string}>
                <p className="font-serif text-3xl text-gold">{n}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-3xl">
              <img src={hero} alt="Founder" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="mt-10 space-y-4">
              <div className="overflow-hidden rounded-3xl">
                <img src={bangles} alt="Workshop" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="overflow-hidden rounded-3xl">
                <img src={sets} alt="Craft detail" loading="lazy" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="bg-beige/60 py-20">
        <div className="mx-auto max-w-5xl px-5 text-center md:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">The promise</p>
          <h2 className="mt-3 font-serif text-3xl md:text-5xl">Small batches. Big care.</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              ["Handcrafted", "Every piece is finished by hand — no two are quite the same."],
              ["Fair pricing", "Studio-direct pricing, no middlemen, no showroom markups."],
              ["Made to last", "Anti-tarnish finishes and free re-plating within a year."],
            ].map(([t, d]) => (
              <div key={t}>
                <p className="font-serif text-2xl">{t}</p>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}