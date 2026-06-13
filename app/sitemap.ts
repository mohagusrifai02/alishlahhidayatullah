// app/sitemap.ts
import { MetadataRoute } from "next";
import dbConnect from "@/lib/mongodb";
import { News } from "@/models/News";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://lksa.alishlahtegal.net";

  await dbConnect();
  // Ambil data langsung dari MongoDB
  const allNews = await News.find({}).select('_id updatedAt').lean();

  const newsUrls = allNews.map((item: any) => ({
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