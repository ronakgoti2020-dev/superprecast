"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteInquiryButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm(`Delete enquiry from “${name}”? This cannot be undone.`)) return;
    setBusy(true);
    await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={busy}
      className="text-sm text-terracotta disabled:opacity-60"
    >
      {busy ? "Deleting..." : "Delete"}
    </button>
  );
}
