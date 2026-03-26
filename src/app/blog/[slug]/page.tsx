import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { sanityClient } from "@/sanity/client";
import {
  POST_BY_SLUG_QUERY,
  ALL_POST_SLUGS_QUERY,
} from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { PortableTextRenderer } from "@/components/blog/PortableTextRenderer";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const sanityPosts: any[] = await sanityClient.fetch(ALL_POST_SLUGS_QUERY);
  return sanityPosts.map((p: any) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post: any = await sanityClient.fetch(POST_BY_SLUG_QUERY, { slug });

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post: any = await sanityClient.fetch(POST_BY_SLUG_QUERY, { slug });

  if (!post) notFound();

  return (
    <>
      {/* Cover Image */}
      {post.coverImage?.asset && (
        <div className="relative h-64 w-full sm:h-80 lg:h-96">
          <Image
            src={urlFor(post.coverImage)
              .width(1600)
              .height(600)
              .auto("format")
              .url()}
            alt={post.coverImage.alt || post.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-midnight/50" />
        </div>
      )}

      {/* Article Header */}
      <section
        className={`bg-midnight py-16 sm:py-20 ${post.coverImage?.asset ? "-mt-32 relative z-10 pt-40 sm:pt-44" : ""}`}
      >
        <Container className="max-w-3xl">
          <Badge>{post.category}</Badge>

          <h1 className="mt-4 text-3xl font-bold text-soft-white sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <div className="mt-6 flex items-center gap-4 text-sm text-soft-white/60">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="text-soft-white/30">|</span>
            <span>{post.author}</span>
          </div>
        </Container>
      </section>

      {/* Article Body */}
      <section className="bg-soft-white py-12 sm:py-16">
        <Container className="max-w-3xl">
          <article>
            <PortableTextRenderer value={post.body} />
          </article>
        </Container>
      </section>

      <CTABanner
        variant="dark"
        title="Need Help Implementing These Strategies?"
        subtitle="Our team specialises in hospitality marketing. Let&#8217;s build a plan for your property."
      />
    </>
  );
}
