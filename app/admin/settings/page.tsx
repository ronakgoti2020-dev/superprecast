import { getSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <h1 className="font-display text-4xl">Settings</h1>
      <p className="mt-2 mb-8 text-ink-soft">
        These details appear in the footer, contact page, and WhatsApp button.
        Instagram and Google Maps links show in the footer once you save them.
      </p>
      <SettingsForm settings={settings} />
    </div>
  );
}
