import type { Metadata } from "next";
import { QuoteForm } from "@/components/QuoteForm";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <main className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-2">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-terracotta">Contact</p>
        <h1 className="mt-3 font-display text-5xl">Tell us what you need on site.</h1>
        <p className="mt-5 max-w-lg text-ink-soft leading-8">
          Share product, quantity, and delivery location. Super Precast will
          respond with availability and pricing.
        </p>
        <div className="mt-10 space-y-4 text-sm">
          <p>
            <span className="block text-ink-soft">Address</span>
            {settings.address}
          </p>
          <p>
            <span className="block text-ink-soft">GST</span>
            {settings.gst}
          </p>
          <p>
            <span className="block text-ink-soft">Owner</span>
            {settings.owner}
          </p>
          {settings.phone ? (
            <p>
              <span className="block text-ink-soft">Phone</span>
              {settings.phone}
            </p>
          ) : null}
          {settings.email ? (
            <p>
              <span className="block text-ink-soft">Email</span>
              {settings.email}
            </p>
          ) : null}
        </div>
      </div>
      <div className="border border-ink/10 bg-paper p-8">
        <QuoteForm />
      </div>
    </main>
  );
}
