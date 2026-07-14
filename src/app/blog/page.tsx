import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/sanity/client";
import { ALL_POSTS_QUERY } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { Hero } from "@/components/sections/Hero";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/motion/FadeIn";

/* eslint-disable @typescript-eslint/no-explicit-any */

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

  const posts = sanityPosts.map((p: any) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.publishedAt,
    author: p.author,
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

      {/* Blog Post Grid */}
      <section className="bg-soft-white py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {posts.map((post: any, index: number) => (
              <FadeIn key={post.slug} delay={index * 0.1}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block overflow-hidden rounded-lg bg-warm-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  {/* Cover Image */}
                  {post.coverImage?.asset && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <Image
                        src={urlFor(post.coverImage)
                          .width(800)
                          .height(450)
                          .auto("format")
                          .url()}
                        alt={post.coverImage.alt || post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <Badge>{post.category}</Badge>

                    <h3 className="mt-4 text-xl font-semibold text-midnight transition-colors duration-200 group-hover:text-gold">
                      {post.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-midnight/60">
                      {post.excerpt}
                    </p>

                    <p className="mt-4 text-xs text-midnight/40">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
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
