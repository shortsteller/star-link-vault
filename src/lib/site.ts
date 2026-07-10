export const SITE = {
  name: "Udita's Creation",
  tagline: "Elegant Jewelry for Every Occasion",
  whatsapp: "916289400578",
  email: "moumitasaha2514@gmail.com",
  phone: "+91 6289400578",
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
  address: "Kolkata, West Bengal, India",
};

export const DEFAULT_WA_MESSAGE =
  "Hello! I would like to enquire about this jewelry item.";

export function waLink(message: string = DEFAULT_WA_MESSAGE) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}