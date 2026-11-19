import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://supasonicbeats.com";
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  // Read shorts banner video IDs
  try {
    const shortsPath = path.join(process.cwd(), "data", "shorts_banner_manifest.json");
    if (fs.existsSync(shortsPath)) {
      const shorts = JSON.parse(fs.readFileSync(shortsPath, "utf-8"));
      shorts.forEach((item: any) => {
        if (item.videoId) {
          routes.push({
            url: `${baseUrl}/watch/${item.videoId}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.9,
          });
        }
      });
    }
  } catch (e) {
    console.warn("Sitemap: Failed to load shorts manifest:", e);
  }

  // Also add primary video IDs
  const knownVideoIds = [
    "87ndOuq346I",
    "wE7QEsQ9IPI",
    "UjthtKkgwWU",
    "rC8QB0BZ9EU",
    "1Mg56Wyc56U",
    "1v5PsqhH95k",
    "1suK9qPK_ds",
    "2JGI6vn2kW8",
    "SQzOlmY413Y",
    "Ossd36BQPzs",
    "pgJIMI4Ihzw",
  ];

  const addedUrls = new Set(routes.map((r) => r.url));

  knownVideoIds.forEach((vidId) => {
    const url = `${baseUrl}/watch/${vidId}`;
    if (!addedUrls.has(url)) {
      addedUrls.add(url);
      routes.push({
        url,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  });

  return routes;
}
