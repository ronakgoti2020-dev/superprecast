"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm(`Delete “${name}”? This cannot be undone.`)) return;
    setBusy(true);
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button onClick={onDelete} disabled={busy} className="text-terracotta">
      {busy ? "Deleting..." : "Delete"}
    </button>
  );
}
