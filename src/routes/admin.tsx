import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { toast } from "sonner";
import {
  Loader2,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Search,
  X,
  ImagePlus,
  MoreVertical,
  Check,

} from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuthUser } from "@/lib/use-auth";
import {
  subscribeProducts,
  createProduct,
  editProduct,
  removeProduct,
  type FirestoreProduct,
  type StockStatus,
} from "@/lib/product-store";
import { uploadManyToCloudinary } from "@/lib/cloudinary";
import { CATEGORIES } from "@/lib/products";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — Udita's Creation" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user, loading } = useAuthUser();
  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }
  return user ? <Dashboard /> : <LoginCard />;
}

function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      toast.success("Welcome back");
    } catch (err) {
      toast.error((err as Error).message.replace("Firebase: ", ""));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-5 py-20 md:py-28">
      <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Admin</p>
        <h1 className="mt-2 font-serif text-3xl">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage the Udita's Creation catalogue.
        </p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <div>
            <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Username
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-gold"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-gold"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-foreground px-5 py-3 text-xs uppercase tracking-[0.25em] text-background transition hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

type SortKey = "newest" | "oldest" | "price-asc" | "price-desc" | "name";

function Dashboard() {
  const [products, setProducts] = useState<FirestoreProduct[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [editing, setEditing] = useState<FirestoreProduct | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const unsub = subscribeProducts(
      (list) => {
        setProducts(list);
        setLoaded(true);
      },
      (err) => toast.error(err.message),
    );
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (catFilter !== "all") list = list.filter((p) => p.category === catFilter);
    if (stockFilter !== "all") list = list.filter((p) => p.stockStatus === stockFilter);
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s) ||
          p.category.toLowerCase().includes(s),
      );
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "oldest")
      list.sort(
        (a, b) => (a.createdAt?.toMillis?.() ?? 0) - (b.createdAt?.toMillis?.() ?? 0),
      );
    else
      list.sort(
        (a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0),
      );
    return list;
  }, [products, search, catFilter, stockFilter, sort]);

  const handleDelete = async (p: FirestoreProduct) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await removeProduct(p.id);
      toast.success("Product deleted");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Admin dashboard</p>
          <h1 className="mt-1 font-serif text-3xl md:text-4xl">Products</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-xs uppercase tracking-[0.25em] text-background hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> New product
          </button>
          <button
            onClick={() => signOut(auth)}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-xs uppercase tracking-[0.25em] hover:border-gold hover:text-gold"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-3 rounded-2xl border border-border/60 bg-card p-4 md:grid-cols-[1fr_auto_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, description, category"
            className="w-full rounded-full border border-border bg-background pl-10 pr-4 py-2.5 text-sm outline-none focus:border-gold"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-gold"
        >
          <option value="all">All categories</option>
          {CATEGORIES.filter((c) => c.slug !== "new-arrivals").map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-gold"
        >
          <option value="all">All stock</option>
          <option value="in-stock">In stock</option>
          <option value="out-of-stock">Out of stock</option>
          <option value="made-to-order">Made to order</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-gold"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {loaded ? `${filtered.length} products` : "Loading…"}
      </p>

      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p) => (
          <article
            key={p.id}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card"
          >
            <ProductMenu
              product={p}
              onEdit={() => setEditing(p)}
              onDelete={() => handleDelete(p)}
            />
            <div className="aspect-[4/5] overflow-hidden bg-beige">
              {p.imageUrls[0] ? (
                <img
                  src={p.imageUrls[0]}
                  alt={p.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="grid h-full place-items-center text-muted-foreground">
                  <ImagePlus className="h-8 w-8" />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <div className="flex items-start justify-between gap-2 pr-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {p.category}
                  </p>
                  <h3 className="mt-1 font-serif text-lg">{p.name}</h3>
                </div>
                <p className="font-serif text-base text-gold">₹{p.price}</p>
              </div>
              <span
                className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] ${
                  p.stockStatus === "in-stock"
                    ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                    : p.stockStatus === "out-of-stock"
                    ? "border-red-500/40 text-red-600 dark:text-red-400"
                    : "border-amber-500/40 text-amber-600 dark:text-amber-400"
                }`}
              >
                {p.stockStatus.replace("-", " ")}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {p.featuredCollection ? (
                  <span className="inline-flex rounded-full border border-gold/50 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-gold">
                    Featured
                  </span>
                ) : null}
                {p.bestSeller ? (
                  <span className="inline-flex rounded-full border border-gold/50 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-gold">
                    Best seller
                  </span>
                ) : null}
              </div>
              <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
            </div>
          </article>
        ))}
      </div>

      {loaded && filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No products yet. Click <span className="text-foreground">New product</span> to add
          the first piece.
        </div>
      ) : null}

      {creating ? <ProductModal onClose={() => setCreating(false)} /> : null}
      {editing ? <ProductModal product={editing} onClose={() => setEditing(null)} /> : null}
    </div>
  );
}

function ProductModal({
  product,
  onClose,
}: {
  product?: FirestoreProduct;
  onClose: () => void;
}) {
  const isEdit = !!product;
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [category, setCategory] = useState(
    product?.category ?? CATEGORIES[0].slug,
  );
  const [price, setPrice] = useState<string>(product?.price?.toString() ?? "");
  const [stockStatus, setStockStatus] = useState<StockStatus>(
    product?.stockStatus ?? "in-stock",
  );
  const [imageUrls, setImageUrls] = useState<string[]>(product?.imageUrls ?? []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<Record<number, number>>({});
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setNewFiles((prev) => [...prev, ...arr]);
  };

  const previews = useMemo(
    () => newFiles.map((f) => URL.createObjectURL(f)),
    [newFiles],
  );
  useEffect(() => {
    return () => previews.forEach((u) => URL.revokeObjectURL(u));
  }, [previews]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !price) {
      toast.error("Please fill name, description and price");
      return;
    }
    if (imageUrls.length === 0 && newFiles.length === 0) {
      toast.error("Please add at least one image");
      return;
    }
    setBusy(true);
    try {
      let uploaded: string[] = [];
      if (newFiles.length) {
        uploaded = await uploadManyToCloudinary(newFiles, (idx, pct) =>
          setProgress((p) => ({ ...p, [idx]: pct })),
        );
      }
      const payload = {
        name: name.trim(),
        description: description.trim(),
        category,
        price: Number(price),
        stockStatus,
        imageUrls: [...imageUrls, ...uploaded],
      };
      if (isEdit && product) {
        await editProduct(product.id, payload);
        toast.success("Product updated");
      } else {
        await createProduct(payload);
        toast.success("Product added");
      }
      onClose();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-xl md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-border hover:border-gold hover:text-gold"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          {isEdit ? "Edit product" : "New product"}
        </p>
        <h2 className="mt-1 font-serif text-2xl md:text-3xl">
          {isEdit ? product?.name : "Add a piece"}
        </h2>

        <form onSubmit={submit} className="mt-6 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-gold"
              />
            </Field>
            <Field label="Price (₹)">
              <input
                required
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-gold"
              />
            </Field>
            <Field label="Category">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-gold"
              >
                {CATEGORIES.filter((c) => c.slug !== "new-arrivals").map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Stock status">
              <select
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value as StockStatus)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-gold"
              >
                <option value="in-stock">In stock</option>
                <option value="out-of-stock">Out of stock</option>
                <option value="made-to-order">Made to order</option>
              </select>
            </Field>
          </div>

          <Field label="Description">
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
          </Field>

          <div>
            <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Images
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                addFiles(e.dataTransfer.files);
              }}
              onClick={() => fileRef.current?.click()}
              className={`mt-2 grid cursor-pointer place-items-center rounded-xl border-2 border-dashed p-8 text-center transition ${
                dragOver ? "border-gold bg-gold/5" : "border-border"
              }`}
            >
              <Upload className="h-6 w-6 text-muted-foreground" />
              <p className="mt-2 text-sm text-foreground">
                Drop images here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">You can select multiple files</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && addFiles(e.target.files)}
              />
            </div>

            {(imageUrls.length > 0 || previews.length > 0) && (
              <div className="mt-4 grid grid-cols-3 gap-3 md:grid-cols-5">
                {imageUrls.map((url, i) => (
                  <div key={url} className="relative overflow-hidden rounded-lg border border-border/60">
                    <img src={url} alt="" className="aspect-square w-full object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        setImageUrls((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-white hover:bg-red-600"
                      aria-label="Remove"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {previews.map((url, i) => (
                  <div key={i} className="relative overflow-hidden rounded-lg border border-border/60">
                    <img src={url} alt="" className="aspect-square w-full object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        setNewFiles((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-white hover:bg-red-600"
                      aria-label="Remove"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {progress[i] !== undefined && progress[i] < 100 ? (
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-black/40">
                        <div
                          className="h-full bg-gold"
                          style={{ width: `${progress[i]}%` }}
                        />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border px-5 py-2.5 text-xs uppercase tracking-[0.25em] hover:border-gold hover:text-gold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-xs uppercase tracking-[0.25em] text-background hover:opacity-90 disabled:opacity-60"
            >
              {busy ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
                </>
              ) : isEdit ? (
                "Save changes"
              ) : (
                "Add product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function ProductMenu({
  product,
  onEdit,
  onDelete,
}: {
  product: FirestoreProduct;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const toggleFlag = async (field: "featuredCollection" | "bestSeller") => {
    try {
      await editProduct(product.id, { [field]: !product[field] });
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <div ref={ref} className="absolute right-2 top-2 z-10">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Product options"
        className="grid h-9 w-9 place-items-center rounded-full border border-border/70 bg-background/90 text-foreground/80 shadow-sm backdrop-blur transition hover:border-gold hover:text-gold"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open ? (
        <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-background p-1 shadow-lg">
          <button
            onClick={() => toggleFlag("featuredCollection")}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
          >
            <span className="grid h-4 w-4 place-items-center rounded border border-border">
              {product.featuredCollection ? <Check className="h-3 w-3 text-gold" /> : null}
            </span>
            Add to Featured Curated Collections
          </button>
          <button
            onClick={() => toggleFlag("bestSeller")}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
          >
            <span className="grid h-4 w-4 place-items-center rounded border border-border">
              {product.bestSeller ? <Check className="h-3 w-3 text-gold" /> : null}
            </span>
            Add to Beloved Best Sellers
          </button>
          <div className="my-1 h-px bg-border" />
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit Product
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-500/10"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete Product
          </button>
        </div>
      ) : null}
    </div>
  );
}
