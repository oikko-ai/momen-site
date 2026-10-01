import { seoField } from "./seo";
import type { CollectionConfig } from "payload";
import { coverOptions } from "./options";
import { refreshHooks } from "./revalidate";
import { Notes, Subscribers } from "./notes";
import { Messages } from "./messages";
import { Activity, likeMedia } from "./activity";
import { Conversations } from "./chat";
import { ChatUsage } from "./usage";

const publicRead = { read: () => true };
const orderField = { name: "order", type: "number", defaultValue: 0, admin: { position: "sidebar", description: "Lower numbers show first." } } as const;

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: { useAsTitle: "email", group: "Settings" },
  fields: [],
};

export const Media: CollectionConfig = {
  slug: "media",
  hooks: refreshHooks,
  access: publicRead,
  admin: { group: "Library" },
  upload: { mimeTypes: ["image/*", "video/*", "audio/*"] },
  fields: [{ name: "alt", type: "text", label: "Alt text" }],
};

// One image or video on a case study: uploaded or linked, with its size and framing.
const mediaItem: CollectionConfig["fields"] = [
  {
    type: "row",
    fields: [
      { name: "source", type: "select", defaultValue: "upload", options: [{ label: "Upload", value: "upload" }, { label: "Link (URL)", value: "url" }, { label: "Animated placeholder", value: "placeholder" }], admin: { width: "34%" } },
      { name: "width", type: "select", defaultValue: "full", options: [{ label: "Full", value: "full" }, { label: "Two thirds", value: "twoThirds" }, { label: "Half", value: "half" }, { label: "One third", value: "third" }, { label: "Quarter", value: "quarter" }], admin: { width: "33%" } },
      { name: "aspect", type: "select", defaultValue: "16/10", options: ["21/9", "2/1", "16/9", "16/10", "4/3", "1/1", "4/5", "3/4", "9/16"], admin: { width: "33%", description: "Shape of the frame." } },
    ],
  },
  { name: "image", type: "upload", relationTo: "media", admin: { condition: (_, s) => s?.source === "upload", description: "Image or video file." } },
  { name: "url", type: "text", admin: { condition: (_, s) => s?.source === "url", description: "Image or video address. .mp4/.webm play as video; YouTube and Vimeo links are embedded." } },
  { name: "cover", type: "select", options: coverOptions, defaultValue: "graph", admin: { description: "Animated placeholder used when there is no file or link." } },
  {
    type: "row",
    fields: [
      { name: "fit", type: "select", defaultValue: "cover", options: [{ label: "Fill the frame", value: "cover" }, { label: "Show whole image", value: "contain" }], admin: { width: "34%" } },
      { name: "background", type: "select", defaultValue: "none", options: ["none", "dark", "light"], admin: { width: "33%", description: "Panel behind the media." } },
      { name: "frame", type: "select", defaultValue: "none", options: ["none", "browser", "phone"], admin: { width: "33%", description: "Optional device chrome." } },
    ],
  },
  { name: "caption", type: "text" },
  { name: "likes", type: "number", defaultValue: 0, admin: { description: "Starting count on the heart button shown on hover. 0 hides the count." } },
];

export const Projects: CollectionConfig = {
  slug: "projects",
  hooks: refreshHooks,
  access: publicRead,
  admin: { useAsTitle: "title", defaultColumns: ["title", "subtitle", "year", "featured"], group: "Work" },
  defaultSort: "order",
  endpoints: [likeMedia],
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Card",
          description: "How the project appears on the Work page and the home page.",
          fields: [
            { name: "title", type: "text", required: true },
            { name: "slug", type: "text", required: true, unique: true, admin: { description: "Used in the address, e.g. /work/noteai" } },
            { name: "subtitle", type: "text", required: true },
            {
              type: "row",
          fields: [
                { name: "code", type: "text", admin: { width: "20%" } },
                { name: "year", type: "text", label: "Date", admin: { width: "20%", description: "e.g. 2025 or 2024 - 2026" } },
                { name: "team", type: "text", admin: { width: "60%" } },
          ],
        },
        { name: "client", type: "relationship", relationTo: "clients", admin: { description: "Who the work was for. The project then shows on that client's row on the Clients page." } },
        { name: "featured", type: "checkbox", admin: { description: "Show in the big carousel on the home page." } },
        {
          name: "device",
          type: "select",
          defaultValue: "phone",
          options: ["phone", "tablet", "laptop", "none"],
          admin: { description: "Frame shown around the cover on the Work page. \"none\" shows the image edge to edge." },
        },
        { name: "image", type: "upload", relationTo: "media", admin: { description: "Cover image or video. Leave empty to use the animated cover below." } },
        { name: "cover", type: "select", options: coverOptions, defaultValue: "graph", admin: { description: "Animated cover used when there is no image." } },
          ],
        },
        {
          label: "Case study",
          description: "The project's own page: intro, details and sections with images.",
          fields: [
            { name: "intro", type: "textarea", required: true },
            { name: "credit", type: "textarea", admin: { description: "Optional italic note under the intro, e.g. who led the work." } },
            { name: "teamMembers", type: "relationship", relationTo: "people", hasMany: true, admin: { description: "Each person is a persona from People: shown as an avatar with their name, role and link on hover." } },
            { name: "testimonials", type: "join", collection: "testimonials", on: "project", admin: { description: "Quotes about this project, shown under the case study. Add them under People → Testimonials." } },
            { name: "notes", type: "join", collection: "notes", on: "projects", label: "Related notes", admin: { description: "Notes that mention this project. Set them on the note." } },
            { name: "services", type: "array", labels: { singular: "Service", plural: "Services" }, fields: [{ name: "name", type: "text", required: true }] },
            {
              name: "sections",
              type: "array",
              admin: { description: "Blocks of text and media, top to bottom. Leave the heading and text empty for a media-only block, e.g. a hero video." },
              fields: [
                { name: "heading", type: "text" },
                { name: "body", type: "textarea" },
                {
                  name: "gallery",
                  type: "array",
                  label: "Media",
                  labels: { singular: "Image or video", plural: "Images and videos" },
                  admin: { description: "Laid out on a 12-column grid: items fill a row until their widths add up to full." },
                  fields: mediaItem,
                },
              ],
            },
          ],
        },
        { label: "Search & sharing", fields: [seoField("How this case study appears in Google, AI answers and link previews. Empty fields use the title and intro.")] },
      ],
    },
    orderField,
  ],
};

