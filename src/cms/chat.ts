import Anthropic from "@anthropic-ai/sdk";
import type { CollectionConfig, Endpoint, GlobalConfig, Payload } from "payload";
import { plainText } from "./notes";
import { refreshSite } from "./revalidate";
import { allow, editorsOnly, ipOf, logActivity, placeOf, publicUnlessHidden, visitorHash } from "./visitors";

const MAX_MESSAGE = 1000;
const MAX_TURNS = 40;

// Everything about the Chat page: greeting, suggested questions, and how the assistant should answer.
export const Chat: GlobalConfig = {
  slug: "chat",
  label: "Chat",
  access: { read: () => true },
  hooks: { afterChange: [refreshSite] },
  admin: { group: "Pages" },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Page",
          fields: [
            { name: "greeting", type: "text", required: true, admin: { description: "First bubble a visitor sees." } },
            { name: "suggestions", type: "array", labels: { singular: "Question", plural: "Suggested questions" }, fields: [{ name: "text", type: "text", required: true }] },
            { name: "placeholder", type: "text" },
            { name: "disclosure", type: "textarea", admin: { description: "Small print under the message box." } },
            { name: "offlineText", type: "textarea", admin: { description: "Shown as the answer when the AI isn't connected (no ANTHROPIC_API_KEY) or in the static preview." } },
            {
              type: "row",
              fields: [
                { name: "conversationsTitle", type: "text", admin: { width: "25%" } },
                { name: "newChatLabel", type: "text", admin: { width: "25%" } },
                { name: "chatLabel", type: "text", admin: { width: "25%" } },
                { name: "mapLabel", type: "text", admin: { width: "25%" } },
              ],
            },
            { name: "showConversations", type: "checkbox", defaultValue: true, admin: { description: "List visitors' past questions in the sidebar and on the map. Hide any single conversation under Inbox → Conversations." } },
          ],
        },
        {
          label: "Answers",
          fields: [
            { name: "instructions", type: "textarea", admin: { description: "How the assistant should answer: voice, length, what to say about pricing or availability." } },
            { name: "facts", type: "textarea", admin: { description: "Extra facts the site doesn't show, e.g. how you like to work, rates, time zone. Everything else on the site is included automatically." } },
          ],
        },
      ],
    },
  ],
};

// Visitors' chats. Created by the Chat page; editors can read, hide or delete them.
export const Conversations: CollectionConfig = {
  slug: "conversations",
  admin: { useAsTitle: "title", group: "Inbox", defaultColumns: ["title", "city", "country", "createdAt"] },
  defaultSort: "-createdAt",
  access: { read: publicUnlessHidden, create: () => false, update: editorsOnly, delete: editorsOnly },
  endpoints: [],
  fields: [
    { name: "title", type: "text", admin: { description: "The visitor's first question." } },
    {
      name: "messages",
      type: "array",
      fields: [
        { name: "role", type: "select", required: true, options: ["visitor", "assistant"] },
        { name: "text", type: "textarea", required: true },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "city", type: "text", admin: { width: "40%" } },
        { name: "region", type: "text", admin: { width: "30%" } },
        { name: "country", type: "text", admin: { width: "30%" } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "lat", type: "number", admin: { width: "50%" } },
        { name: "lon", type: "number", admin: { width: "50%" } },
      ],
    },
    { name: "hidden", type: "checkbox", admin: { position: "sidebar", description: "Remove from the public sidebar and map." } },
    { name: "demo", type: "checkbox", label: "Sample", admin: { position: "sidebar", description: "Sample conversation written to show the layout. Delete before launch." } },
    { name: "visitor", type: "text", access: { read: editorsOnly }, admin: { hidden: true } },
  ],
};

type Doc = Record<string, unknown>;
const s = (v: unknown) => (typeof v === "string" ? v : "");

