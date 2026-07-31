import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import { Badge } from "@/components/ui/Badge";
import { categorySlugForName } from "@/lib/blog-categories";

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface PostCardData {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  coverImage?: any;
}

export function PostCard({ post }: { post: PostCardData }) {
  const categorySlug = categorySlugForName(post.category);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-lg bg-warm-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="block">
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
      </Link>

      <div className="flex flex-1 flex-col p-6">
        {/* Category label links to the category page, so it must sit outside
            the post link to avoid nesting anchors. */}
        {categorySlug ? (
          <Link
            href={`/blog/category/${categorySlug}`}
            className="self-start rounded-sm transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <Badge>{post.category}</Badge>
          </Link>
        ) : (
          <span className="self-start">
            <Badge>{post.category}</Badge>
          </span>
        )}

        <Link href={`/blog/${post.slug}`} className="block">
          <h3 className="mt-4 text-xl font-semibold text-midnight transition-colors duration-200 group-hover:text-gold">
            {post.title}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-midnight/60">
            {post.excerpt}
          </p>

          <p className="mt-4 text-xs text-midnight/40">
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </Link>
      </div>
    </div>
  );
}
