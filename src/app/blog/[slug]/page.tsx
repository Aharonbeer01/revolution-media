import { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/lib/blog";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      {/* Article Header */}
      <section className="bg-midnight py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Badge>{post.category}</Badge>

          <h1 className="mt-4 text-3xl font-bold text-soft-white sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <div className="mt-6 flex items-center gap-4 text-sm text-soft-white/60">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
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
          <article
            className="
              [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-midnight [&_h1]:mt-8 [&_h1]:mb-4
              [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-midnight [&_h2]:mt-10 [&_h2]:mb-4
              [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-midnight [&_h3]:mt-8 [&_h3]:mb-3
              [&_p]:mb-4 [&_p]:text-midnight/80 [&_p]:leading-relaxed
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:text-midnight/80
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:text-midnight/80
              [&_li]:mb-2 [&_li]:leading-relaxed
              [&_strong]:font-semibold [&_strong]:text-midnight
              [&_a]:text-gold [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-gold-deep
            "
            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
          />
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

/**
 * Simple markdown-to-HTML converter for blog content.
 * Handles headings, paragraphs, and bold text.
 */
function formatContent(content: string): string {
  const lines = content.split("\n");
  let html = "";
  let skipFirstH1 = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Headings
    if (line.startsWith("### ")) {
      html += "<h3>" + line.slice(4) + "</h3>";
      continue;
    }
    if (line.startsWith("## ")) {
      html += "<h2>" + line.slice(3) + "</h2>";
      continue;
    }
    if (line.startsWith("# ")) {
      // Skip the first H1 since we display it in the header
      if (skipFirstH1) {
        skipFirstH1 = false;
        continue;
      }
      html += "<h1>" + line.slice(2) + "</h1>";
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      continue;
    }

    // Process bold text
    const processedLine = line.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );

    // Paragraph
    html += "<p>" + processedLine + "</p>";
  }

  return html;
}
