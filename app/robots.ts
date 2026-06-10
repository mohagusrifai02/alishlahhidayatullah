import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/login/",
        "/dashboard/",
      ],
    },
    sitemap: "https://lksa.alishlahtegal.net/sitemap.xml",
  };
}