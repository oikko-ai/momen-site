import type { Field } from "payload";

// "Search & sharing" fields: how a page shows in Google, AI answers and link previews.
// Every field is optional; empty ones fall back to the page's own title, intro and a generated share image.
export const seoField = (description = "How this page appears in Google, AI answers and link previews. Leave empty to use the page's own title and intro."): Field => ({
  name: "seo",
  type: "group",
  label: "Search & sharing",
  admin: { description },
  fields: [
    { name: "title", type: "text", maxLength: 70, admin: { description: "Best at 50 to 60 characters. The site name is added after it." } },
    { name: "description", type: "textarea", maxLength: 200, admin: { description: "Best at 120 to 160 characters: a plain summary that answers what this page is about." } },
    {
      type: "row",
      fields: [
        { name: "image", type: "upload", relationTo: "media", admin: { width: "70%", description: "Share image, 1200 × 630. Empty uses a generated one with the title." } },
        { name: "noindex", type: "checkbox", label: "Hide from search engines", admin: { width: "30%" } },
      ],
    },
  ],
});
