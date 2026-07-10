import earrings from "@/assets/cat-earrings.jpg";
import necklaces from "@/assets/cat-necklaces.jpg";
import bangles from "@/assets/cat-bangles.jpg";
import sets from "@/assets/cat-sets.jpg";
import rings from "@/assets/cat-rings.jpg";
import bracelets from "@/assets/cat-bracelets.jpg";
import anklets from "@/assets/cat-anklets.jpg";

export const CATEGORIES = [
  { slug: "jhumkas", name: "Jhumkas", image: earrings },
  { slug: "earrings", name: "Earrings", image: earrings },
  { slug: "necklaces", name: "Necklaces", image: necklaces },
  { slug: "bangles", name: "Bangles", image: bangles },
  { slug: "bracelets", name: "Bracelets", image: bracelets },
  { slug: "rings", name: "Rings", image: rings },
  { slug: "anklets", name: "Anklets", image: anklets },
  { slug: "sets", name: "Jewelry Sets", image: sets },
  { slug: "new-arrivals", name: "New Arrivals", image: necklaces },
];

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  short: string;
  description: string;
  image: string;
  gallery: string[];
  colors: string[];
  material: string;
  care: string;
  bestSeller?: boolean;
  newArrival?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: "jhumka-royale",
    name: "Jhumka Royale",
    price: 1299,
    category: "jhumkas",
    short: "Handcrafted temple-style jhumkas with pearl drops.",
    description:
      "Inspired by the temple corridors of the south, the Jhumka Royale features intricate embossed detailing and delicate pearl fringes that catch every glimmer of light.",
    image: earrings,
    gallery: [earrings, sets, necklaces],
    colors: ["Antique Gold", "Rose Gold"],
    material: "Brass with 24k gold polish, faux pearls",
    care: "Store in the pouch provided. Avoid contact with perfume and water.",
    bestSeller: true,
  },
  {
    id: "meher-choker",
    name: "Meher Choker",
    price: 2499,
    category: "necklaces",
    short: "Statement kundan choker for festive nights.",
    description:
      "A regal choker crafted with kundan-inspired stones and delicate meenakari work — the centrepiece your ensemble deserves.",
    image: necklaces,
    gallery: [necklaces, sets, earrings],
    colors: ["Emerald", "Ruby", "Ivory"],
    material: "Alloy base with kundan work",
    care: "Wipe with a dry cloth. Keep away from moisture.",
    bestSeller: true,
    newArrival: true,
  },
  {
    id: "noor-bangle-stack",
    name: "Noor Bangle Stack",
    price: 1799,
    category: "bangles",
    short: "A set of six luminous gold-toned bangles.",
    description:
      "Six thoughtfully layered bangles that chime softly as you move — an everyday luxury with festive versatility.",
    image: bangles,
    gallery: [bangles, sets, earrings],
    colors: ["Gold", "Champagne"],
    material: "Brass with matte gold finish",
    care: "Avoid contact with water and lotions.",
    bestSeller: true,
  },
  {
    id: "aisha-bracelet",
    name: "Aisha Cuff",
    price: 1499,
    category: "bracelets",
    short: "Ornate polki cuff with hand-set stones.",
    description:
      "A single sculptural cuff finished with intricate polki work — the finishing touch to any occasion outfit.",
    image: bracelets,
    gallery: [bracelets, necklaces],
    colors: ["Antique Gold"],
    material: "Brass, glass stones",
    care: "Store separately to avoid scratching.",
    newArrival: true,
  },
  {
    id: "saanjh-ring-duo",
    name: "Saanjh Ring Duo",
    price: 899,
    category: "rings",
    short: "A pair of delicate everyday rings.",
    description:
      "Delicate, stackable and quietly elegant — a duo made for daily wear and layered stories.",
    image: rings,
    gallery: [rings],
    colors: ["Gold", "Rose Gold"],
    material: "Brass with gold plating, freshwater pearl",
    care: "Remove before washing hands.",
  },
  {
    id: "payal-mehr",
    name: "Payal Mehr",
    price: 1099,
    category: "anklets",
    short: "Slim gold-tone anklet with tiny drops.",
    description:
      "A whisper of gold at your ankle — Payal Mehr is minimal, feminine, and endlessly wearable.",
    image: anklets,
    gallery: [anklets],
    colors: ["Gold"],
    material: "Brass with gold plating",
    care: "Avoid pulling. Store flat.",
    newArrival: true,
  },
  {
    id: "raagini-bridal-set",
    name: "Raagini Bridal Set",
    price: 4999,
    category: "sets",
    short: "Necklace, earrings and maang tikka set.",
    description:
      "The Raagini set is a complete bridal statement — necklace, matching earrings and maang tikka, hand-finished with intricate detailing.",
    image: sets,
    gallery: [sets, necklaces, earrings],
    colors: ["Ruby", "Emerald"],
    material: "Alloy, kundan, faux pearls",
    care: "Store in the box provided. Handle with care.",
    bestSeller: true,
  },
  {
    id: "zara-hoops",
    name: "Zara Hoops",
    price: 799,
    category: "earrings",
    short: "Modern textured gold hoops.",
    description:
      "Sleek, textured hoops for the everyday muse — light on the ear, heavy on impact.",
    image: earrings,
    gallery: [earrings],
    colors: ["Gold"],
    material: "Brass with 18k gold polish",
    care: "Wipe clean with a soft cloth.",
    newArrival: true,
  },
  {
    id: "chandbali-jhumka",
    name: "Chandbali Jhumka",
    price: 1499,
    category: "jhumkas",
    short: "Crescent-shaped chandbali with delicate bead work.",
    description:
      "A crescent-cut chandbali with intricate bead detailing — a graceful nod to Mughal-era silhouettes.",
    image: earrings,
    gallery: [earrings],
    colors: ["Antique Gold"],
    material: "Brass with gold polish",
    care: "Store in the pouch. Avoid moisture.",
    newArrival: true,
  },
];

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}