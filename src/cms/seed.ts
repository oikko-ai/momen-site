import type { Payload } from "payload";
import * as c from "../content";
import { startNotes } from "../notes-content";
import { toLexical } from "./lexical";

type Row = Record<string, unknown> & { id: number | string };
type StartProject = (typeof c.projects)[number];
const devices = ["phone", "laptop", "tablet"] as const;

// Bump when the starting content gains something existing databases should receive once.
const CONTENT_VERSION = 3;

// Gallery for a section: the media written in content.ts, or one full-width placeholder.
const gallery = (s: StartProject["sections"][number]) =>
  (s.gallery ?? [{ cover: s.cover, width: "full" as const }]).map((g) => ({ ...g, source: g.source ?? (g.url ? "url" : "placeholder") }));
const sections = (p: StartProject) => p.sections.map((s) => ({ heading: s.heading, body: s.body, gallery: gallery(s) }));
const team = (p: StartProject, people: Row[]) =>
  p.people ? p.people.map((n) => people.find((x) => x.name === n)?.id).filter(Boolean) : p.team === "Oikko AI" ? people.filter((x) => (x.tags as string[])?.includes("Oikko AI")).map((x) => x.id) : [];

const notes = () => startNotes.map((n) => ({ ...n, body: toLexical(n.body) }));

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
  await add(
    "projects",
    c.projects.map((p, i) => ({
      ...p,
      device: p.device ?? devices[i % devices.length],
      teamMembers: team(p, people),
      services: p.services.map((name) => ({ name })),
      sections: sections(p),
    })),
  );
  for (const note of notes()) await payload.create({ collection: "notes", data: note as never });
  await add("clients", c.clients);
  await add("papers", c.papers);
  await add("awards", c.awards);
  await add("playground", c.playground);
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
    if (!totalDocs) for (const note of notes()) await payload.create({ collection: "notes", data: note as never });
    const current = (await payload.findGlobal({ slug: "pages" })) as unknown as { notes?: Record<string, unknown> };
    const fill = Object.fromEntries(Object.entries(c.pages.notes).filter(([k]) => !current.notes?.[k]));
    await payload.updateGlobal({ slug: "pages", data: { notes: { ...current.notes, ...fill } } as never });
  }

  await payload.updateGlobal({ slug: "pages", data: { contentVersion: CONTENT_VERSION } as never });
}
