import Anthropic from "@anthropic-ai/sdk";
import type { CollectionConfig, Endpoint, GlobalConfig, Payload } from "payload";
import { plainText } from "./notes";
import { refreshSite } from "./revalidate";
import { seoField } from "./seo";
import { costOf, DEFAULT_MODEL, models, record, spent, type Model, type Usage } from "./usage";
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
            seoField(),
            { name: "showConversations", type: "checkbox", defaultValue: true, admin: { description: "List visitors' past questions in the sidebar and on the map. Hide any single conversation under Inbox → Conversations." } },
          ],
        },
        {
          label: "AI & billing",
          description: "Which Claude model answers, and how much it may spend. Costs are tracked under Inbox → AI usage. When a limit is reached, visitors see the offline text with your email instead.",
          fields: [
            {
              name: "ai",
              type: "group",
              label: false,
              access: { read: editorsOnly },
              fields: [
                { name: "enabled", type: "checkbox", label: "Answer with AI", defaultValue: true, admin: { description: "Off: every question gets the offline text, and nothing is spent." } },
                {
                  type: "row",
                  fields: [
                    { name: "model", type: "select", defaultValue: DEFAULT_MODEL, required: true, options: Object.entries(models).map(([value, m]) => ({ value, label: m.label })), admin: { width: "60%" } },
                    {
                      name: "effort",
                      type: "select",
                      defaultValue: "low",
                      required: true,
                      options: [
                        { value: "low", label: "Low (fast, cheapest)" },
                        { value: "medium", label: "Medium" },
                        { value: "high", label: "High (slower, costs more)" },
                      ],
                      admin: { width: "40%", description: "How much the model thinks before answering. Not used by Haiku." },
                    },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    { name: "maxTokens", type: "number", label: "Longest answer (tokens)", defaultValue: 1200, min: 200, max: 8000, required: true, admin: { width: "33%", description: "About 0.75 words per token, thinking included." } },
                    { name: "monthlyBudget", type: "number", label: "Monthly budget (USD)", defaultValue: 20, min: 0, admin: { width: "33%", description: "Chat stops answering with AI once this month's cost reaches it. Empty means no monthly cap." } },
                    { name: "credit", type: "number", label: "Credit (USD)", min: 0, admin: { width: "33%", description: "Optional. Total you've set aside for the chat, across all months. Empty means unlimited." } },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    { name: "dailyPerVisitor", type: "number", label: "Questions per visitor per day", defaultValue: 30, min: 1, required: true, admin: { width: "33%" } },
                    { name: "limitText", type: "textarea", label: "Daily limit reached text", admin: { width: "67%" } },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    { name: "spentThisMonth", type: "number", label: "Spent this month (USD)", virtual: true, admin: { readOnly: true, width: "33%" }, hooks: { afterRead: [async ({ req }) => (req.user ? (await spent(req.payload)).month : undefined)] } },
                    { name: "spentTotal", type: "number", label: "Spent in total (USD)", virtual: true, admin: { readOnly: true, width: "33%" }, hooks: { afterRead: [async ({ req }) => (req.user ? (await spent(req.payload)).total : undefined)] } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Answers",
          fields: [
            { name: "instructions", type: "textarea", access: { read: editorsOnly }, admin: { description: "How the assistant should answer: voice, length, what to say about pricing or availability." } },
            { name: "facts", type: "textarea", access: { read: editorsOnly }, admin: { description: "Extra facts the site doesn't show, e.g. how you like to work, rates, time zone. Everything else on the site is included automatically." } },
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
    {
      name: "usage",
      type: "group",
      label: "AI usage",
      access: { read: editorsOnly },
      admin: { position: "sidebar", readOnly: true },
      fields: [
        { name: "model", type: "text" },
        { name: "inputTokens", type: "number", defaultValue: 0 },
        { name: "outputTokens", type: "number", defaultValue: 0 },
        { name: "cost", type: "number", label: "Cost (USD)", defaultValue: 0 },
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
const send: Endpoint = {
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
    const chat = (await payload.findGlobal({ slug: "chat", depth: 0 })) as unknown as Doc;
    const ai = (chat.ai ?? {}) as { enabled?: boolean; model?: Model; effort?: "low" | "medium" | "high"; maxTokens?: number; monthlyBudget?: number | null; credit?: number | null; dailyPerVisitor?: number; limitText?: string };
    let convo: Doc | null = null;
    if (body.id) {
      convo = (await payload.findByID({ collection: "conversations", id: body.id, depth: 0, overrideAccess: true }).catch(() => null)) as Doc | null;
      if (!convo || convo.visitor !== visitor) return Response.json({ error: "You can only continue your own chats." }, { status: 403 });
    }
    const history = ((convo?.messages as { role: string; text: string }[]) ?? []).map(({ role, text }) => ({ role, text }));
    if (history.length >= MAX_TURNS) return Response.json({ error: "This chat is full. Start a new one." }, { status: 400 });

    // Questions this visitor asked in chats started during the last day.
    const { docs: recent } = await payload.find({
      collection: "conversations",
      where: { and: [{ visitor: { equals: visitor } }, { createdAt: { greater_than: new Date(Date.now() - 86_400_000).toISOString() } }] },
      limit: 100,
      depth: 0,
      overrideAccess: true,
    });
    const asked = recent.reduce((t, c) => t + (((c as unknown as Doc).messages as { role: string }[]) ?? []).filter((m) => m.role === "visitor").length, 0);
    if (asked >= (ai.dailyPerVisitor ?? 30))
      return Response.json({ error: s(ai.limitText) || "You've reached today's question limit. Please email me instead." }, { status: 429 });

    history.push({ role: "visitor", text: message });
    const save = (messages: typeof history, usage?: Doc) =>
      payload.update({ collection: "conversations", id: convo!.id as number, data: { messages, ...(usage && { usage }) } as never, depth: 0, context: { skipRefresh: true } });
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
    const id = convo.id as number;
    const offline = s(chat.offlineText) || "Chat isn't connected yet.";

    // No key, switched off, or over budget: answer with the offline text, which points to email.
    const key = process.env.ANTHROPIC_API_KEY;
    const cost = await spent(payload);
    const over = (ai.monthlyBudget != null && cost.month >= ai.monthlyBudget) || (ai.credit != null && cost.total >= ai.credit);
    if (!key || ai.enabled === false || over) {
      if (over) payload.logger.warn("Chat budget reached; answering with the offline text.");
      await save([...history, { role: "assistant", text: offline }]);
      return reply(offline, id);
    }

    const model: Model = ai.model && ai.model in models ? ai.model : DEFAULT_MODEL;
    const client = new Anthropic({ apiKey: key });
    const stream = client.messages.stream({
      model,
      max_tokens: ai.maxTokens ?? 1200,
      ...(model !== "claude-haiku-4-5" && { output_config: { effort: ai.effort ?? "low" } }),
      // The briefing is the same for every visitor, so it is cached and later questions cost far less.
      system: [{ type: "text", text: await briefing(payload), cache_control: { type: "ephemeral" } }],
      messages: history.map((m) => ({ role: m.role === "visitor" ? ("user" as const) : ("assistant" as const), content: m.text })),
    });
    const prior = (convo.usage ?? {}) as { inputTokens?: number; outputTokens?: number; cost?: number };
    const encoder = new TextEncoder();
    let answer = "";
    const body$ = new ReadableStream<Uint8Array>({
      async start(controller) {
        let usage: Doc | undefined;
        try {
          for await (const event of stream) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              answer += event.delta.text;
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          const final = await stream.finalMessage();
          const u = final.usage as Usage;
          const usd = costOf(model, u);
          await record(payload, u, usd);
          usage = {
            model,
            inputTokens: (prior.inputTokens ?? 0) + u.input_tokens + (u.cache_read_input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0),
            outputTokens: (prior.outputTokens ?? 0) + u.output_tokens,
            cost: Math.round(((prior.cost ?? 0) + usd) * 1e6) / 1e6,
          };
        } catch (err) {
          payload.logger.error({ err }, "Chat answer failed");
        }
        // Nothing came back (an error, or the model declined): fall back to the offline text.
        if (!answer.trim()) {
          answer = offline;
          controller.enqueue(encoder.encode(answer));
        }
        await save([...history, { role: "assistant", text: answer.trim() }], usage).catch(() => null);
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
