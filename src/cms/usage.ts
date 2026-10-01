import type { CollectionConfig, Field, Payload } from "payload";
import { editorsOnly } from "./visitors";

// Claude API list prices in USD per million tokens. Cache reads and writes are billed separately.
export const models = {
  "claude-opus-5-5": { label: "Claude Opus 5.5 (best answers, $4 in / $20 out per 1M tokens)", input: 4, output: 20, cacheRead: 0.2 },
  "claude-sonnet-5-5": { label: "Claude Sonnet 5.5 (balanced, $2 in / $10 out per 1M tokens)", input: 2, output: 10, cacheRead: 0.2 },
  "claude-haiku-4-5": { label: "Claude Haiku 4.5 (cheapest, $1 in / $5 out per 1M tokens)", input: 1, output: 5, cacheRead: 0.1 },
} as const;
export type Model = keyof typeof models;
export const DEFAULT_MODEL: Model = "claude-opus-5-5";

export type Usage = { input_tokens: number; output_tokens: number; cache_read_input_tokens?: number | null; cache_creation_input_tokens?: number | null };

export function costOf(model: Model, u: Usage) {
  const p = models[model];
  const usd = (u.input_tokens * p.input + (u.cache_creation_input_tokens ?? 0) * p.input * 1.25 + (u.cache_read_input_tokens ?? 0) * p.cacheRead + u.output_tokens * p.output) / 1e6;
  return Math.round(usd * 1e6) / 1e6;
}

const monthOf = (d = new Date()) => d.toISOString().slice(0, 7);

const n = (name: string, label: string, width = "25%"): Field => ({ name, label, type: "number", defaultValue: 0, admin: { width, readOnly: true } });

// One row per calendar month: what the chat assistant has cost. Written by the chat endpoint only.
export const ChatUsage: CollectionConfig = {
  slug: "chat-usage",
  labels: { singular: "AI usage month", plural: "AI usage" },
  admin: {
    useAsTitle: "month",
    group: "Inbox",
    defaultColumns: ["month", "answers", "cost", "inputTokens", "outputTokens"],
    description: "What the chat assistant has cost, per month. The monthly budget and credit are set under Pages → Chat → AI & billing.",
  },
  defaultSort: "-month",
  access: { read: editorsOnly, create: () => false, update: () => false, delete: editorsOnly },
  fields: [
    { name: "month", type: "text", required: true, unique: true, index: true, admin: { readOnly: true, description: "YYYY-MM" } },
    { type: "row", fields: [n("answers", "Answers"), n("cost", "Cost (USD)"), n("inputTokens", "Input tokens"), n("outputTokens", "Output tokens")] },
    { type: "row", fields: [n("cacheReadTokens", "Cached reads", "50%"), n("cacheWriteTokens", "Cache writes", "50%")] },
  ],
};

type Row = { id: number | string; answers?: number; cost?: number; inputTokens?: number; outputTokens?: number; cacheReadTokens?: number; cacheWriteTokens?: number };

export async function spent(payload: Payload) {
  const { docs } = await payload.find({ collection: "chat-usage", limit: 600, depth: 0, pagination: false, overrideAccess: true });
  const rows = docs as unknown as (Row & { month: string })[];
  const month = rows.find((r) => r.month === monthOf())?.cost ?? 0;
  const total = rows.reduce((t, r) => t + (r.cost ?? 0), 0);
  return { month, total };
}

export async function record(payload: Payload, u: Usage, cost: number, retry = true): Promise<void> {
  const month = monthOf();
  const { docs } = await payload.find({ collection: "chat-usage", where: { month: { equals: month } }, limit: 1, depth: 0, overrideAccess: true });
  const row = docs[0] as unknown as Row | undefined;
  const add = {
    answers: (row?.answers ?? 0) + 1,
    cost: Math.round(((row?.cost ?? 0) + cost) * 1e6) / 1e6,
    inputTokens: (row?.inputTokens ?? 0) + u.input_tokens,
    outputTokens: (row?.outputTokens ?? 0) + u.output_tokens,
    cacheReadTokens: (row?.cacheReadTokens ?? 0) + (u.cache_read_input_tokens ?? 0),
    cacheWriteTokens: (row?.cacheWriteTokens ?? 0) + (u.cache_creation_input_tokens ?? 0),
  };
  if (row) await payload.update({ collection: "chat-usage", id: row.id, data: add as never, depth: 0, overrideAccess: true });
  else
    await payload
      .create({ collection: "chat-usage", data: { month, ...add } as never, depth: 0, overrideAccess: true })
      // Two answers finishing at once in a new month: the second one adds to the row the first created.
      .catch((err) => (retry ? record(payload, u, cost, false) : payload.logger.error({ err }, "Couldn't record chat usage")));
}
