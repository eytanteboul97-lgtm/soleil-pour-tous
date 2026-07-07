import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Soleil Pour Tous — Panneaux solaires et aides à l'installation",
    template: "%s | Soleil Pour Tous",
  },
  description:
    "Testez gratuitement votre éligibilité aux panneaux photovoltaïques et découvrez les aides disponibles selon votre profil. Étude gratuite, sans engagement.",
  keywords: [
    "panneaux solaires",
    "photovoltaïque",
    "aides solaire",
    "autoconsommation",
    "énergie renouvelable",
    "économies électricité",
  ],
  authors: [{ name: "Soleil Pour Tous" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Soleil Pour Tous",
    title: "Soleil Pour Tous — Passez au solaire et réduisez vos factures",
    description:
      "Découvrez en moins de 2 minutes si votre foyer est éligible aux aides disponibles pour l'installation de panneaux photovoltaïques.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soleil Pour Tous — Passez au solaire",
    description:
      "Testez votre éligibilité aux aides photovoltaïques en 2 minutes, étude 100% gratuite.",
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
  description:
    "Accompagnement à l'installation de panneaux photovoltaïques en France : étude d'éligibilité gratuite et information sur les aides disponibles.",
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
      <body>{children}</body>
    </html>
  );
}
