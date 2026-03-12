import { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/lib/products";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://scaleprogresix.com";

export default async function sitemap(): Promise<MetadataRoute[]> {
  // Get all product slugs
  const productSlugs = await getAllProductSlugs();

  // Static pages
  const staticPages: MetadataRoute[] = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Product pages
  const productPages: MetadataRoute[] = productSlugs.map((slug) => ({
    url: `${baseUrl}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
