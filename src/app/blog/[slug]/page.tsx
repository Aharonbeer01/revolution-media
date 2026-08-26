import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityClient } from "@/sanity/client";
import {
  POST_BY_SLUG_QUERY,
  ALL_POST_SLUGS_QUERY,
  RELATED_POSTS_QUERY,
} from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { PortableTextRenderer } from "@/components/blog/PortableTextRenderer";
import { PreferredSourceButton } from "@/components/seo/PreferredSourceButton";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { categorySlugForName } from "@/lib/blog-categories";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const revalidate = 3600;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

/** Extract the plain text of a Portable Text block. */
function blockText(block: any): string {
  if (!block?.children) return "";
  return block.children
    .map((child: any) => child?.text ?? "")
    .join("")
    .trim();
}

/**
 * Build FAQPage JSON-LD by parsing a post body's "Frequently Asked Questions"
 * section: an H2 heading followed by H3 (question) + normal (answer) pairs,
 * stopping at the next H2. Returns null if no FAQ section is found.
 */
function buildFaqSchema(body: any[]): Record<string, unknown> | null {
  if (!Array.isArray(body)) return null;

  const startIndex = body.findIndex(
    (block: any) =>
      block?._type === "block" &&
      block?.style === "h2" &&
      /frequently asked questions/i.test(blockText(block)),
  );
  if (startIndex === -1) return null;

  const faqs: { question: string; answer: string }[] = [];
  let current: { question: string; answer: string } | null = null;

  for (let i = startIndex + 1; i < body.length; i++) {
    const block = body[i];
    if (block?._type !== "block") continue;
    if (block.style === "h2") break; // next section

    if (block.style === "h3") {
      if (current && current.answer) faqs.push(current);
      current = { question: blockText(block), answer: "" };
    } else if (current) {
      const text = blockText(block);
      if (text) {
        current.answer = current.answer ? `${current.answer} ${text}` : text;
      }
    }
  }
  if (current && current.answer) faqs.push(current);

  if (faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/**
 * Build ItemList JSON-LD from a "listicle" body section: an H2 heading whose
 * text matches `headingPattern`, followed by numbered H3 items ("1. Name",
 * "2. Name", ...), stopping at the next H2. Returns null if no matching
 * section or items are found. Used for ranked list posts (e.g. best agencies).
 */
function buildItemListSchema(
  body: any[],
  headingPattern: RegExp,
): Record<string, unknown> | null {
  if (!Array.isArray(body)) return null;

  const startIndex = body.findIndex(
    (block: any) =>
      block?._type === "block" &&
      block?.style === "h2" &&
      headingPattern.test(blockText(block)),
  );
  if (startIndex === -1) return null;

  const items: string[] = [];
  for (let i = startIndex + 1; i < body.length; i++) {
    const block = body[i];
    if (block?._type !== "block") continue;
    if (block.style === "h2") break; // next section
    if (block.style === "h3") {
      const text = blockText(block).replace(/^\d+\.\s*/, "").trim();
      if (text) items.push(text);
    }
  }

  if (items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((name, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
    })),
  };
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

  const url = `https://revolutionmedia.agency/blog/${slug}`;
  const ogImage = post.coverImage?.asset
    ? urlFor(post.coverImage).width(1200).height(630).auto("format").url()
    : undefined;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post: any = await sanityClient.fetch(POST_BY_SLUG_QUERY, { slug });

  if (!post) notFound();

  const relatedPosts: any[] = await sanityClient.fetch(RELATED_POSTS_QUERY, {
    slug,
  });

  const categorySlug = categorySlugForName(post.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Revolution Media Agency",
      url: "https://revolutionmedia.agency",
    },
    datePublished: post.publishedAt,
    ...(post._updatedAt && { dateModified: post._updatedAt }),
    url: `https://revolutionmedia.agency/blog/${slug}`,
    ...(post.coverImage?.asset && {
      image: urlFor(post.coverImage).width(1200).height(630).auto("format").url(),
    }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://revolutionmedia.agency",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://revolutionmedia.agency/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://revolutionmedia.agency/blog/${slug}`,
      },
    ],
  };

  const faqSchema = buildFaqSchema(post.body);

  // Ranked-list posts get ItemList JSON-LD from their numbered H3 sections.
  const itemListSchema =
    slug === "best-digital-marketing-agencies-hotels-2026"
      ? buildItemListSchema(post.body, /best hotel marketing agencies/i)
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}

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
          {categorySlug ? (
            <Link
              href={`/blog/category/${categorySlug}`}
              className="inline-block rounded-sm transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <Badge>{post.category}</Badge>
            </Link>
          ) : (
            <Badge>{post.category}</Badge>
          )}

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

          {/* Google Preferred Sources: left-aligned with the post body, with
              clear space above so it does not crowd the content. */}
          <PreferredSourceButton
            label="Get our hotel marketing insights in your Google results"
            className="mt-12 border-t border-midnight/10 pt-8"
          />
        </Container>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-cream py-16 sm:py-20">
          <Container>
            <h2 className="text-2xl font-bold text-midnight sm:text-3xl">
              Related Articles
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
              {relatedPosts.map((related: any) => (
                <Link
                  key={related._id}
                  href={`/blog/${related.slug}`}
                  className="group block overflow-hidden rounded-lg bg-warm-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  {related.coverImage?.asset && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <Image
                        src={urlFor(related.coverImage)
                          .width(600)
                          .height(338)
                          .auto("format")
                          .url()}
                        alt={related.coverImage.alt || related.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}

                  <div className="p-5">
                    <Badge>{related.category}</Badge>

                    <h3 className="mt-3 text-lg font-semibold text-midnight transition-colors duration-200 group-hover:text-gold">
                      {related.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-midnight/60">
                      {related.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <CTABanner
        variant="dark"
        title="Need Help Implementing These Strategies?"
        subtitle="Our team specialises in hospitality marketing. Let&#8217;s build a plan for your property."
      />
    </>
  );
}
