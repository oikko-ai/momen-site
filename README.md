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
- Optional: set `NEXT_PUBLIC_SITE_URL` to your domain for full links in the notes RSS feed (`/notes/rss.xml`), `/sitemap.xml` and `robots.txt`. Email signups are saved under Writing → Subscribers, and contact form messages under Inbox → Messages.
- Chat: set `ANTHROPIC_API_KEY` (from console.anthropic.com) so the Chat page answers visitors with Claude, using what the CMS says about your work plus the instructions and facts under Pages → Chat. Optional `CHAT_MODEL` picks the model (default `claude-sonnet-5-5`). Without a key, visitors get the "AI not connected" text from the same page and their questions are still saved.
- Visitor data: chats are saved under Inbox → Conversations and likes, highlights and new chats under Inbox → Activity. Locations come from Vercel's request headers (city and country only, no IP addresses). Tick Hidden on anything you don't want shown, and delete the entries marked Sample once real visitors arrive.
- Visit `/admin` and create your login.

## Preview build

`npm run preview` exports a single static page with every route inside it, used for the claude.ai preview.
