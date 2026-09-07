import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";
import { AIDES_SLUGS } from "@/lib/aides-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/professionnels`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...AIDES_SLUGS.map((slug) => ({
      url: `${SITE_URL}/aides/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/mentions-legales`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/politique-confidentialite`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