const simple = (slug: string, group: string, title: string, fields: CollectionConfig["fields"]): CollectionConfig => ({
  slug,
  hooks: refreshHooks,
  access: publicRead,
  admin: { useAsTitle: title, group },
  defaultSort: "order",
  fields: [...fields, orderField],
});

export const Photos = simple("photos", "Library", "caption", [
  { name: "image", type: "upload", relationTo: "media", required: true },
  { name: "caption", type: "text" },
]);

export const Clients = simple("clients", "People", "name", [
  { name: "name", type: "text", required: true },
  { name: "note", type: "text", label: "Short description" },
  { name: "tags", type: "text", hasMany: true, admin: { description: "Filters on the Clients page are built from these." } },
  { name: "href", type: "text", label: "Website" },
  { name: "logo", type: "upload", relationTo: "media", admin: { description: "Optional. A light logo on a transparent background, used in the client strip on Home." } },
  { name: "projects", type: "join", collection: "projects", on: "client", admin: { description: "Set on each project's Card tab." } },
]);

export const People = simple("people", "People", "name", [
  { name: "name", type: "text", required: true },
  { name: "role", type: "text" },
  { name: "bio", type: "textarea", admin: { description: "One or two lines, shown on the persona card when someone hovers the avatar on a project." } },
  { name: "tags", type: "text", hasMany: true, admin: { description: "Filters on the People page are built from these." } },
  { name: "href", type: "text", label: "Link", admin: { description: "LinkedIn or personal site. The avatar links here." } },
  { name: "avatar", type: "upload", relationTo: "media", admin: { description: "Square photo. Without one, a coloured monogram is drawn." } },
  { name: "demo", type: "checkbox", admin: { description: "Demo persona written as sample content. Replace or delete before launch." } },
  { name: "projects", type: "join", collection: "projects", on: "teamMembers", admin: { description: "Projects this person is on. Set on each project's team." } },
]);

// Quotes from clients and collaborators, linked to the project and client they are about.
export const Testimonials = simple("testimonials", "People", "name", [
  { name: "quote", type: "textarea", required: true },
  {
    type: "row",
    fields: [
      { name: "name", type: "text", required: true, admin: { width: "50%" } },
      { name: "role", type: "text", admin: { width: "50%", description: "e.g. Head of Product" } },
    ],
  },
  {
    type: "row",
    fields: [
      { name: "client", type: "relationship", relationTo: "clients", admin: { width: "50%" } },
      { name: "project", type: "relationship", relationTo: "projects", admin: { width: "50%", description: "Shows the quote on this case study too." } },
    ],
  },
  { name: "avatar", type: "upload", relationTo: "media", admin: { description: "Square photo. Without one, a coloured monogram is drawn." } },
  { name: "demo", type: "checkbox", label: "Placeholder", admin: { description: "Marks a placeholder quote, shown with a Placeholder badge. Replace it with real words before launch." } },
]);

export const Papers = simple("papers", "About", "title", [
  { name: "title", type: "text", required: true },
  { name: "venue", type: "text" },
  { name: "year", type: "text" },
  { name: "status", type: "text" },
  { name: "href", type: "text", label: "Link" },
  { name: "image", type: "upload", relationTo: "media" },
]);

export const Awards = simple("awards", "About", "title", [
  { name: "title", type: "text", required: true },
  { name: "where", type: "text" },
  { name: "year", type: "text" },
]);

export const Playground = simple("playground", "About", "title", [
  { name: "title", type: "text", required: true },
  { name: "body", type: "text", label: "Description" },
  { name: "href", type: "text", label: "Link" },
]);

export const collections = [Projects, Notes, Subscribers, Messages, Conversations, ChatUsage, Activity, Photos, Clients, People, Testimonials, Papers, Awards, Playground, Media, Users];
