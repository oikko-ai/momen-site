import type { Block, CollectionConfig, Endpoint } from "payload";
import { BlocksFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { refreshHooks } from "./revalidate";
import { allow, ipOf, logActivity, visitorHash } from "./visitors";

// An image or video placed inside a note, uploaded or linked.
const NoteMedia: Block = {
  slug: "noteMedia",
  labels: { singular: "Image or video", plural: "Images and videos" },
  fields: [
    {
      type: "row",
      fields: [
        { name: "source", type: "select", defaultValue: "upload", options: [{ label: "Upload", value: "upload" }, { label: "Link (URL)", value: "url" }], admin: { width: "50%" } },
        { name: "size", type: "select", defaultValue: "text", options: [{ label: "Text width", value: "text" }, { label: "Wide", value: "wide" }], admin: { width: "50%" } },
      ],
    },
    { name: "image", type: "upload", relationTo: "media", admin: { condition: (_, s) => s?.source !== "url" } },
    { name: "url", type: "text", admin: { condition: (_, s) => s?.source === "url", description: "Image or video address. .mp4/.webm play as video; YouTube and Vimeo links are embedded." } },
    { name: "caption", type: "text" },
  ],
};

// Plain text of a rich text body, paragraph by paragraph. Used to check reader highlights against the note.
export const plainText = (node: unknown): string => {
  const n = node as { text?: string; children?: unknown[]; root?: unknown; type?: string };
  if (n?.root) return plainText(n.root);
  if (typeof n?.text === "string") return n.text;
  const inner = (n?.children ?? []).map(plainText).join("");
  return ["paragraph", "heading", "quote", "listitem"].includes(n?.type ?? "") ? inner + "\n" : inner;
};

type Highlight = { text: string; count?: number; id?: string };

// Public reactions from readers: likes, views and highlighted passages. Counts are stored on the note.
const react: Endpoint = {
  path: "/:id/react",
  method: "post",
  handler: async (req) => {
    const id = req.routeParams?.id as string;
    const body = (await req.json?.().catch(() => ({}))) as { kind?: string; text?: string; visitor?: string };
    if (!allow(`react:${ipOf(req)}`, 120, 10 * 60_000)) return Response.json({ error: "Slow down" }, { status: 429 });
    const note = (await req.payload.findByID({ collection: "notes", id, depth: 0 }).catch(() => null)) as unknown as Record<string, unknown> | null;
    if (!note) return Response.json({ error: "Not found" }, { status: 404 });
    const data: Record<string, unknown> = {};
    const n = (k: string) => (typeof note[k] === "number" ? (note[k] as number) : 0);
    if (body.kind === "like") data.likes = n("likes") + 1;
    else if (body.kind === "unlike") data.likes = Math.max(0, n("likes") - 1);
    else if (body.kind === "view") data.views = n("views") + 1;
    else if (body.kind === "highlight") {
      const text = (body.text ?? "").replace(/\s+/g, " ").trim();
      // Only passages that really appear in one paragraph of the note, so nothing else can be posted.
      const paragraphs = plainText(note.body).split("\n").map((p) => p.replace(/\s+/g, " "));
      if (text.length < 3 || text.length > 400 || !paragraphs.some((p) => p.includes(text))) return Response.json({ error: "Not in this note" }, { status: 400 });
      const list = ((note.highlights as Highlight[]) ?? []).map(({ text, count }) => ({ text, count: count ?? 1 }));
      const hit = list.find((h) => h.text === text);
      if (hit) hit.count += 1;
      else list.push({ text, count: 1 });
      data.highlights = list.slice(-200);
    } else return Response.json({ error: "Unknown reaction" }, { status: 400 });
    const saved = (await req.payload.update({ collection: "notes", id, data, depth: 0, context: { skipRefresh: true } })) as unknown as Record<string, unknown>;
    if (body.kind === "like" || body.kind === "highlight")
      await logActivity(req.payload, req, visitorHash(body.visitor), {
        kind: body.kind,
        target: "note",
        title: String(note.title ?? ""),
        href: `/notes/${String(note.slug ?? "")}`,
        quote: body.kind === "highlight" ? (body.text ?? "").replace(/\s+/g, " ").trim() : undefined,
      });
    return Response.json({ likes: saved.likes ?? 0, views: saved.views ?? 0, highlights: saved.highlights ?? [] });
  },
};

export const Notes: CollectionConfig = {
  slug: "notes",
  hooks: refreshHooks,
  access: { read: () => true },
  admin: { useAsTitle: "title", group: "Writing", defaultColumns: ["title", "date", "likes", "views"] },
  defaultSort: "-date",
  endpoints: [react],
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, admin: { description: "Used in the address, e.g. /notes/evals-before-features" } },
    { name: "date", type: "date", required: true, admin: { date: { pickerAppearance: "dayOnly", displayFormat: "MMMM d, yyyy" } } },
    { name: "summary", type: "textarea", admin: { description: "One or two sentences for link previews and search engines." } },
    { name: "href", type: "text", label: "External link", admin: { description: "Optional. If set, the Notes list links to this address instead of the note page." } },
    { name: "cover", type: "upload", relationTo: "media", admin: { description: "Optional image shown under the title." } },
    { name: "projects", type: "relationship", relationTo: "projects", hasMany: true, label: "Related work", admin: { description: "Projects this note is about, shown as cards at the end of the note." } },
    {
      name: "body",
      type: "richText",
      editor: lexicalEditor({ features: ({ defaultFeatures }) => [...defaultFeatures, BlocksFeature({ blocks: [NoteMedia] })] }),
      admin: { description: "Headings, quotes, lists, links, images and videos. Use the + menu or type / to add blocks." },
    },
    {
      name: "highlights",
      type: "array",
      labels: { singular: "Highlight", plural: "Highlights" },
      admin: { description: "Passages readers highlighted, shown as dotted underlines. Readers add to this list; you can edit or remove any." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "text", type: "textarea", required: true, admin: { width: "80%" } },
            { name: "count", type: "number", defaultValue: 1, admin: { width: "20%" } },
          ],
        },
      ],
    },
    { name: "likes", type: "number", defaultValue: 0, admin: { position: "sidebar", description: "Readers' likes. Updated by the site." } },
    { name: "views", type: "number", defaultValue: 0, admin: { position: "sidebar", description: "Page views. Updated by the site." } },
    { name: "year", type: "text", admin: { hidden: true } },
  ],
};

// Email addresses from the "Get new notes by email" forms.
export const Subscribers: CollectionConfig = {
  slug: "subscribers",
  admin: { useAsTitle: "email", group: "Writing", defaultColumns: ["email", "createdAt"] },
  access: { create: () => true },
  fields: [{ name: "email", type: "email", required: true, unique: true }],
};
