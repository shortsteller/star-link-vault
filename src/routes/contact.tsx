import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { SITE, waLink } from "@/lib/site";
import { WhatsAppButton } from "@/components/wa-button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Udita's Creation Jewelry" },
      { name: "description", content: "Get in touch with Udita's Creation — WhatsApp, email or Instagram. Based in Kolkata, West Bengal, India." },
      { property: "og:title", content: "Contact — Udita's Creation Jewelry" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sending, setSending] = useState(false);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const data = new FormData(e.currentTarget);
    const msg = `Hi Udita's Creation!\n\nName: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`;
    setTimeout(() => {
      setSending(false);
      toast.success("Opening WhatsApp with your message…");
      window.open(waLink(msg), "_blank");
    }, 400);
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-20">
      <div className="grid gap-12 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Say hello</p>
          <h1 className="mt-3 font-serif text-4xl md:text-6xl">Let's talk jewelry.</h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Custom orders, styling questions or wholesale — we love hearing from you. We reply within a few hours.
          </p>

          <div className="mt-8 space-y-4 text-sm">
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 gold-underline">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-beige"><Mail className="h-4 w-4 text-gold" /></span>
              {SITE.email}
            </a>
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 gold-underline">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-beige"><Phone className="h-4 w-4 text-gold" /></span>
              {SITE.phone}
            </a>
            <p className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-beige"><MapPin className="h-4 w-4 text-gold" /></span>
              {SITE.address}
            </p>
          </div>

          <div className="mt-8 flex gap-3">
            <WhatsAppButton message="Hi Udita's Creation!">WhatsApp</WhatsAppButton>
            <a href={SITE.instagram} target="_blank" rel="noreferrer"
               className="grid h-11 w-11 place-items-center rounded-full border border-border transition hover:border-gold hover:text-gold">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={SITE.facebook} target="_blank" rel="noreferrer"
               className="grid h-11 w-11 place-items-center rounded-full border border-border transition hover:border-gold hover:text-gold">
              <Facebook className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-10 overflow-hidden rounded-3xl border border-border/60">
            <iframe
              title="Studio location — Kolkata, West Bengal"
              src="https://www.openstreetmap.org/export/embed.html?bbox=88.30%2C22.53%2C88.40%2C22.60&layer=mapnik"
              className="h-64 w-full"
              loading="lazy"
            />
          </div>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="h-fit space-y-4 rounded-3xl border border-border/60 bg-card p-6 md:p-8"
        >
          <div>
            <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Name</label>
            <input name="name" required
                   className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-gold" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Email</label>
            <input name="email" type="email" required
                   className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-gold" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Message</label>
            <textarea name="message" required rows={5}
                      className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-gold" />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-xs uppercase tracking-[0.25em] text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {sending ? "Sending…" : "Send via WhatsApp"}
          </button>
        </motion.form>
      </div>
    </div>
  );
}