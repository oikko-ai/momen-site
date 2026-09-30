import type { Payload } from "payload";
import * as c from "../content";

// First run only: fill an empty CMS with the site's starting content. After that, the CMS is the source of truth.
export async function seed(payload: Payload) {
  const { totalDocs } = await payload.count({ collection: "projects" });
  if (totalDocs > 0) return;
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

  const add = async (collection: Parameters<Payload["create"]>[0]["collection"], rows: object[]) => {
    for (const [order, row] of rows.entries()) await payload.create({ collection, data: { ...row, order } as never });
  };
  await add(
    "projects",
    c.projects.map((p) => ({ ...p, services: p.services.map((name) => ({ name })) })),
  );
  await add("notes", c.notes);
  await add("clients", c.clients);
  await add("people", c.people);
  await add("papers", c.papers);
  await add("awards", c.awards);
  await add("playground", c.playground);
}
