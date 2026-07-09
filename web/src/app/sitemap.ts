import type { MetadataRoute } from "next";
import { docs } from "@/lib/docs";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://solkernal.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/skills", "/run", "/stake", "/submit", "/docs"].map((path) => ({
    url: `${siteUrl}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const docRoutes = docs.map((page) => ({
    url: `${siteUrl}/docs/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...docRoutes];
}
