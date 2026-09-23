"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export function AdminShell({
  children,
  logo,
}: {
  children: React.ReactNode;
  logo: string;
}) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-sand md:flex">
      <AdminSidebar logo={logo} />
      <div className="min-w-0 flex-1 p-6 md:p-10">{children}</div>
    </div>
  );
}