// The assistant's briefing: the chat instructions plus what the site itself says, read fresh from the CMS.
let cached: { at: number; text: string } | null = null;
async function briefing(payload: Payload) {
  if (cached && Date.now() - cached.at < 60_000) return cached.text;
  const [site, about, chat] = await Promise.all(["site", "about", "chat"].map((slug) => payload.findGlobal({ slug: slug as "site" }))) as unknown as Doc[];
  const list = async (collection: "projects" | "notes" | "clients" | "papers" | "awards" | "playground" | "people") =>
    (await payload.find({ collection, limit: 200, depth: 1, joins: false as never })).docs as unknown as Doc[];
  const [projects, notes, clients, papers, awards, playground] = await Promise.all([list("projects"), list("notes"), list("clients"), list("papers"), list("awards"), list("playground")]);
  const lines = (rows: Doc[], f: (d: Doc) => string) => rows.map((d) => `- ${f(d)}`).join("\n");
  const text = [
    s(chat.instructions),
    `\n# About ${s(site.name)}\nEmail: ${s(site.email)}. Based in ${s(site.city)}.\n${s(site.intro)}\n${s(about.heading)}\n${((about.body as { text: string }[]) ?? []).map((p) => p.text).join("\n")}`,
    `Approach:\n${lines((site.approach as Doc[]) ?? [], (a) => `${s(a.title)}: ${s(a.body)}`)}`,
    s(chat.facts) && `# More facts\n${s(chat.facts)}`,
    `# Projects (page /work/<slug>)\n${projects
      .map((p) => {
        const client = p.client && typeof p.client === "object" ? s((p.client as Doc).name) : "";
        const team = ((p.teamMembers as Doc[]) ?? []).map((m) => (typeof m === "object" ? `${s(m.name)}${m.demo ? " (sample persona)" : ""}` : "")).filter(Boolean);
        const body = ((p.sections as Doc[]) ?? []).map((x) => [s(x.heading), s(x.body)].filter(Boolean).join(": ")).join(" ");
        return `## ${s(p.title)} (slug ${s(p.slug)}, ${s(p.year)})\n${s(p.subtitle)}. ${s(p.intro)}${client ? `\nClient: ${client}.` : ""}${team.length ? `\nTeam: ${team.join(", ")}.` : ""}\nServices: ${((p.services as Doc[]) ?? []).map((x) => s(x.name)).join(", ")}.\n${body}`;
      })
      .join("\n\n")}`,
    `# Notes (page /notes/<slug>)\n${notes.map((n) => `## ${s(n.title)} (slug ${s(n.slug)}, ${s(n.date).slice(0, 10)})\n${plainText(n.body).slice(0, 2500)}`).join("\n\n")}`,
    `# Clients\n${lines(clients, (c) => `${s(c.name)}: ${s(c.note)}`)}`,
    `# Research\n${lines(papers, (p) => `${s(p.title)}, ${s(p.venue)} ${s(p.year)} ${s(p.status)}`)}`,
    `# Recognition\n${lines(awards, (a) => `${s(a.title)}, ${s(a.where)} ${s(a.year)}`)}`,
    `# Side projects\n${lines(playground, (p) => `${s(p.title)}: ${s(p.body)} ${s(p.href)}`)}`,
  ]
    .filter(Boolean)
    .join("\n\n");
  cached = { at: Date.now(), text };
  return text;
}

const reply = (text: string, id: string | number) =>
  new Response(text, { headers: { "content-type": "text/plain; charset=utf-8", "x-conversation-id": String(id), "cache-control": "no-store" } });

// POST /api/conversations/send  { id?, message, visitor }
// Saves the visitor's message, streams the answer back as plain text, then saves the answer.
export const send: Endpoint = {
  path: "/send",
  method: "post",
  handler: async (req) => {
    const body = (await req.json?.().catch(() => ({}))) as { id?: string | number; message?: string; visitor?: string };
    const message = (body.message ?? "").trim().slice(0, MAX_MESSAGE);
    const visitor = visitorHash(body.visitor);
    if (!message) return Response.json({ error: "Please write a message." }, { status: 400 });
    if (!visitor) return Response.json({ error: "Missing visitor id." }, { status: 400 });
    if (!allow(`chat:${ipOf(req)}`, 20, 10 * 60_000)) return Response.json({ error: "That's a lot of questions. Please wait a few minutes." }, { status: 429 });

    const { payload } = req;
    let convo: Doc | null = null;
    if (body.id) {
      convo = (await payload.findByID({ collection: "conversations", id: body.id, depth: 0, overrideAccess: true }).catch(() => null)) as Doc | null;
      if (!convo || convo.visitor !== visitor) return Response.json({ error: "You can only continue your own chats." }, { status: 403 });
    }
    const history = ((convo?.messages as { role: string; text: string }[]) ?? []).map(({ role, text }) => ({ role, text }));
    if (history.length >= MAX_TURNS) return Response.json({ error: "This chat is full. Start a new one." }, { status: 400 });
    history.push({ role: "visitor", text: message });

    const save = (messages: typeof history) =>
      payload.update({ collection: "conversations", id: convo!.id as number, data: { messages } as never, depth: 0, context: { skipRefresh: true } });
    if (!convo) {
      const place = placeOf(req);
      convo = (await payload.create({
        collection: "conversations",
        data: { title: message.slice(0, 140), messages: history, visitor, ...place } as never,
        depth: 0,
        context: { skipRefresh: true },
      })) as unknown as Doc;
      await logActivity(payload, req, visitor, { kind: "chat", target: "chat", title: message.slice(0, 140), href: `/chat?c=${convo.id}` });
    } else await save(history);

    const chat = (await payload.findGlobal({ slug: "chat" })) as unknown as Doc;
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) {
      const text = s(chat.offlineText) || "Chat isn't connected yet.";
      await save([...history, { role: "assistant", text }]);
      return reply(text, convo.id as number);
    }

    const client = new Anthropic({ apiKey: key });
    const stream = client.messages.stream({
      model: process.env.CHAT_MODEL || "claude-sonnet-5-5",
      max_tokens: 700,
      system: await briefing(payload),
      messages: history.map((m) => ({ role: m.role === "visitor" ? ("user" as const) : ("assistant" as const), content: m.text })),
    });
    const id = convo.id as number;
    const encoder = new TextEncoder();
    let answer = "";
    const body$ = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              answer += event.delta.text;
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } catch (err) {
          payload.logger.error({ err }, "Chat answer failed");
          if (!answer) {
            answer = s(chat.offlineText) || "Sorry, something went wrong. Please try again.";
            controller.enqueue(encoder.encode(answer));
          }
        }
        await save([...history, { role: "assistant", text: answer.trim() }]).catch(() => null);
        controller.close();
      },
      cancel() {
        stream.abort();
      },
    });
    return new Response(body$, { headers: { "content-type": "text/plain; charset=utf-8", "x-conversation-id": String(id), "cache-control": "no-store" } });
  },
};
Conversations.endpoints = [send];
