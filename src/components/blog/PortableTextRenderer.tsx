import {
  PortableText,
  type PortableTextReactComponents,
} from "@portabletext/react";
import { urlFor } from "@/sanity/image";

/* eslint-disable @typescript-eslint/no-explicit-any */

const components: Partial<PortableTextReactComponents> = {
  block: {
    h2: ({ children }: any) => (
      <h2 className="mt-10 mb-4 text-2xl font-bold text-midnight">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="mt-8 mb-3 text-xl font-semibold text-midnight">
        {children}
      </h3>
    ),
    normal: ({ children }: any) => (
      <p className="mb-4 leading-relaxed text-midnight/80">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="mb-4 list-disc pl-6 text-midnight/80">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="mb-4 list-decimal pl-6 text-midnight/80">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="mb-2 leading-relaxed">{children}</li>
    ),
    number: ({ children }: any) => (
      <li className="mb-2 leading-relaxed">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-semibold text-midnight">{children}</strong>
    ),
    em: ({ children }: any) => <em>{children}</em>,
    link: ({ children, value }: any) => {
      const href = value?.href || "";
      const isExternal = href.startsWith("http");
      return (
        <a
          href={href}
          className="text-gold underline underline-offset-2 hover:text-gold-deep"
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }: any) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <img
            src={urlFor(value).width(800).auto("format").url()}
            alt={value.alt || ""}
            className="w-full rounded-lg"
            loading="lazy"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-midnight/50">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

interface Props {
  value: any[];
}

export function PortableTextRenderer({ value }: Props) {
  return <PortableText value={value} components={components} />;
}
