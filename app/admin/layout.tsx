import { AdminShell } from "@/components/admin/AdminShell";
import { getSettings, logoSrc } from "@/lib/settings";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return <AdminShell logo={logoSrc(settings.logo)}>{children}</AdminShell>;
}
