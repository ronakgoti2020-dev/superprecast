"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductVisual } from "@/components/ProductVisual";

type Category = { id: string; name: string };

type ProductValue = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  details: string;
  price: number | null;
  priceUnit: string;
  moq: number | null;
  size: string | null;
  color: string | null;
  weight: string | null;
  material: string;
  design: string | null;
  usage: string | null;
  shape: string | null;
  featured: boolean;
  inStock: boolean;
  categoryId: string;
  image: string | null;
  images?: { url: string }[];
};

type DraftPhoto = { url: string; file?: File };

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: ProductValue;
}) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [color, setColor] = useState(product?.color || "");
  const [design, setDesign] = useState(product?.design || "");
  const [photos, setPhotos] = useState<DraftPhoto[]>(() => {
    if (product?.images && product.images.length > 0) {
      return product.images.map((item) => ({ url: item.url }));
    }
    return product?.image ? [{ url: product.image }] : [];
  });
  const [categoryId, setCategoryId] = useState(product?.categoryId || "");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    form.delete("images");
    form.set(
      "keepImages",
      JSON.stringify(photos.map((photo) => (photo.file ? "" : photo.url))),
    );
    for (const photo of photos) {
      if (photo.file) form.append("images", photo.file);
    }
    const url = product?.id ? `/api/admin/products/${product.id}` : "/api/admin/products";
    const method = product?.id ? "PUT" : "POST";
    try {
      const response = await fetch(url, { method, body: form });
      const text = await response.text();
      let data: { error?: string } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }
      setSaving(false);
      if (!response.ok) {
        setStatus(
          data.error ||
            (response.status === 413
              ? "Photo is too large. Use a JPG or PNG under 8MB."
              : "Could not save product"),
        );
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setSaving(false);
      setStatus("Could not save product. Check the photo and try again.");
    }
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const next: DraftPhoto[] = [];
    for (const file of Array.from(list)) {
      const type = file.type.toLowerCase();
      const name = file.name.toLowerCase();
      const okType =
        allowed.includes(type) ||
        name.endsWith(".jpg") ||
        name.endsWith(".jpeg") ||
        name.endsWith(".png") ||
        name.endsWith(".webp") ||
        name.endsWith(".gif");
      if (!okType) {
        setStatus("Use JPG, PNG, WEBP, or GIF. iPhone: set Camera to Most Compatible.");
        continue;
      }
      if (file.size > 8 * 1024 * 1024) {
        setStatus("Each photo must be under 8MB.");
        continue;
      }
      next.push({ url: URL.createObjectURL(file), file });
    }
    if (next.length) setPhotos((current) => [...current, ...next]);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <Field label="Product name">
            <input name="name" required defaultValue={product?.name} className="admin-input" />
          </Field>
          <Field label="URL slug (optional)">
            <input name="slug" defaultValue={product?.slug} className="admin-input" />
          </Field>
          <Field label="Category">
            <select
              name="categoryId"
              required
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="admin-input"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Description">
            <textarea name="description" rows={5} defaultValue={product?.description} className="admin-input" />
          </Field>
          <Field label="Details (one per line)">
            <textarea name="details" rows={4} defaultValue={product?.details} className="admin-input" />
          </Field>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Price">
              <input name="price" type="number" step="0.01" defaultValue={product?.price ?? ""} className="admin-input" />
            </Field>
            <Field label="Unit">
              <input name="priceUnit" defaultValue={product?.priceUnit || "Piece"} className="admin-input" />
            </Field>
            <Field label="MOQ">
              <input name="moq" type="number" defaultValue={product?.moq ?? ""} className="admin-input" />
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Size">
              <input name="size" defaultValue={product?.size ?? ""} className="admin-input" />
            </Field>
            <Field label="Colour">
              <input
                name="color"
                defaultValue={product?.color ?? ""}
                className="admin-input"
                onChange={(e) => setColor(e.target.value)}
              />
            </Field>
            <Field label="Weight">
              <input
                name="weight"
                defaultValue={product?.weight ?? ""}
                placeholder="2.5 kg"
                className="admin-input"
              />
            </Field>
            <Field label="Material">
              <input name="material" defaultValue={product?.material || "Concrete"} className="admin-input" />
            </Field>
            <Field label="Design">
              <input
                name="design"
                defaultValue={product?.design ?? ""}
                className="admin-input"
                onChange={(e) => setDesign(e.target.value)}
                placeholder="circle, leaf, kerb, paver..."
              />
            </Field>
            <Field label="Usage">
              <input name="usage" defaultValue={product?.usage ?? ""} className="admin-input" />
            </Field>
            <Field label="Shape">
              <input name="shape" defaultValue={product?.shape ?? ""} className="admin-input" />
            </Field>
          </div>
          <div className="flex gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="featured" defaultChecked={product?.featured} />
              Featured on homepage
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="inStock" defaultChecked={product?.inStock ?? true} />
              In stock
            </label>
          </div>
        </div>
      </div>

      <section className="border border-ink/10 bg-paper p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl">Photos</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Add several photos for one product. The first photo is the cover image.
            </p>
          </div>
          <label className="cursor-pointer bg-ink px-4 py-2 text-sm text-cream">
            Add photos
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
              multiple
              className="hidden"
              onChange={(event) => {
                addFiles(event.target.files);
                event.target.value = "";
              }}
            />
          </label>
        </div>

        {photos.length === 0 ? (
          <div className="mt-5 aspect-[4/3] max-w-sm overflow-hidden border border-ink/10">
            <ProductVisual design={design} color={color} className="h-full w-full" />
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo, index) => (
              <div key={`${photo.url}-${index}`} className="border border-ink/10 bg-cream p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt="" className="aspect-square w-full object-cover" />
                <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                  <span className="text-ink-soft">{index === 0 ? "Cover" : `Photo ${index + 1}`}</span>
                  <div className="flex gap-2">
                    {index > 0 ? (
                      <button
                        type="button"
                        className="text-ink"
                        onClick={() =>
                          setPhotos((current) => {
                            const next = [...current];
                            const [item] = next.splice(index, 1);
                            next.unshift(item);
                            return next;
                          })
                        }
                      >
                        Make cover
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="text-terracotta"
                      onClick={() => setPhotos((current) => current.filter((_, i) => i !== index))}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {status ? <p className="text-sm text-terracotta">{status}</p> : null}
      <button disabled={saving} className="bg-terracotta px-6 py-3 text-sm text-cream disabled:opacity-60">
        {saving ? "Saving..." : product ? "Update product" : "Add product"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-ink-soft">{label}</span>
      {children}
    </label>
  );
}
