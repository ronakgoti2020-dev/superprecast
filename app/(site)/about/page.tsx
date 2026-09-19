import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-xs uppercase tracking-[0.28em] text-terracotta">About us</p>
      <h1 className="mt-3 max-w-3xl font-display text-5xl leading-tight">
        Welcome to Super Precast, where innovation meets elevation.
      </h1>
      <div className="mt-8 max-w-3xl space-y-6 text-base leading-8 text-ink-soft">
        <p>
          We are dedicated to crafting high-quality elevation blocks that elevate
          both architectural standards and creativity. Our commitment to precision
          engineering and sustainable materials ensures each block not only
          enhances structural integrity but also inspires limitless design
          possibilities. Join us in building a future where every elevation tells
          a story of craftsmanship and vision.
        </p>
        <p>
          We are a leading manufacturer and supplier of high-quality precast and
          construction materials, including elevation jali, paver blocks,
          curbstones, cover blocks, grass pavers, cement ventilation windows, and
          customized precast solutions. Our products are designed to offer
          durability, aesthetic appeal, and functionality, catering to a wide
          range of residential, commercial, and industrial applications.
        </p>
        <p>
          With a focus on quality, customization, and sustainability, we provide
          reliable and cost-effective solutions that meet the diverse needs of
          our clients, ensuring both structural integrity and visual excellence
          in every project.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {[
          ["Nature of business", "Retailer, factory / manufacturing"],
          ["Legal status", "Proprietorship"],
          ["Team", "Upto 10 people"],
          ["GST", "24AOXPL2270G1ZQ"],
          ["GST registration", "2017"],
          ["Owner", "Minaben Pravinbhai Luvani"],
        ].map(([label, value]) => (
          <div key={label} className="border border-ink/10 bg-paper p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-gold">{label}</p>
            <p className="mt-3 font-display text-2xl">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl">Why customers work with us</h2>
          <ul className="mt-6 space-y-3 text-ink-soft">
            <li>Wide range of durable and high-quality precast concrete products</li>
            <li>Focus on strength, design, and long-lasting performance</li>
            <li>Competitive pricing with timely delivery</li>
            <li>Customer-centric approach and reliable service</li>
            <li>Experienced team ensuring consistent quality standards</li>
          </ul>
        </div>
        <div className="bg-ink p-8 text-cream">
          <h2 className="font-display text-3xl">Based in Ankleshwar</h2>
          <p className="mt-4 text-sm leading-7 text-stone">
            Super Precast operates from Ankleshwar, Bharuch, Gujarat 393002. We
            supply jali, kerbs, pavers, and cover blocks for elevation work,
            landscaping, roads, and RCC construction.
          </p>
          <Link href="/contact" className="mt-6 inline-block bg-terracotta px-5 py-3 text-sm">
            Talk to us
          </Link>
        </div>
      </div>
    </main>
  );
}
