// app/sitemap.ts
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://lksa.alishlahtegal.net";

  const res = await fetch(`${baseUrl}/api/news`, {
    cache: "no-store",
  });

  const news = await res.json();

  const newsUrls = news.map((item: any) => ({
    url: `${baseUrl}/kegiatan/${item._id}`, // atau item.id / item.slug
    lastModified: item.updatedAt
      ? new Date(item.updatedAt)
      : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

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
    ...newsUrls,
  ];
}