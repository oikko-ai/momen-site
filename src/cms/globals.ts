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

export const globals = [Site, About];
