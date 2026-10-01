import type { CollectionConfig, Endpoint } from "payload";

const recent = new Map<string, number[]>();
const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The contact form posts here. Bots fill the hidden "company" field and are quietly dropped;
// each address may send a few messages per ten minutes.
const send: Endpoint = {
  path: "/send",
  method: "post",
  handler: async (req) => {
    const body = (await req.json?.().catch(() => ({}))) as Record<string, unknown>;
    const text = (k: string, max: number) => (typeof body[k] === "string" ? (body[k] as string).trim().slice(0, max) : "");
    if (text("company", 200)) return Response.json({ ok: true });
    const from = text("email", 200);
    const message = text("message", 5000);
    if (!email.test(from)) return Response.json({ error: "Please add an email address I can reply to." }, { status: 400 });
    if (message.length < 2) return Response.json({ error: "Please write a short message." }, { status: 400 });

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
    const now = Date.now();
    const times = (recent.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
    if (times.length >= 5) return Response.json({ error: "Too many messages. Please try again later or send an email." }, { status: 429 });
    recent.set(ip, [...times, now]);

    await req.payload.create({ collection: "messages", data: { name: text("name", 200), email: from, subject: text("subject", 300), message } });
    return Response.json({ ok: true });
  },
};

// Messages sent from the contact form on Home. Only signed-in editors can read them.
export const Messages: CollectionConfig = {
  slug: "messages",
  labels: { singular: "Message", plural: "Messages" },
  admin: { useAsTitle: "subject", group: "Inbox", defaultColumns: ["subject", "email", "read", "createdAt"] },
  defaultSort: "-createdAt",
  access: { create: () => false },
  endpoints: [send],
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", admin: { width: "50%" } },
        { name: "email", type: "email", required: true, admin: { width: "50%" } },
      ],
    },
    { name: "subject", type: "text" },
    { name: "message", type: "textarea", required: true },
    { name: "read", type: "checkbox", admin: { position: "sidebar", description: "Tick once you've replied." } },
  ],
};
