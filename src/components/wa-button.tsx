import { MessageCircle } from "lucide-react";
import { waLink, DEFAULT_WA_MESSAGE } from "@/lib/site";

export function WhatsAppButton({
  message = DEFAULT_WA_MESSAGE,
  children = "Order on WhatsApp",
  variant = "solid",
  className = "",
}: {
  message?: string;
  children?: React.ReactNode;
  variant?: "solid" | "outline" | "ghost";
  className?: string;
}) {
  const styles =
    variant === "solid"
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : variant === "outline"
      ? "border border-primary/80 text-foreground hover:bg-primary hover:text-primary-foreground"
      : "text-foreground hover:text-gold";
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em] transition ${styles} ${className}`}
    >
      <MessageCircle className="h-4 w-4" />
      {children}
    </a>
  );
}