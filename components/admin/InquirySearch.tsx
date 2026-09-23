"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function InquirySearch({
  initialQ = "",
  action = "/admin/inquiries",
  className = "w-full max-w-md border border-ink/15 bg-paper px-4 py-3",
}: {
  initialQ?: string;
  action?: string;
  className?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialQ);

  useEffect(() => {
    setValue(initialQ);
  }, [initialQ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const query = value.trim();
      const next = query ? `${action}?q=${encodeURIComponent(query)}` : action;
      const current = `${window.location.pathname}${window.location.search}`;
      if (current !== next) router.replace(next);
    }, 250);
    return () => clearTimeout(timer);
  }, [value, action, router]);

  return (
    <input
      type="search"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      placeholder="Search by name or mobile number"
      className={className}
      aria-label="Search enquiries by name or mobile number"
    />
  );
}
