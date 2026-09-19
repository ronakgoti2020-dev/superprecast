import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { BrandLogo } from "@/components/BrandLogo";

export async function Footer() {
  const settings = await getSettings();

  return (
    <footer className="mt-20 border-t border-ink/10 bg-ink text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <BrandLogo size={56} />
            <p className="font-display text-3xl">Super Precast</p>
          </div>
          <p className="mt-4 max-w-md text-sm leading-7 text-stone">
            Where innovation meets elevation. Manufacturer and supplier of
            elevation jali, paver blocks, curbstones, cover blocks, grass pavers,
            and customized precast solutions since 2015.
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
