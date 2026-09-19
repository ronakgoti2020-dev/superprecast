import Link from "next/link";
import { getSettings } from "@/lib/settings";

export async function Footer() {
  const settings = await getSettings();

  return (
    <footer className="mt-20 border-t border-ink/10 bg-ink text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl">Super Precast</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-stone">
            Established in 2015 at Bharuch, Gujarat. A trusted proprietorship for
            concrete jali, kerb stones, paver blocks, and precast products for
            residential and commercial projects.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Explore</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-stone">
            <Link href="/products">All Products</Link>
            <Link href="/work">Our Work</Link>
            <Link href="/products?category=concrete-jali">Concrete Jali</Link>
            <Link href="/products?category=concrete-kerb-stone">Kerb Stones</Link>
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Reach Us</p>
          <div className="mt-4 space-y-2 text-sm text-stone">
            <p>{settings.address}</p>
            <p>GST: {settings.gst}</p>
            <p>Owner: {settings.owner}</p>
            {settings.phone ? <p>{settings.phone}</p> : null}
            {settings.email ? <p>{settings.email}</p> : null}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-4 text-center text-xs text-stone">
        © {new Date().getFullYear()} Super Precast. All rights reserved.
      </div>
    </footer>
  );
}
