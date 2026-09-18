import { getSettings } from "@/lib/settings";

export async function WhatsAppButton() {
  const settings = await getSettings();
  if (!settings.whatsapp) return null;
  const number = settings.whatsapp.replace(/\D/g, "");
  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 bg-[#25D366] px-4 py-3 text-sm font-medium text-white shadow-lg"
    >
      WhatsApp
    </a>
  );
}
