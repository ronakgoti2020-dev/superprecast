"use client";

import { useRouter } from "next/navigation";

export function InquiryStatus({ id, status }: { id: string; status: string }) {
  const router = useRouter();

  async function onChange(next: string) {
    await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    router.refresh();
  }

  return (
    <select
      defaultValue={status}
      onChange={(e) => onChange(e.target.value)}
      className="border border-ink/15 bg-paper px-2 py-1 text-sm"
    >
      <option value="new">New</option>
      <option value="contacted">Contacted</option>
      <option value="closed">Closed</option>
    </select>
  );
}
