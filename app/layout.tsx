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
  title: {
    default: "Super Precast | Concrete Jali, Kerb Stones & Pavers",
    template: "%s | Super Precast",
  },
  description:
    "Super Precast, Ankleshwar, Gujarat — concrete jali, kerb stones, paver blocks and precast products since 2015.",
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
