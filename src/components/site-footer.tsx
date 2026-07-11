import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4 md:px-8">
        <div>
          <p className="font-serif text-2xl">{SITE.name}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Kolkata-based fashion jewelry studio. Stylish, affordable and elegant pieces for every occasion.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/gallery" className="gold-underline">Gallery</Link></li>
            <li><Link to="/about" className="gold-underline">About us</Link></li>
            <li><Link to="/contact" className="gold-underline">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Studio</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> {SITE.address}</li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Get in touch</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> {SITE.email}</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> {SITE.phone} · WhatsApp</li>
          </ul>
          <div className="mt-4 flex gap-3">
            <a href={SITE.instagram} target="_blank" rel="noreferrer" aria-label={`Instagram — @${SITE.instagramHandle}`} title={`@${SITE.instagramHandle}`}
               className="grid h-10 w-10 place-items-center rounded-full border border-border/70 transition hover:border-gold hover:text-gold">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={SITE.facebook} target="_blank" rel="noreferrer" aria-label={`Facebook — ${SITE.facebookName}`} title={SITE.facebookName}
               className="grid h-10 w-10 place-items-center rounded-full border border-border/70 transition hover:border-gold hover:text-gold">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-muted-foreground md:flex-row md:px-8">
          <p>© {new Date().getFullYear()} {SITE.name}. Crafted with care.</p>
          <p className="tracking-[0.2em] uppercase">Handmade in Kolkata, India</p>
        </div>
      </div>
    </footer>
  );
}