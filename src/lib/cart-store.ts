import { useSyncExternalStore } from "react";

export type CartItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  quantity: number;
};

const KEY = "uditas_cart_v1";
const listeners = new Set<() => void>();
let items: CartItem[] = [];
let hydrated = false;

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((i) => i && typeof i.id === "string");
  } catch {
    return [];
  }
}

function write() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* noop */
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  items = read();
  hydrated = true;
  if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
      if (e.key === KEY) {
        items = read();
        emit();
      }
    });
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  hydrate();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  hydrate();
  return items;
}

function getServerSnapshot(): CartItem[] {
  return [];
}

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function addToCart(item: Omit<CartItem, "quantity">, qty = 1) {
  hydrate();
  const existing = items.find((i) => i.id === item.id);
  if (existing) {
    items = items.map((i) =>
      i.id === item.id ? { ...i, quantity: i.quantity + qty } : i,
    );
  } else {
    items = [...items, { ...item, quantity: qty }];
  }
  write();
  emit();
}

export function updateQuantity(id: string, qty: number) {
  hydrate();
  if (qty <= 0) {
    items = items.filter((i) => i.id !== id);
  } else {
    items = items.map((i) => (i.id === id ? { ...i, quantity: qty } : i));
  }
  write();
  emit();
}

export function removeFromCart(id: string) {
  hydrate();
  items = items.filter((i) => i.id !== id);
  write();
  emit();
}

export function clearCart() {
  items = [];
  write();
  emit();
}

export function cartTotals(list: CartItem[]) {
  const totalItems = list.length;
  const totalQuantity = list.reduce((s, i) => s + i.quantity, 0);
  const grandTotal = list.reduce((s, i) => s + i.quantity * i.price, 0);
  return { totalItems, totalQuantity, grandTotal };
}
