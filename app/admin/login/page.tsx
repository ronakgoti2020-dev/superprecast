"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.get("username"),
        password: form.get("password"),
      }),
    });
    setLoading(false);
    if (!response.ok) {
      setError("Invalid username or password");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-sand px-5">
      <form onSubmit={onSubmit} className="w-full max-w-md border border-ink/10 bg-paper p-8">
        <BrandLogo size={72} className="mb-4" />
        <p className="text-xs uppercase tracking-[0.22em] text-terracotta">Super Precast</p>
        <h1 className="mt-2 font-display text-4xl">Admin login</h1>
        <p className="mt-2 mb-8 text-sm text-ink-soft">
          Add and manage products, enquiries, and contact details.
        </p>
        <label className="block text-sm text-ink-soft">Username</label>
        <input name="username" required className="admin-input mt-2 mb-4" defaultValue="admin" />
        <label className="block text-sm text-ink-soft">Password</label>
        <input name="password" type="password" required className="admin-input mt-2" />
        {error ? <p className="mt-4 text-sm text-terracotta">{error}</p> : null}
        <button
          disabled={loading}
          className="mt-6 w-full bg-ink py-3 text-sm text-cream disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="mt-4 text-center text-sm">
          <Link href="/" className="text-terracotta">
            Back to website
          </Link>
        </p>
      </form>
    </main>
  );
}
