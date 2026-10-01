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

Step-by-step guide for Vercel, Neon Postgres and Vercel Blob: [docs/DEPLOY.md](docs/DEPLOY.md).

In short, set these environment variables, deploy, then visit `/admin` to create your login:

| Variable | Needed | What it is |
|---|---|---|
| `PAYLOAD_SECRET` | Yes | Long random string that signs CMS logins |
| `DATABASE_URL` | Yes | Postgres connection string, for example from Neon |
| `BLOB_READ_WRITE_TOKEN` | Yes on Vercel | Keeps uploaded images |
| `ANTHROPIC_API_KEY` | For AI chat | From console.anthropic.com |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Your domain, for the sitemap, RSS and share links |

## Where visitor data goes

- **Inbox → Messages**: the contact form.
- **Writing → Subscribers**: note signups.
- **Inbox → Conversations**: every chat, with its cost.
- **Inbox → Activity**: likes, highlights and new chats, shown on `/activity`.
- **Inbox → AI usage**: chat cost per month.

Locations come from Vercel's request headers (city and country only, no IP addresses). Tick *Hidden* on anything you don't want shown publicly.

## Chat and billing

Under **Pages → Chat → AI & billing** you choose the Claude model, how hard it thinks, the longest answer, a monthly budget in USD, an optional total credit, and how many questions one visitor can ask per day. Each answer's tokens and cost are saved on its conversation and added to that month under **Inbox → AI usage**. Once the month's spend reaches the budget, or total spend reaches the credit, the chat answers with the offline text, which points visitors to your email. Without `ANTHROPIC_API_KEY` it does the same.

## Preview build

`npm run preview` exports a single static page with every route inside it, used for the claude.ai preview.
