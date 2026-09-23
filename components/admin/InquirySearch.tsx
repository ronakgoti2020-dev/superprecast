"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function InquirySearch({ initialQ = "" }: { initialQ?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQ);

  useEffect(() => {
    setValue(initialQ);
  }, [initialQ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const query = value.trim();
      const next = query
        ? `/admin/inquiries?q=${encodeURIComponent(query)}`
        : "/admin/inquiries";
      const current = `${window.location.pathname}${window.location.search}`;
      if (current !== next) router.replace(next);
    }, 250);
    return () => clearTimeout(timer);
  }, [value, router]);

  return (
    <input
      type="search"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      placeholder="Search by name or mobile number"
      className="w-full max-w-md border border-ink/15 bg-paper px-4 py-3"
      aria-label="Search enquiries by name or mobile number"
    />
  );
}
