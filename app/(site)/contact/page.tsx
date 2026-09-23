import type { Metadata } from "next";
import { QuoteForm } from "@/components/QuoteForm";
import { getSettings, instagramHref, mapsHref } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const settings = await getSettings();
  const instagram = instagramHref(settings.instagram);
  const map = mapsHref(settings.mapUrl);

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
            {map ? (
              <a href={map} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
                {settings.address}
              </a>
            ) : (
              settings.address
            )}
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
          {instagram ? (
            <p>
              <span className="block text-ink-soft">Instagram</span>
              <a href={instagram} target="_blank" rel="noreferrer">
                {settings.instagram}
              </a>
            </p>
          ) : null}
          {map ? (
            <p>
              <span className="block text-ink-soft">Google Maps</span>
              <a href={map} target="_blank" rel="noreferrer">
                View location
              </a>
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
