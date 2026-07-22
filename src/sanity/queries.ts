import { groq } from "next-sanity";

export const ALL_POSTS_QUERY = groq`
  *[_type == "post" && publishedAt <= now()] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    category,
    author,
    publishedAt
  }
`;

export const POST_BY_SLUG_QUERY = groq`
  *[_type == "post" && slug.current == $slug && publishedAt <= now()][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    body,
    coverImage,
    category,
    author,
    publishedAt
  }
`;

export const ALL_POST_SLUGS_QUERY = groq`
  *[_type == "post" && publishedAt <= now()] { "slug": slug.current }
`;

export const RELATED_POSTS_QUERY = groq`
  *[_type == "post" && slug.current != $slug && publishedAt <= now()] | order(publishedAt desc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    category,
    publishedAt
  }
`;

export const SITEMAP_POSTS_QUERY = groq`
  *[_type == "post" && publishedAt <= now()] {
    "slug": slug.current,
    publishedAt,
    _updatedAt
  }
`;

export const FEED_POSTS_QUERY = groq`
  *[_type == "post" && publishedAt <= now()] | order(publishedAt desc) [0...50] {
    title,
    "slug": slug.current,
    excerpt,
    category,
    author,
    publishedAt,
    _updatedAt
  }
`;
