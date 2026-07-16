import { MetadataRoute } from "next";
import { sanityClient } from "@/sanity/client";
import { SITEMAP_POSTS_QUERY } from "@/sanity/queries";
import { caseStudies } from "@/lib/case-studies";
import { services } from "@/lib/services";

/* eslint-disable @typescript-eslint/no-explicit-any */

const BASE_URL = "https://revolutionmedia.agency";

// Fallback slugs in case Sanity is unreachable
const fallbackBlogSlugs = [
  "5-ways-to-reduce-ota-dependency",
  "google-ads-for-hotels-complete-guide",
  "why-your-hotel-needs-tiktok",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/case-studies`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/packages`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/referral-program`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${BASE_URL}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const caseStudyPages: MetadataRoute.Sitemap = caseStudies.map((cs) => ({
    url: `${BASE_URL}/case-studies/${cs.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Fetch blog posts from Sanity; fall back to hardcoded slugs
  let blogPages: MetadataRoute.Sitemap;
  try {
    const sanityPosts: any[] = await sanityClient.fetch(SITEMAP_POSTS_QUERY);
    if (sanityPosts.length > 0) {
      blogPages = sanityPosts.map((p: any) => ({
        url: `${BASE_URL}/blog/${p.slug}`,
        lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    } else {
      blogPages = fallbackBlogSlugs.map((slug) => ({
        url: `${BASE_URL}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    }
  } catch {
    blogPages = fallbackBlogSlugs.map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  }

  return [...staticPages, ...servicePages, ...caseStudyPages, ...blogPages];
}
