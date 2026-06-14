import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/site-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://droptaxi.live";

function routeSlug(from: string, to: string) {
  return `${from}-to-${to}`.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getSiteData();

  const routeEntries: MetadataRoute.Sitemap = data.routes.map((r) => ({
    url: `${SITE_URL}/routes/${routeSlug(r.from, r.to)}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/tours`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/gallery`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...routeEntries,
  ];
}
