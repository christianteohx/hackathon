import { MetadataRoute } from "next";

// Replace YOUR_VERCEL_URL with your actual production URL (e.g., https://your-app.vercel.app)
const BASE_URL = "https://YOUR_VERCEL_URL";

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date().toISOString().split("T")[0];

  return [
    {
      url: BASE_URL,
      lastmod: today,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/vote`,
      lastmod: today,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/submit`,
      lastmod: today,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/leaderboard`,
      lastmod: today,
      changeFrequency: "hourly",
      priority: 0.7,
    },
  ];
}
