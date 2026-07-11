import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  getDoc,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type StockStatus = "in-stock" | "out-of-stock" | "made-to-order";

export type FirestoreProduct = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stockStatus: StockStatus;
  imageUrls: string[];
  featuredCollection?: boolean;
  bestSeller?: boolean;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
};

const col = () => collection(db, "products");

export function subscribeProducts(
  cb: (products: FirestoreProduct[]) => void,
  onError?: (err: Error) => void,
) {
  const q = query(col(), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const list: FirestoreProduct[] = snap.docs.map((d) => {
        const data = d.data() as Omit<FirestoreProduct, "id">;
        return { id: d.id, ...data };
      });
      cb(list);
    },
    (err) => onError?.(err as Error),
  );
}

export async function getProductById(id: string): Promise<FirestoreProduct | null> {
  const snap = await getDoc(doc(db, "products", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<FirestoreProduct, "id">) };
}

export async function createProduct(
  data: Omit<FirestoreProduct, "id" | "createdAt" | "updatedAt">,
) {
  const ref = await addDoc(col(), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function editProduct(
  id: string,
  data: Partial<Omit<FirestoreProduct, "id" | "createdAt">>,
) {
  await updateDoc(doc(db, "products", id), { ...data, updatedAt: serverTimestamp() });
}

export async function removeProduct(id: string) {
  await deleteDoc(doc(db, "products", id));
}
