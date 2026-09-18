import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.28em] text-terracotta">404</p>
      <h1 className="mt-3 font-display text-5xl">Page not found</h1>
      <p className="mt-4 text-ink-soft">The page you are looking for is not in this catalogue.</p>
      <Link href="/" className="mt-8 inline-block bg-ink px-5 py-3 text-sm text-cream">
        Back to home
      </Link>
    </main>
  );
}
