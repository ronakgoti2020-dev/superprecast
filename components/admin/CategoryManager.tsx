"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type CategoryRow = {
  id: string;
  name: string;
  description: string;
  _count?: { products: number };
};

export function CategoryManager({ categories }: { categories: CategoryRow[] }) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const created = await response.json().catch(() => ({}));
    setSaving(false);
    if (!response.ok) {
      setStatus(created.error || "Could not add category. Name may already exist.");
      return;
    }
    form.reset();
    setStatus(`Added “${created.name}”.`);
    router.refresh();
  }

  async function onDelete(category: CategoryRow) {
    const count = category._count?.products ?? 0;
    if (count > 0) {
      setStatus(`Move or delete ${count} product(s) in “${category.name}” first.`);
      return;
    }
    if (!confirm(`Delete “${category.name}”?`)) return;
    setDeletingId(category.id);
    setStatus("");
    const response = await fetch(`/api/admin/categories/${category.id}`, { method: "DELETE" });
    const data = await response.json().catch(() => ({}));
    setDeletingId("");
    if (!response.ok) {
      setStatus(data.error || "Could not delete category.");
      return;
    }
    setStatus(`Deleted “${category.name}”.`);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} className="border border-ink/10 bg-paper p-5">
        <h2 className="font-display text-2xl">Add category</h2>
        <p className="mt-1 mb-5 text-sm text-ink-soft">
          New categories appear in the product dropdown.
        </p>
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input name="name" required placeholder="Category name" className="admin-input" />
          <input name="description" placeholder="Short description" className="admin-input" />
          <button disabled={saving} className="bg-ink px-5 py-3 text-sm text-cream disabled:opacity-60">
            {saving ? "Saving..." : "Add category"}
          </button>
        </div>
        {status ? <p className="mt-3 text-sm text-ink-soft">{status}</p> : null}
      </form>

      <div className="overflow-x-auto border border-ink/10 bg-paper">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-sand text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Products</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-ink-soft">
                  No categories yet. Add one above.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="border-t border-ink/10">
                  <td className="px-4 py-3">{category.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{category.description || "—"}</td>
                  <td className="px-4 py-3">{category._count?.products ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      disabled={deletingId === category.id}
                      onClick={() => onDelete(category)}
                      className="text-terracotta disabled:opacity-60"
                    >
                      {deletingId === category.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
