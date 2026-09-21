import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://superprecastindia.com"),
  title: {
    default: "Super Precast India | Elevation Jali, Pavers & Precast",
    template: "%s | Super Precast India",
  },
  description:
    "Super Precast, Ankleshwar — where innovation meets elevation. Elevation jali, paver blocks, curbstones, cover blocks, and customized precast since 2015.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${fraunces.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
