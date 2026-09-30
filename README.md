# Abdul Momen, personal site

Next.js site with a built-in CMS (Payload). Everything on the site, from the headline and portrait to projects, notes, photos, clients and people, is edited at `/admin`.

## Run it

```bash
npm install
cp .env.example .env      # set PAYLOAD_SECRET
npm run dev               # site at http://localhost:3000, CMS at http://localhost:3000/admin
```

The first visit to `/admin` asks you to create your login. On first start the CMS fills itself with the starting content from `src/content.ts`; after that the CMS is the only place to edit.

## What you can edit

- **Site & Home**: name, email, portrait, social links, headline, home About text, Approach steps, contact heading.
- **About page**: heading and paragraphs.
- **Projects**: title, subtitle, tags, cover image or video, intro and sections. Tick *Featured* to show a project in the home carousel. *Order* sets the order everywhere.
- **Notes, Photos, Clients, People, Papers, Awards, Playground**: add, edit, reorder or delete.

Saving in the CMS updates the live site straight away.

## Deploy

Any Node host that runs Next.js works (Vercel, Railway, Render, a VPS).

- Set `PAYLOAD_SECRET`.
- Set `DATABASE_URL` to a Postgres database (for example Neon). Tables are created automatically on first start.
- On Vercel, create a Blob store and set `BLOB_READ_WRITE_TOKEN` so uploaded images are kept. Elsewhere, uploads are saved to `media/`.
- Visit `/admin` and create your login.

## Preview build

`npm run preview` exports a single static page with every route inside it, used for the claude.ai preview.
