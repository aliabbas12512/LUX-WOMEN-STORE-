import type { Metadata, Viewport } from "next";
import { Amiri, Cormorant_Garamond, IBM_Plex_Sans_Arabic } from "next/font/google";
import { Suspense } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/layout/Toaster";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { CartDrawer } from "@/components/checkout/CartDrawer";
import { SnapPixel } from "@/components/tracking/SnapPixel";
import { ConsentBar } from "@/components/tracking/ConsentBar";
import { AttributionCapture } from "@/components/tracking/AttributionCapture";
import { siteConfig } from "@/config/site";
import { catalogHasSamples } from "@/lib/catalog";
import { t } from "@/i18n/ar";
import "./globals.css";

const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-cormorant",
  display: "swap",
});

const title = `${siteConfig.brand.nameAr} | ${siteConfig.brand.taglineAr}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: title, template: `%s | ${siteConfig.brand.nameAr}` },
  description: siteConfig.brand.descriptionAr,
  applicationName: siteConfig.brand.nameAr,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: siteConfig.brand.nameAr,
    title,
    description: siteConfig.brand.descriptionAr,
  },
  twitter: { card: "summary_large_image", title, description: siteConfig.brand.descriptionAr },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0f0e0c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: siteConfig.brand.nameAr,
    alternateName: siteConfig.brand.nameEn,
    url: siteConfig.url,
    description: siteConfig.brand.descriptionAr,
    currenciesAccepted: "SAR",
    areaServed: "SA",
    ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
    sameAs: Object.values(siteConfig.social).filter(Boolean),
  };

  return (
    <html lang="ar" dir="rtl" className={`${plex.variable} ${amiri.variable} ${cormorant.variable}`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-ivory"
        >
          {t.nav.skipToContent}
        </a>
        {catalogHasSamples() ? (
          <div className="bg-beige px-4 py-1.5 text-center text-[0.7rem] text-muted">{t.common.sampleNotice}</div>
        ) : null}
        <AnnouncementBar />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <CartDrawer />
        <Toaster />
        <WhatsAppFloat />
        <ConsentBar />
        <AttributionCapture />
        <Suspense fallback={null}>
          <SnapPixel />
        </Suspense>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
