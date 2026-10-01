// Starting text for the Activity and Chat pages, plus SAMPLE activity and conversations.
// Samples are flagged in the CMS and labelled on the site. Delete them once real visitors arrive.
import { me } from "./content";

export const chat = {
  greeting: "Hi there. Ask me anything about my work.",
  suggestions: ["What do you build?", "Can you help an enterprise team ship AI?", "What is Oikko AI?", "How do you start a new project?"].map((text) => ({ text })),
  placeholder: "Message…",
  disclosure: "Answers are written by AI from what's on this site and can be wrong. Chats are saved and listed here without names, with a rough location.",
  offlineText: `Thanks for asking. AI answers aren't switched on yet, so please email me at ${me.email} and I'll reply myself.`,
  conversationsTitle: "Conversations",
  newChatLabel: "New chat",
  chatLabel: "Chat",
  mapLabel: "Map",
  showConversations: true,
  instructions: `You answer visitors on ${me.name}'s website, speaking as ${me.short} in the first person.
Use only the information below. If it doesn't cover something, such as prices, dates or availability, say so plainly and suggest emailing ${me.email}.
Keep answers short and warm: two to four sentences of plain text, no headings, and a list only if asked.
When a page on this site helps, mention its path, like /work/noteai or /notes.
Never invent clients, numbers, quotes or results. People marked as sample personas are not real; don't describe them as real colleagues.
If someone asks whether they're talking to a person, say you're an AI assistant answering from the site's content, and that ${me.short} reads the chats.`,
  facts: "",
};

const hours = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

export const sampleActivity = [
  { at: 3, kind: "like", target: "note", title: "Evals before features", href: "/notes/evals-before-features", city: "Dhaka", region: "", country: "BD" },
  { at: 9, kind: "like", target: "image", title: "Oikko Marketplace", href: "/work/oikko-marketplace", cover: "market", city: "London", region: "", country: "GB", count: 2 },
  { at: 20, kind: "highlight", target: "note", title: "Why we built Oikko AI together", href: "/notes/why-we-built-oikko-ai-together", city: "Singapore", region: "", country: "SG", quote: "the businesses that keep a country running are often the last to get good software" },
  { at: 30, kind: "chat", target: "chat", title: "What kind of AI work do you take on?", href: "/chat", city: "Toronto", region: "ON", country: "CA" },
  { at: 52, kind: "like", target: "video", title: "Oikko Marketplace", href: "/work/oikko-marketplace", cover: "stream", city: "Berlin", region: "", country: "DE" },
  { at: 75, kind: "like", target: "note", title: "Teaching a model to hear Bengali", href: "/notes/teaching-a-model-to-hear-bengali", city: "Chittagong", region: "", country: "BD", count: 3 },
  { at: 120, kind: "highlight", target: "note", title: "Evals before features", href: "/notes/evals-before-features", city: "San Francisco", region: "CA", country: "US", quote: "A demo proves that something can work once. An eval tells you how often it works" },
  { at: 216, kind: "like", target: "image", title: "Clausis", href: "/work/clausis", cover: "doc", city: "Sydney", region: "NSW", country: "AU" },
  { at: 290, kind: "chat", target: "chat", title: "What is Oikko AI building?", href: "/chat", city: "Dubai", region: "", country: "AE" },
].map(({ at, ...a }) => ({ ...a, count: a.count ?? 1, demo: true, createdAt: hours(at) }));

export const sampleConversations = [
  {
    at: 30,
    city: "Toronto",
    region: "ON",
    country: "CA",
    lat: 43.7,
    lon: -79.4,
    messages: [
      "What kind of AI work do you take on?",
      "Mostly the part between a promising demo and a product people rely on: wiring models into real systems, setting up evals, and keeping cost and speed in check. Meeting assistants, document search and legal drafting with sources are good examples, and you can see them under /work.",
    ],
  },
  {
    at: 290,
    city: "Dubai",
    region: "",
    country: "AE",
    lat: 25.2,
    lon: 55.3,
    messages: [
      "What is Oikko AI building?",
      "Oikko AI is the company I started with four friends. We build software for businesses that usually get it last, starting with a marketplace that helps local manufacturers in Bangladesh find buyers. There's more at /work/oikko-marketplace.",
    ],
  },
  {
    at: 410,
    city: "Singapore",
    region: "",
    country: "SG",
    lat: 1.3,
    lon: 103.8,
    messages: [
      "How do you start a new project?",
      "I start by sitting with the people who will use it, then ship a small working slice instead of a big plan. Evals and cost tracking go in from day one, so we can tell whether each change actually helps.",
    ],
  },
  {
    at: 600,
    city: "London",
    region: "",
    country: "GB",
    lat: 51.5,
    lon: -0.1,
    messages: [
      "Have you worked with enterprise teams?",
      "Yes. With Genuine Technology & Research I built products like NoteAI, a meeting assistant, and Chitra, a platform several products share. If you have something similar in mind, email me and tell me about the team and the timeline.",
    ],
  },
].map(({ at, messages, ...c }) => ({
  ...c,
  title: messages[0],
  messages: messages.map((text, i) => ({ role: i % 2 ? "assistant" : "visitor", text })),
  demo: true,
  createdAt: hours(at),
}));
