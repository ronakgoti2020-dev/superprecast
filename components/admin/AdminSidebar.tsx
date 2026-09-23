"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, Tags, Images, MessageSquare, Settings, LogOut } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/work", label: "Our Work", icon: Images },
  { href: "/admin/inquiries", label: "Enquiries", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ logo = "/logo.png" }: { logo?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-full flex-col bg-ink text-cream md:min-h-screen md:w-64">
      <div className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-3">
          <BrandLogo size={40} src={logo} />
          <div>
            <p className="font-display text-2xl leading-none">Super Precast</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gold">Admin</p>
          </div>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const active =
            link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm ${
                active ? "bg-terracotta text-cream" : "text-stone hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 p-4">
        <Link href="/" className="block px-3 py-2 text-sm text-stone hover:text-cream">
          View website
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-stone hover:text-cream"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
