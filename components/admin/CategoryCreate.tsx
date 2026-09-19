"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function CategoryCreate({ categories = [] }: { categories?: { id: string; name: string }[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [list, setList] = useState(categories);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const created = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus("Could not add category. Name may already exist.");
      return;
    }
    setList((current) =>
      [...current, { id: created.id, name: created.name }].sort((a, b) => a.name.localeCompare(b.name)),
    );
    form.reset();
    setOpen(false);
    setStatus(`Added “${created.name}”.`);
    router.refresh();
  }

  return (
    <div className="mt-6">
      {list.length > 0 ? (
        <p className="mb-3 text-sm text-ink-soft">
          Categories: {list.map((category) => category.name).join(" · ")}
        </p>
      ) : (
        <p className="mb-3 text-sm text-terracotta">No categories yet.</p>
      )}
      <button type="button" onClick={() => setOpen((v) => !v)} className="text-sm text-terracotta">
        {open ? "Close" : "Add a new category"}
      </button>
      {open ? (
        <form onSubmit={onSubmit} className="mt-4 grid gap-3 border border-ink/10 bg-paper p-4 md:grid-cols-[1fr_1fr_auto]">
          <input name="name" required placeholder="Category name" className="admin-input" />
          <input name="description" placeholder="Short description" className="admin-input" />
          <button className="bg-ink px-4 py-3 text-sm text-cream">Save category</button>
          {status ? <p className="md:col-span-3 text-sm text-terracotta">{status}</p> : null}
        </form>
      ) : null}
    </div>
  );
}
