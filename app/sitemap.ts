import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://superprecastindia.com/" },
    { url: "https://superprecastindia.com/products" },
    { url: "https://superprecastindia.com/about" },
    { url: "https://superprecastindia.com/contact" },
    { url: "https://superprecastindia.com/work" },
  ];
}
