import type { Payload } from "payload";
import * as c from "../content";

type Row = Record<string, unknown> & { id: number | string };
const devices = ["phone", "laptop", "tablet"] as const;

// Gallery for a section: the images written in content.ts, or one full-width placeholder.
const gallery = (s: (typeof c.projects)[number]["sections"][number]) => s.gallery ?? [{ cover: s.cover, width: "full" as const }];

// First run only: fill an empty CMS with the site's starting content. After that, the CMS is the source of truth.
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
  await payload.updateGlobal({ slug: "pages", data: c.pages as never });

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
      teamMembers: p.team === "Oikko AI" ? people.map((x) => x.id) : [],
      services: p.services.map((name) => ({ name })),
      sections: p.sections.map((s) => ({ heading: s.heading, body: s.body, gallery: gallery(s) })),
    })),
  );
  await add("notes", c.notes);
  await add("clients", c.clients);
  await add("papers", c.papers);
  await add("awards", c.awards);
  await add("playground", c.playground);
}

// Databases seeded before the Work page redesign: fill the new fields once, without touching anything edited since.
async function upgrade(payload: Payload) {
  const pages = (await payload.findGlobal({ slug: "pages" })) as unknown as { work?: { title?: string } };
  if (pages.work?.title) return;
  payload.logger.info("Filling new CMS fields with starting content");
  await payload.updateGlobal({ slug: "pages", data: c.pages as never });

  const people = (await payload.find({ collection: "people", limit: 500 })).docs as unknown as Row[];
  for (const person of people) {
    const start = c.people.find((x) => x.name === person.name);
    if (start && !(person.tags as string[] | undefined)?.length) await payload.update({ collection: "people", id: person.id, data: { tags: start.tags } as never });
  }
  const clients = (await payload.find({ collection: "clients", limit: 500 })).docs as unknown as Row[];
  for (const client of clients) {
    const start = c.clients.find((x) => x.name === client.name);
    if (start && !(client.tags as string[] | undefined)?.length) await payload.update({ collection: "clients", id: client.id, data: { tags: start.tags } as never });
  }

  const projects = (await payload.find({ collection: "projects", limit: 500, depth: 0 })).docs as unknown as Row[];
  for (const project of projects) {
    const i = c.projects.findIndex((x) => x.slug === project.slug);
    const start = c.projects[i];
    if (!start) continue;
    const sections = ((project.sections as { heading: string; body: string; gallery?: unknown[] }[]) ?? []).map((s) => {
      const match = start.sections.find((x) => x.heading === s.heading);
      return s.gallery?.length || !match ? s : { ...s, gallery: gallery(match) };
    });
    await payload.update({
      collection: "projects",
      id: project.id,
      data: {
        sections,
        device: start.device ?? devices[i % devices.length],
        credit: project.credit ?? start.credit,
        teamMembers: (project.teamMembers as unknown[] | undefined)?.length ? project.teamMembers : start.team === "Oikko AI" ? people.map((x) => x.id) : [],
      } as never,
    });
  }
}
