import type { ArrayField, GlobalConfig } from "payload";
import { refreshSite } from "./revalidate";
import { Chat } from "./chat";
import { pages as start } from "../content";

// Links must be a page on this site (/about) or a full web address.
const link = (v: unknown) => (typeof v !== "string" || !v ? true : /^(\/|https?:\/\/|mailto:)/.test(v) || "Start with / for a page here, or https:// for another site.");

// A group of short text fields, one per key of the starting text, so every label on the site is editable.
const labels = (name: keyof typeof start, label: string, description?: string) =>
  ({
    name,
    label,
    type: "group",
    admin: { description },
    fields: Object.keys(start[name]).map((k) => ({ name: k, type: k === "messagePlaceholder" ? "textarea" : "text" })),
  }) as GlobalConfig["fields"][number];

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
            {
              name: "socials",
              type: "array",
              admin: { description: "Shown as icons in the footer. LinkedIn, GitHub, X, Instagram, YouTube and others get their own logo." },
              fields: [{ type: "row", fields: [{ name: "label", type: "text", required: true, admin: { width: "35%" } }, { name: "href", type: "text", required: true, validate: link, admin: { width: "65%" } }] }],
            },
            {
              type: "row",
              fields: [
                { name: "available", type: "checkbox", label: "Show availability badge", admin: { width: "40%", description: "A small green dot with the text beside it, in the header and on Home." } },
                { name: "availableText", type: "text", label: "Availability text", admin: { width: "60%" } },
              ],
            },
          ],
        },
        {
          label: "Menu & footer",
          fields: [
            {
              name: "menu",
              type: "array",
              labels: { singular: "Link", plural: "Header menu" },
              admin: { description: "Leave empty to use the default menu. Tick \"Under More\" to tuck a link into the More list.", initCollapsed: true },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "label", type: "text", required: true, admin: { width: "35%" } },
                    { name: "href", type: "text", required: true, validate: link, admin: { width: "45%", description: "/about or https://…" } },
                    { name: "more", type: "checkbox", label: "Under More", admin: { width: "20%" } },
                  ],
                },
              ],
            },
            {
              name: "footerLinks",
              type: "array",
              labels: { singular: "Link", plural: "Footer links" },
              admin: { description: "Small links at the bottom right of every page. Your email and the socials above show as icons.", initCollapsed: true },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "label", type: "text", required: true, admin: { width: "50%" } },
                    { name: "href", type: "text", required: true, validate: link, admin: { width: "50%" } },
                  ],
                },
              ],
            },
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
        {
          label: "Home",
          description: "Section titles and labels on the home page. The headline and texts are under Site & Home.",
          fields: [
            {
              name: "home",
              type: "group",
              fields: [
                { type: "row", fields: [{ name: "aboutLink", type: "text", admin: { width: "50%" } }, { name: "approachTitle", type: "text", admin: { width: "50%" } }] },
                { type: "row", fields: [{ name: "workTitle", type: "text", admin: { width: "50%" } }, { name: "seeAllLabel", type: "text", admin: { width: "50%" } }] },
                { type: "row", fields: [{ name: "clientsTitle", type: "text", admin: { width: "50%" } }, { name: "testimonialsTitle", type: "text", admin: { width: "50%" } }] },
                {
                  name: "stats",
                  type: "array",
                  admin: { description: "Numbers counted live from the CMS. Pick what to count and how to label it." },
                  fields: [
                    {
                      type: "row",
                      fields: [
                        { name: "count", type: "select", required: true, options: ["projects", "clients", "people", "notes", "papers", "awards"], admin: { width: "40%" } },
                        { name: "label", type: "text", required: true, admin: { width: "60%" } },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        { label: "Work", fields: [pageText("work", "Work page", [
              { name: "nextLabel", type: "text", defaultValue: "Next project" },
              { name: "clientLabel", type: "text", defaultValue: "Client" },
              { name: "relatedNotesLabel", type: "text", defaultValue: "Writing about this" },
            ])] },
        {
          label: "Notes",
          fields: [
            pageText("notes", "Notes page", [
              { name: "emptyText", type: "textarea", admin: { description: "Shown while there are no notes." } },
              { name: "signupTitle", type: "text" },
              { name: "signupText", type: "textarea" },
              { name: "rssLabel", type: "text", defaultValue: "Subscribe via RSS", admin: { description: "Link to the RSS feed under the signup card." } },
              { type: "row", fields: [{ name: "signupPlaceholder", type: "text", admin: { width: "50%" } }, { name: "signupButton", type: "text", admin: { width: "50%" } }] },
              { name: "signedUpText", type: "text", defaultValue: "Thanks, you're on the list." },
              { name: "allLabel", type: "text", defaultValue: "All notes" },
              { name: "nextLabel", type: "text", defaultValue: "Next note" },
              { name: "relatedLabel", type: "text", defaultValue: "Related work" },
            ]),
          ],
        },
        { label: "Photos", fields: [pageText("photos", "Photos page")] },
        { label: "About", fields: [labels("about", "About page", "Section titles on the About page. The heading and text are under About page.")] },
        { label: "Contact form", fields: [labels("contact", "Contact form", "Write {email} where the sender's address should go.")] },
        { label: "Labels", fields: [labels("labels", "Small labels", "Buttons and badges used across the site.")] },
        {
          label: "Activity",
          fields: [
            pageText("activity", "Activity page", [
              {
                type: "row",
                fields: [
                  { name: "someoneFrom", type: "text", admin: { width: "34%" } },
                  { name: "someone", type: "text", admin: { width: "33%", description: "When the place is unknown." } },
                  { name: "times", type: "text", admin: { width: "33%", description: "As in \"3 times\"." } },
                ],
              },
              {
                type: "row",
                fields: [
                  { name: "thisWeek", type: "text", admin: { width: "50%" } },
                  { name: "earlier", type: "text", admin: { width: "50%" } },
                ],
              },
              {
                type: "row",
                fields: [
                  { name: "likedNote", type: "text", admin: { width: "34%" } },
                  { name: "likedImage", type: "text", admin: { width: "33%" } },
                  { name: "likedVideo", type: "text", admin: { width: "33%" } },
                ],
              },
              {
                type: "row",
                fields: [
                  { name: "highlighted", type: "text", admin: { width: "50%" } },
                  { name: "startedChat", type: "text", admin: { width: "50%" } },
                ],
              },
              { name: "emptyText", type: "text" },
              { name: "sampleText", type: "text", admin: { description: "Shown while sample lines are still in the list." } },
            ]),
          ],
        },
        { label: "Clients", fields: [pageText("clients", "Clients page", [{ name: "visitLabel", type: "text", defaultValue: "Visit" }])] },
        { label: "People", fields: [pageText("people", "People page", [{ name: "projectsLabel", type: "text", defaultValue: "Worked on" }])] },
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

export const globals = [Site, About, Pages, Chat];
