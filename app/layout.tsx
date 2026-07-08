import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { HashScrollFix } from "@/components/hash-scroll-fix";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = "https://www.soleilpourtous.fr";
const title = "Soleil Pour Tous — Panneaux solaires et aides à la rénovation énergétique";
const description =
  "Testez gratuitement votre éligibilité aux aides pour vos travaux de rénovation énergétique — panneaux solaires, pompe à chaleur, isolation. Étude gratuite, sans engagement.";

export const viewport = {
  themeColor: "#060B17",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Soleil Pour Tous",
  },
  description,
  keywords: [
    "panneaux solaires",
    "photovoltaïque",
    "aides solaire",
    "autoconsommation",
    "énergie renouvelable",
    "économies électricité",
    "pompe à chaleur",
    "isolation thermique",
    "MaPrimeRénov",
  ],
  authors: [{ name: "Soleil Pour Tous" }],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Soleil Pour Tous",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Soleil Pour Tous",
  description,
  url: siteUrl,
  areaServed: "FR",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink focus:shadow-card"
        >
          Aller au contenu principal
        </a>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
        <HashScrollFix />
      </body>
    </html>
  );
}
