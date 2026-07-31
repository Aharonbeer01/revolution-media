import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (Rule) =>
                      Rule.uri({
                        allowRelative: true,
                        scheme: ["http", "https", "mailto"],
                      }),
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
        {
          type: "object",
          name: "comparisonTable",
          title: "Comparison Table",
          fields: [
            {
              name: "caption",
              type: "string",
              title: "Caption (optional)",
              description:
                "Short description shown above the table and used as its accessible caption.",
            },
            {
              name: "headers",
              type: "array",
              title: "Column Headers",
              of: [{ type: "string" }],
              validation: (Rule) => Rule.required().min(1),
            },
            {
              name: "rows",
              type: "array",
              title: "Rows",
              of: [
                {
                  type: "object",
                  name: "tableRow",
                  title: "Row",
                  fields: [
                    {
                      name: "cells",
                      type: "array",
                      title: "Cells",
                      of: [{ type: "string" }],
                    },
                  ],
                  preview: {
                    select: { cells: "cells" },
                    prepare({ cells }: { cells?: string[] }) {
                      return {
                        title: (cells || []).join(" | ") || "Empty row",
                      };
                    },
                  },
                },
              ],
              validation: (Rule) => Rule.required().min(1),
            },
          ],
          preview: {
            select: { caption: "caption", rows: "rows" },
            prepare({
              caption,
              rows,
            }: {
              caption?: string;
              rows?: unknown[];
            }) {
              return {
                title: caption || "Comparison Table",
                subtitle: `${(rows || []).length} row(s)`,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          {
            title: "Direct Bookings & Revenue",
            value: "Direct Bookings & Revenue",
          },
          { title: "Paid Media & Search", value: "Paid Media & Search" },
          { title: "Social & Content", value: "Social & Content" },
          { title: "Hospitality Tech", value: "Hospitality Tech" },
          { title: "Strategy & Measurement", value: "Strategy & Measurement" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      initialValue: "Revolution Media",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Published Date, New",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "coverImage",
    },
  },
});
