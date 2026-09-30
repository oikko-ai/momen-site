import type { ArrayField, GlobalConfig } from "payload";
import { refreshSite } from "./revalidate";

const paragraphs = (name: string, label: string): ArrayField => ({
  name,
  label,
  type: "array",
  labels: { singular: "Paragraph", plural: "Paragraphs" },
  fields: [{ name: "text", type: "textarea", required: true }],
});

export const Site: GlobalConfig = {
  slug: "site",
  label: "Site & Home",
  access: { read: () => true },
  hooks: { afterChange: [refreshSite] },
  admin: { group: "Pages" },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "You",
          fields: [
            { name: "name", type: "text", required: true },
            { name: "email", type: "email", required: true },
            { name: "city", type: "text" },
            { name: "portrait", type: "upload", relationTo: "media", admin: { description: "Shown on Home and About." } },
            { name: "socials", type: "array", fields: [{ name: "label", type: "text", required: true }, { name: "href", type: "text", required: true }] },
          ],
        },
        {
          label: "Home",
          fields: [
            { name: "tagline", type: "textarea", required: true, admin: { description: "The big headline at the top." } },
            { name: "intro", type: "textarea", admin: { description: "Used as the site description for search and sharing." } },
            { name: "aboutHeading", type: "textarea" },
            paragraphs("aboutBody", "About text"),
            { name: "approach", type: "array", fields: [{ name: "title", type: "text", required: true }, { name: "body", type: "textarea", required: true }] },
            { name: "contactHeading", type: "textarea", admin: { description: "Use a new line to break the heading." } },
          ],
        },
      ],
    },
  ],
};

export const About: GlobalConfig = {
  slug: "about",
  label: "About page",
  access: { read: () => true },
  hooks: { afterChange: [refreshSite] },
  admin: { group: "Pages" },
  fields: [{ name: "heading", type: "textarea", required: true }, paragraphs("body", "Text")],
};

const pageText = (name: string, label: string, extra: GlobalConfig["fields"] = []) =>
  ({
    name,
    label,
    type: "group",
    fields: [{ name: "title", type: "text", required: true }, { name: "intro", type: "textarea" }, ...extra],
  }) as GlobalConfig["fields"][number];

// Titles and intro text for every other page, so nothing on the site is hard-coded.
export const Pages: GlobalConfig = {
  slug: "pages",
  label: "Other pages",
  access: { read: () => true },
  hooks: { afterChange: [refreshSite] },
  admin: { group: "Pages" },
  fields: [
    { name: "contentVersion", type: "number", admin: { hidden: true } },
    {
      type: "tabs",
      tabs: [
        { label: "Work", fields: [pageText("work", "Work page", [{ name: "nextLabel", type: "text", defaultValue: "Next project" }])] },
        {
          label: "Notes",
          fields: [
            pageText("notes", "Notes page", [
              { name: "emptyText", type: "textarea", admin: { description: "Shown while there are no notes." } },
              { name: "signupTitle", type: "text" },
              { name: "signupText", type: "textarea" },
            ]),
          ],
        },
        { label: "Photos", fields: [pageText("photos", "Photos page")] },
        { label: "Clients", fields: [pageText("clients", "Clients page")] },
        { label: "People", fields: [pageText("people", "People page")] },
        {
          label: "Colophon",
          fields: [
            pageText("colophon", "Colophon page", [
              { name: "rows", type: "array", fields: [{ name: "label", type: "text", required: true }, { name: "value", type: "text", required: true }] },
            ]),
          ],
        },
      ],
    },
  ],
};

export const globals = [Site, About, Pages];
