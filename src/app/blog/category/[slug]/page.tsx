import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityClient } from "@/sanity/client";
import { POSTS_BY_CATEGORY_QUERY } from "@/sanity/queries";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { PostCard, type PostCardData } from "@/components/blog/PostCard";
import { blogCategories, getCategoryBySlug } from "@/lib/blog-categories";
import { SITE_URL } from "@/lib/constants";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const revalidate = 3600;

export function generateStaticParams() {
  return blogCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};

  const url = `${SITE_URL}/blog/category/${category.slug}`;
  const title = `${category.name} for Hotels | Revolution Media Blog`;

  return {
    title,
    description: category.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: category.metaDescription,
      url,
      type: "website",
    },
  };
}

// Split an intro into three parts around the pillar phrase, so that phrase can
// be rendered as the first internal link on the page.
function renderIntro(intro: string, phrase: string, href: string) {
  const idx = intro.indexOf(phrase);
  if (idx === -1) {
    // Phrase not found: render plain text rather than break the page.
    return <>{intro}</>;
  }
  const before = intro.slice(0, idx);
  const after = intro.slice(idx + phrase.length);
  return (
    <>
      {before}
      <Link href={href} className="text-gold underline hover:text-gold-deep">
        {phrase}
      </Link>
      {after}
    </>
  );
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const sanityPosts: any[] = await sanityClient.fetch(POSTS_BY_CATEGORY_QUERY, {
    category: category.name,
  });

  const posts: PostCardData[] = sanityPosts.map((p: any) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: p.publishedAt,
    category: p.category,
    coverImage: p.coverImage,
  }));

  const url = `${SITE_URL}/blog/category/${category.slug}`;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} for Hotels`,
    description: category.metaDescription,
    url,
    isPartOf: {
      "@type": "Blog",
      name: "Revolution Media Blog",
      url: `${SITE_URL}/blog`,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/blog/${p.slug}`,
        name: p.title,
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Category header */}
      <section className="bg-midnight py-16 dark-texture sm:py-20">
        <Container className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            <Link href="/blog" className="hover:text-gold-deep">
              Blog
            </Link>
          </p>
          <h1 className="mt-4 text-3xl font-bold text-soft-white sm:text-4xl lg:text-5xl">
            {category.name}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-soft-white/70">
            {renderIntro(
              category.intro,
              category.pillarPhrase,
              `/blog/${category.pillarSlug}`,
            )}
          </p>
        </Container>
      </section>

      {/* Posts grid */}
      <section className="bg-soft-white py-16 sm:py-20">
        <Container>
          <h2 className="sr-only">{category.name} articles</h2>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {posts.map((post, index) => (
                <FadeIn key={post.slug} delay={index * 0.05}>
                  <PostCard post={post} />
                </FadeIn>
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-midnight/50">
              No articles in this category yet. Check back soon.
            </p>
          )}
        </Container>
      </section>

      <CTABanner
        variant="gold"
        title="Ready to Put These Ideas to Work?"
        subtitle="Book a free discovery call and let's build a plan for your property."
      />
    </>
  );
}
