import type { Payload } from "payload";
import * as c from "../content";
import { startNotes } from "../notes-content";
import { chat, sampleActivity, sampleConversations } from "../visitors-content";
import { toLexical } from "./lexical";

type Row = Record<string, unknown> & { id: number | string };
type StartProject = (typeof c.projects)[number];
const devices = ["phone", "laptop", "tablet"] as const;

// Bump when the starting content gains something existing databases should receive once.
const CONTENT_VERSION = 5;

// Gallery for a section: the media written in content.ts, or one full-width placeholder.
const gallery = (s: StartProject["sections"][number]) =>
  (s.gallery ?? [{ cover: s.cover, width: "full" as const }]).map((g) => ({ ...g, source: g.source ?? (g.url ? "url" : "placeholder") }));
const sections = (p: StartProject) => p.sections.map((s) => ({ heading: s.heading, body: s.body, gallery: gallery(s) }));
const team = (p: StartProject, people: Row[]) =>
  p.people ? p.people.map((n) => people.find((x) => x.name === n)?.id).filter(Boolean) : p.team === "Oikko AI" ? people.filter((x) => (x.tags as string[])?.includes("Oikko AI")).map((x) => x.id) : [];

const idOf = (rows: Row[], key: string, value?: string) => (value ? rows.find((r) => r[key] === value)?.id : undefined);
const notes = (projects: Row[]) =>
  startNotes.map(({ projects: slugs = [], ...n }) => ({ ...n, body: toLexical(n.body), projects: slugs.map((x) => idOf(projects, "slug", x)).filter(Boolean) }));
const testimonials = (clients: Row[], projects: Row[]) =>
  c.testimonials.map((t, order) => ({ ...t, client: idOf(clients, "name", t.client), project: idOf(projects, "slug", t.project), demo: true, order }));

// First run: fill an empty CMS with the site's starting content. After that, the CMS is the source of truth.
export async function seed(payload: Payload) {
  const { totalDocs } = await payload.count({ collection: "projects" });
  if (totalDocs > 0) return upgrade(payload);
  payload.logger.info("Seeding CMS with starting content");

  await payload.updateGlobal({
    slug: "site",
    data: {
      name: c.me.name,
      email: c.me.email,
      city: c.me.city,
      socials: c.me.socials,
      tagline: c.me.tagline,
      available: c.me.available,
      availableText: c.me.availableText,
      intro: c.me.intro,
      aboutHeading: c.homeAbout.heading,
      aboutBody: c.homeAbout.body.map((text) => ({ text })),
      approach: c.approach,
      contactHeading: c.contactHeading,
    },
  });
  await payload.updateGlobal({
    slug: "about",
    data: { heading: c.aboutPage.heading, body: c.aboutPage.body.map((text) => ({ text })) },
  });
  await payload.updateGlobal({ slug: "pages", data: { ...c.pages, contentVersion: CONTENT_VERSION } as never });

  const add = async (collection: Parameters<Payload["create"]>[0]["collection"], rows: object[]) => {
    const out: Row[] = [];
    for (const [order, row] of rows.entries()) out.push((await payload.create({ collection, data: { ...row, order } as never })) as unknown as Row);
    return out;
  };
  const people = await add("people", c.people);
  const clients = await add("clients", c.clients);
  const projects = await add(
    "projects",
    c.projects.map((p, i) => ({
      ...p,
      client: idOf(clients, "name", p.client),
      device: p.device ?? devices[i % devices.length],
      teamMembers: team(p, people),
      services: p.services.map((name) => ({ name })),
      sections: sections(p),
    })),
  );
  for (const note of notes(projects)) await payload.create({ collection: "notes", data: note as never });
  for (const t of testimonials(clients, projects)) await payload.create({ collection: "testimonials", data: t as never });
  await visitors(payload);
  await add("papers", c.papers);
  await add("awards", c.awards);
  await add("playground", c.playground);
}

// Chat settings, plus sample activity and conversations so the pages aren't empty before real visitors arrive.
async function visitors(payload: Payload) {
  await payload.updateGlobal({ slug: "chat", data: chat as never });
  if (!(await payload.count({ collection: "activity" })).totalDocs)
    for (const a of sampleActivity) await payload.create({ collection: "activity", data: a as never, context: { skipRefresh: true } });
  if (!(await payload.count({ collection: "conversations" })).totalDocs)
    for (const x of sampleConversations) await payload.create({ collection: "conversations", data: x as never, context: { skipRefresh: true } });
}

