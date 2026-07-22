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
    comparisonTable: ({ value }: any) => {
      const headers: string[] = value?.headers || [];
      const rows: { cells?: string[] }[] = value?.rows || [];
      if (headers.length === 0 || rows.length === 0) return null;
      // Cells written as "[Label](https://url)" render as a link; plain text
      // renders as-is.
      const renderCell = (cell: string) => {
        const match = /^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/.exec(cell || "");
        if (!match) return cell;
        return (
          <a
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline underline-offset-2 hover:text-gold-deep"
          >
            {match[1]}
          </a>
        );
      };
      return (
        <figure className="my-8 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            {value.caption && (
              <caption className="mb-3 text-left text-sm text-midnight/50">
                {value.caption}
              </caption>
            )}
            <thead>
              <tr className="border-b-2 border-gold">
                {headers.map((header, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="p-3 font-semibold text-gold-deep"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={r} className="border-b border-midnight/10">
                  {(row.cells || []).map((cell, c) => (
                    <td
                      key={c}
                      className={
                        c === 0
                          ? "p-3 font-semibold text-midnight"
                          : "p-3 text-midnight/80"
                      }
                    >
                      {renderCell(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
