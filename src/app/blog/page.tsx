import { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog";
import { Hero } from "@/components/sections/Hero";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/motion/FadeIn";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Hospitality marketing insights, strategies, and industry knowledge to help your property compete and drive more direct bookings.",
};

export default function BlogPage() {
  const posts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
            {posts.map((post, index) => (
              <FadeIn key={post.slug} delay={index * 0.1}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block rounded-lg bg-warm-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
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
