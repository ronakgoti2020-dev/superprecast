"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteWorkButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm(`Delete “${title}”? This cannot be undone.`)) return;
    setBusy(true);
    await fetch(`/api/admin/work/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button onClick={onDelete} disabled={busy} className="text-terracotta">
      {busy ? "Deleting..." : "Delete"}
    </button>
  );
}