// Databases seeded by an earlier version: add what is new, once, without touching anything edited since.
async function upgrade(payload: Payload) {
  const pages = (await payload.findGlobal({ slug: "pages" })) as unknown as { contentVersion?: number; work?: { title?: string } };
  const version = pages.contentVersion ?? (pages.work?.title ? 1 : 0);
  if (version >= CONTENT_VERSION) return;
  payload.logger.info(`Updating CMS starting content from version ${version} to ${CONTENT_VERSION}`);
  const projects = (await payload.find({ collection: "projects", limit: 500, depth: 0 })).docs as unknown as Row[];

  if (version < 1) {
    await payload.updateGlobal({ slug: "pages", data: c.pages as never });
    for (const collection of ["people", "clients"] as const) {
      const start: { name: string; tags: string[] }[] = collection === "people" ? c.people : c.clients;
      for (const row of (await payload.find({ collection, limit: 500 })).docs as unknown as Row[]) {
        const match = start.find((x) => x.name === row.name);
        if (match && !(row.tags as string[] | undefined)?.length) await payload.update({ collection, id: row.id, data: { tags: match.tags } as never });
      }
    }
    for (const project of projects) {
      const i = c.projects.findIndex((x) => x.slug === project.slug);
      const start = c.projects[i];
      if (!start) continue;
      await payload.update({
        collection: "projects",
        id: project.id,
        data: {
          sections: ((project.sections as { heading: string; gallery?: unknown[] }[]) ?? []).map((s) => {
            const match = start.sections.find((x) => x.heading === s.heading);
            return s.gallery?.length || !match ? s : { ...s, gallery: gallery(match) };
          }),
          device: start.device ?? devices[i % devices.length],
          credit: project.credit ?? start.credit,
        } as never,
      });
    }
  }

  if (version < 2) {
    // Personas: add the new people, then give projects without a team their starting team.
    const existing = (await payload.find({ collection: "people", limit: 500 })).docs as unknown as Row[];
    for (const person of c.people) {
      const found = existing.find((x) => x.name === person.name);
      if (!found) existing.push((await payload.create({ collection: "people", data: { ...person, order: existing.length } as never })) as unknown as Row);
      else if (!found.bio && person.bio) await payload.update({ collection: "people", id: found.id, data: { bio: person.bio } as never });
    }
    for (const project of projects) {
      const start = c.projects.find((x) => x.slug === project.slug);
      if (!start) continue;
      const data: Record<string, unknown> = {};
      if (!(project.teamMembers as unknown[] | undefined)?.length) data.teamMembers = team(start, existing);
      // The richer demo case study replaces the one-section original only if nobody has edited it.
      const current = (project.sections as { heading?: string }[]) ?? [];
      if (start.slug === "oikko-marketplace" && current.length <= 1) {
        Object.assign(data, { sections: sections(start), intro: start.intro, credit: start.credit, services: start.services.map((name) => ({ name })), teamMembers: team(start, existing) });
      }
      if (Object.keys(data).length) await payload.update({ collection: "projects", id: project.id, data: data as never });
    }
  }

  if (version < 3) {
    // Notes became full articles: add the demo notes if there are none, and the new Notes page labels.
    const { totalDocs } = await payload.count({ collection: "notes" });
    if (!totalDocs) for (const note of notes(projects)) await payload.create({ collection: "notes", data: note as never });
    const current = (await payload.findGlobal({ slug: "pages" })) as unknown as { notes?: Record<string, unknown> };
    const fill = Object.fromEntries(Object.entries(c.pages.notes).filter(([k]) => !current.notes?.[k]));
    await payload.updateGlobal({ slug: "pages", data: { notes: { ...current.notes, ...fill } } as never });
  }

  if (version < 4) {
    // Relations: projects get their client, notes their related work. Placeholder testimonials, home labels, availability.
    const clients = (await payload.find({ collection: "clients", limit: 500, depth: 0 })).docs as unknown as Row[];
    for (const project of projects) {
      const client = idOf(clients, "name", c.projects.find((x) => x.slug === project.slug)?.client);
      if (client && !project.client) await payload.update({ collection: "projects", id: project.id, data: { client } as never });
    }
    for (const note of (await payload.find({ collection: "notes", limit: 500, depth: 0 })).docs as unknown as Row[]) {
      const slugs = startNotes.find((x) => x.slug === note.slug)?.projects ?? [];
      const ids = slugs.map((x) => idOf(projects, "slug", x)).filter(Boolean);
      if (ids.length && !(note.projects as unknown[] | undefined)?.length) await payload.update({ collection: "notes", id: note.id, data: { projects: ids } as never });
    }
    const { totalDocs } = await payload.count({ collection: "testimonials" });
    if (!totalDocs) for (const t of testimonials(clients, projects)) await payload.create({ collection: "testimonials", data: t as never });
    const current = (await payload.findGlobal({ slug: "pages" })) as unknown as Record<string, Record<string, unknown> | undefined>;
    const data: Record<string, unknown> = {};
    for (const key of ["home", "work", "notes", "clients", "people"] as const) {
      const start = c.pages[key] as Record<string, unknown>;
      const fill = Object.fromEntries(Object.entries(start).filter(([k, v]) => !(Array.isArray(v) ? (current[key]?.[k] as unknown[] | undefined)?.length : current[key]?.[k])));
      data[key] = { ...current[key], ...fill };
    }
    await payload.updateGlobal({ slug: "pages", data: data as never });
    const site = (await payload.findGlobal({ slug: "site" })) as unknown as { availableText?: string };
    if (!site.availableText) await payload.updateGlobal({ slug: "site", data: { available: c.me.available, availableText: c.me.availableText } as never });
  }

  if (version < 5) {
    // Activity and Chat pages.
    const current = (await payload.findGlobal({ slug: "pages" })) as unknown as Record<string, Record<string, unknown> | undefined>;
    await payload.updateGlobal({ slug: "pages", data: { activity: { ...c.pages.activity, ...Object.fromEntries(Object.entries(current.activity ?? {}).filter(([, v]) => v)) } } as never });
    const settings = (await payload.findGlobal({ slug: "chat" })) as unknown as { greeting?: string };
    if (!settings.greeting) await visitors(payload);
  }

  await payload.updateGlobal({ slug: "pages", data: { contentVersion: CONTENT_VERSION } as never });
}
