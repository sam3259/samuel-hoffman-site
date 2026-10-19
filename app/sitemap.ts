import type { MetadataRoute } from "next";

import { siteConfig } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, priority: 1 },
    { url: `${siteConfig.url}/about`, priority: 0.6 },
  ];
}
