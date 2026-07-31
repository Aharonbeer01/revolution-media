"use client";

import { useState } from "react";
import { FadeIn } from "@/components/motion/FadeIn";
import { PostCard, type PostCardData } from "@/components/blog/PostCard";
import { blogCategories } from "@/lib/blog-categories";

const ALL = "All";

export function BlogFilter({ posts }: { posts: PostCardData[] }) {
  const [active, setActive] = useState<string>(ALL);

  const pills = [ALL, ...blogCategories.map((c) => c.name)];

  const visible =
    active === ALL ? posts : posts.filter((p) => p.category === active);

  return (
    <div>
      {/* Filter pills. Horizontal scroll on mobile, no wrapping. */}
      <div
        className="-mx-4 mb-10 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0"
        role="tablist"
        aria-label="Filter posts by category"
      >
        {pills.map((pill) => {
          const isActive = pill === active;
          return (
            <button
              key={pill}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(pill)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                isActive
                  ? "border-gold bg-gold text-midnight"
                  : "border-midnight/15 bg-warm-white text-midnight/70 hover:border-gold hover:text-midnight"
              }`}
            >
              {pill}
            </button>
          );
        })}
      </div>

      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {visible.map((post, index) => (
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
    </div>
  );
}
