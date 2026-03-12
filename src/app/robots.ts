import { MetadataRoute } from "next";

export default function robots(): MetadataRoute {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/checkout"],
      },
    ],
    sitemap: "https://scaleprogresix.com/sitemap.xml",
  };
}
