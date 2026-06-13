// app/sitemap.ts
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://lksa.alishlahtegal.net";

  const res = await fetch(`${baseUrl}/api/news`, {
    cache: "no-store",
  });

  const news = await res.json();

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/program`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kegiatan`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...news.map((item: any) => ({
      url: `${baseUrl}/kegiatan/${item.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ];
}