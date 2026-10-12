import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import Script from "next/script";
import { MotionConfig } from "framer-motion";
import { HashScrollFix } from "@/components/hash-scroll-fix";
import { SITE_URL } from "@/lib/site-config";
import "./globals.css";

const META_PIXEL_ID = "4598836663731046";
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

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

const siteUrl = SITE_URL;
const title = "Soleil Pour Tous — Découvrez les aides pour votre logement";
const description =
  "Rénovation énergétique, chauffage, isolation, solaire, adaptation du logement : découvrez en 1 minute les aides auxquelles vous pourriez avoir droit. Vérification gratuite, sans engagement.";

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
    "aides rénovation énergétique",
    "MaPrimeRénov",
    "MaPrimeAdapt",
    "pompe à chaleur",
    "isolation thermique",
    "panneaux solaires",
    "photovoltaïque",
    "aides solaire",
    "adaptation logement",
    "CEE",
    "certificats d'économies d'énergie",
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
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
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
        {/* Google Analytics 4 — n'est injecté que si NEXT_PUBLIC_GA4_ID est
            défini (voir README) ; le site fonctionne normalement sans. */}
        {GA4_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA4_ID}');`}
            </Script>
          </>
        )}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');`}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
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
