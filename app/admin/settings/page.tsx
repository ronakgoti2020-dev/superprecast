import { getSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <h1 className="font-display text-4xl">Settings</h1>
      <p className="mt-2 mb-8 text-ink-soft">
        These details appear in the header, footer, contact page, and WhatsApp button.
        Upload a logo and add Instagram or Google Maps links to show them on the site.
      </p>
      <SettingsForm settings={settings} />
    </div>
  );
}
