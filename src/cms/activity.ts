import type { CollectionConfig, Endpoint } from "payload";
import { coverOptions } from "./options";
import { allow, editorsOnly, ipOf, logActivity, publicUnlessHidden, visitorHash } from "./visitors";

// What readers do on the site: likes, highlights and chats, shown on the Activity page.
// Written by the site itself; editors can hide or delete any line.
export const Activity: CollectionConfig = {
  slug: "activity",
  labels: { singular: "Activity", plural: "Activity" },
  admin: { useAsTitle: "title", group: "Inbox", defaultColumns: ["kind", "title", "city", "country", "count", "createdAt"], description: "Filled in by visitors' likes, highlights and chats. Tick Hidden to remove a line from the Activity page." },
  defaultSort: "-createdAt",
  access: { read: publicUnlessHidden, create: () => false, update: editorsOnly, delete: editorsOnly },
  fields: [
    {
      type: "row",
      fields: [
        { name: "kind", type: "select", required: true, options: ["like", "highlight", "chat"], admin: { width: "33%" } },
        { name: "target", type: "select", required: true, options: ["note", "image", "video", "chat"], admin: { width: "33%" } },
        { name: "count", type: "number", defaultValue: 1, admin: { width: "34%" } },
      ],
    },
    { name: "title", type: "text", admin: { description: "The note or project it happened on." } },
    { name: "href", type: "text" },
    { name: "quote", type: "textarea", admin: { condition: (_, s) => s?.kind === "highlight" } },
    {
      type: "row",
      fields: [
        { name: "thumb", type: "text", admin: { width: "60%", description: "Image or video shown beside the line." } },
        { name: "cover", type: "select", options: coverOptions, admin: { width: "40%", description: "Animated placeholder when there's no image." } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "city", type: "text", admin: { width: "40%" } },
        { name: "region", type: "text", admin: { width: "30%" } },
        { name: "country", type: "text", admin: { width: "30%", description: "Two-letter code" } },
      ],
    },
    { name: "hidden", type: "checkbox", admin: { position: "sidebar" } },
    { name: "demo", type: "checkbox", label: "Sample", admin: { position: "sidebar", description: "Sample line written to show the layout. Delete once real activity arrives." } },
    { name: "visitor", type: "text", access: { read: editorsOnly }, admin: { hidden: true } },
  ],
};

type Item = { source?: string; image?: { url?: string; mimeType?: string } | number | null; url?: string; cover?: string; likes?: number };

// A like on a case study image or video: updates its count and adds a line to Activity.
export const likeMedia: Endpoint = {
  path: "/:id/like",
  method: "post",
  handler: async (req) => {
    const body = (await req.json?.().catch(() => ({}))) as { section?: number; item?: number; on?: boolean; visitor?: string };
    if (!allow(`like:${ipOf(req)}`, 60, 10 * 60_000)) return Response.json({ error: "Slow down" }, { status: 429 });
    const project = (await req.payload.findByID({ collection: "projects", id: req.routeParams?.id as string, depth: 1 }).catch(() => null)) as unknown as {
      id: number;
      slug: string;
      title: string;
      sections?: { gallery?: Item[] }[];
    } | null;
    const sections = project?.sections ?? [];
    const item = sections[body.section ?? -1]?.gallery?.[body.item ?? -1];
    if (!project || !item) return Response.json({ error: "Not found" }, { status: 404 });
    item.likes = Math.max(0, (item.likes ?? 0) + (body.on === false ? -1 : 1));
    // Uploads are sent back as ids so the update keeps them.
    const plain = sections.map((s) => ({ ...s, gallery: s.gallery?.map((g) => ({ ...g, image: g.image && typeof g.image === "object" ? (g.image as { id?: number }).id : g.image })) }));
    await req.payload.update({ collection: "projects", id: project.id, data: { sections: plain } as never, depth: 0, context: { skipRefresh: true } });
    if (body.on !== false) {
      const file = item.source === "url" ? item.url : item.source === "upload" && item.image && typeof item.image === "object" ? item.image.url : undefined;
      const video = /\.(mp4|webm|mov|m4v)(\?|$)/i.test(file ?? "") || (typeof item.image === "object" && !!item.image?.mimeType?.startsWith("video/"));
      await logActivity(req.payload, req, visitorHash(body.visitor), {
        kind: "like",
        target: video ? "video" : "image",
        title: project.title,
        href: `/work/${project.slug}#s${body.section}-${body.item}`,
        thumb: file && !/youtu|vimeo/.test(file) ? file : undefined,
        cover: item.cover,
      });
    }
    return Response.json({ likes: item.likes });
  },
};
