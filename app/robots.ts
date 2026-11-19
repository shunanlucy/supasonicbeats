import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/auth/", "/api/paper-trading"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/shorts_banner/", "/images/", "/channel_avatar.jpg", "/channel_banner.jpg"],
      },
    ],
    sitemap: "https://supasonicbeats.com/sitemap.xml",
  };
}
