import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Menu, Moon, Sun, X } from "lucide-react";
import { SITE } from "@/lib/site";

const links = [
  { to: "/", label: "Home" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/85 backdrop-blur-md"
          : "bg-background/40 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-medium tracking-wide md:text-3xl">
            {SITE.name}
          </span>
          <span className="hidden h-1.5 w-1.5 rounded-full bg-gold md:inline-block" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm uppercase tracking-[0.2em] text-foreground/80 gold-underline"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/admin"
            aria-label="Admin"
            title="Admin"
            className="hidden h-10 items-center gap-1.5 rounded-full border border-border/70 px-3 text-[11px] uppercase tracking-[0.2em] text-foreground/80 transition hover:border-gold hover:text-gold md:inline-flex"
          >
            <Lock className="h-3.5 w-3.5" /> Admin
          </Link>
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-full border border-border/70 text-foreground/80 transition hover:border-gold hover:text-gold"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-border/70 text-foreground/80 md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-5 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-3 text-sm uppercase tracking-[0.2em] text-foreground/80"
                activeProps={{ className: "text-gold" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center gap-2 py-3 text-sm uppercase tracking-[0.2em] text-foreground/80"
            >
              <Lock className="h-3.5 w-3.5" /> Admin
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}