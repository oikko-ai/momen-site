import type { CollectionConfig } from "payload";
import { coverOptions } from "./options";
import { refreshHooks } from "./revalidate";

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
  upload: { mimeTypes: ["image/*", "video/*"] },
  fields: [{ name: "alt", type: "text", label: "Alt text" }],
};

export const Projects: CollectionConfig = {
  slug: "projects",
  hooks: refreshHooks,
  access: publicRead,
  admin: { useAsTitle: "title", defaultColumns: ["title", "subtitle", "year", "featured"], group: "Work" },
  defaultSort: "order",
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
                { name: "year", type: "text", admin: { width: "20%" } },
                { name: "team", type: "text", admin: { width: "60%" } },
          ],
        },
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
            { name: "teamMembers", type: "relationship", relationTo: "people", hasMany: true, admin: { description: "Shown as avatars next to Team." } },
            { name: "services", type: "array", labels: { singular: "Service", plural: "Services" }, fields: [{ name: "name", type: "text", required: true }] },
            {
              name: "sections",
              type: "array",
          fields: [
                { name: "heading", type: "text", required: true },
                { name: "body", type: "textarea", required: true },
                {
                  name: "gallery",
                  type: "array",
                  labels: { singular: "Image", plural: "Images" },
                  admin: { description: "Images for this section. Two half-width images sit side by side." },
                  fields: [
                    { name: "image", type: "upload", relationTo: "media" },
                    { name: "cover", type: "select", options: coverOptions, defaultValue: "graph", admin: { description: "Animated placeholder when there is no image." } },
                    { name: "caption", type: "text" },
                    { name: "width", type: "select", defaultValue: "full", options: ["full", "half"] },
                  ],
                },
          ],
        },
          ],
        },
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

export const Notes = simple("notes", "Writing", "title", [
  { name: "title", type: "text", required: true },
  { name: "year", type: "text", required: true },
  { name: "href", type: "text", label: "Link", required: true },
]);

export const Photos = simple("photos", "Library", "caption", [
  { name: "image", type: "upload", relationTo: "media", required: true },
  { name: "caption", type: "text" },
]);

export const Clients = simple("clients", "People", "name", [
  { name: "name", type: "text", required: true },
  { name: "note", type: "text", label: "Short description" },
  { name: "tags", type: "text", hasMany: true, admin: { description: "Filters on the Clients page are built from these." } },
  { name: "href", type: "text", label: "Link" },
]);

export const People = simple("people", "People", "name", [
  { name: "name", type: "text", required: true },
  { name: "role", type: "text" },
  { name: "tags", type: "text", hasMany: true, admin: { description: "Filters on the People page are built from these." } },
  { name: "href", type: "text", label: "Link" },
  { name: "avatar", type: "upload", relationTo: "media" },
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

export const collections = [Projects, Notes, Photos, Clients, People, Papers, Awards, Playground, Media, Users];
