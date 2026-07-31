import { Metadata } from "next";
import { sanityClient } from "@/sanity/client";
import { ALL_POSTS_QUERY } from "@/sanity/queries";
import { Hero } from "@/components/sections/Hero";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/ui/Container";
import { BlogFilter } from "@/components/blog/BlogFilter";
import type { PostCardData } from "@/components/blog/PostCard";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Hospitality marketing insights, strategies, and industry knowledge to help your property compete and drive more direct bookings.",
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  const sanityPosts: any[] = await sanityClient.fetch(ALL_POSTS_QUERY);

  const posts: PostCardData[] = sanityPosts.map((p: any) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: p.publishedAt,
    category: p.category,
    coverImage: p.coverImage,
  }));

  return (
    <>
      <Hero
        size="small"
        eyebrow="BLOG"
        title="Insights for Hospitality Marketers"
        subtitle="Practical strategies and industry knowledge to help your property compete."
        primaryCTA={{ label: "Book a Discovery Call", href: "/contact" }}
      />

      {/* Blog Post Grid with category filter */}
      <section className="bg-soft-white py-16 sm:py-20">
        <Container>
          <h2 className="sr-only">Latest Articles</h2>
          <BlogFilter posts={posts} />
        </Container>
      </section>

      <CTABanner
        variant="gold"
        title="Get Expert Hospitality Marketing Advice"
        subtitle="Book a free discovery call and let's discuss how to grow your property's direct bookings."
      />
    </>
  );
}
