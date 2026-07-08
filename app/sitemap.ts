import type { MetadataRoute } from "next";

const siteUrl = "https://www.soleilpourtous.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/mentions-legales`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/politique-confidentialite`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
