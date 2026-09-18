"use client";

import { FormEvent, useState } from "react";

type QuoteFormProps = {
  productId?: string;
  productName?: string;
};

export function QuoteForm({ productId, productName }: QuoteFormProps) {
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, productId }),
    });
    if (!response.ok) {
      setStatus("error");
      return;
    }
    form.reset();
    setStatus("done");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {productName ? (
        <p className="text-sm text-ink-soft">
          Enquiry for <span className="text-ink">{productName}</span>
        </p>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        <input name="name" required placeholder="Your name" className="border border-ink/15 bg-paper px-4 py-3" />
        <input name="phone" required placeholder="Phone number" className="border border-ink/15 bg-paper px-4 py-3" />
        <input name="email" type="email" placeholder="Email (optional)" className="border border-ink/15 bg-paper px-4 py-3" />
        <input name="city" placeholder="City" className="border border-ink/15 bg-paper px-4 py-3" />
      </div>
      <textarea
        name="message"
        required
        rows={5}
        placeholder="Tell us the quantity, size, and delivery location"
        className="w-full border border-ink/15 bg-paper px-4 py-3"
      />
      <button
        disabled={status === "saving"}
        className="bg-terracotta px-6 py-3 text-sm text-cream hover:bg-terracotta-dark disabled:opacity-60"
      >
        {status === "saving" ? "Sending..." : "Send Enquiry"}
      </button>
      {status === "done" ? (
        <p className="text-sm text-ink-soft">Thank you. We will get back to you shortly.</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-terracotta">Could not send the enquiry. Please try again.</p>
      ) : null}
    </form>
  );
}
