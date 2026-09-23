import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getSettings, logoSrc } from "@/lib/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <Header logo={logoSrc(settings.logo)} />
      {children}
      <Footer />
      <WhatsAppButton />
    </>
  );
}
