import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/ambassador/dashboard", "/ambassador/profile", "/ambassador/referrals"],
      },
    ],
    sitemap: "https://revolutionmedia.agency/sitemap.xml",
  };
}
