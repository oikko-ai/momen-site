# Deploying the site

The site runs on **Vercel**, keeps its content in a **Neon Postgres** database, and stores uploaded images in **Vercel Blob**. All three have free tiers that are enough to launch. The chat uses the **Claude API**, which is paid per use and capped by the budget you set in the CMS.

Plan on about 30 minutes. You need accounts on GitHub (you already have the repo), Vercel and console.anthropic.com.

## 1. Create the project on Vercel

1. Sign in at vercel.com with GitHub.
2. Click **Add New → Project** and import `oikko-ai/momen-site`. If it isn't listed, click **Adjust GitHub App permissions** and give Vercel access to the repo.
3. Leave the framework as **Next.js** and the build settings as they are.
4. Don't deploy yet. The first build needs the database and secret from the next steps, and fails with a clear message without them.

## 2. Add the database (Neon)

1. In the Vercel project, open **Storage → Create Database → Neon (Postgres)**.
2. Pick the region closest to most visitors (for example Frankfurt or Singapore for Bangladesh and the Gulf), then create it.
3. Connect it to the project for **Production**, **Preview** and **Development**. Vercel adds `DATABASE_URL` for you.

If you'd rather create the database on neon.tech directly, copy its **pooled** connection string and add it yourself as `DATABASE_URL`.

The tables are created automatically on the first start, and the starting content is filled in once. Nothing needs to be run by hand.

## 3. Add image storage (Vercel Blob)

1. In the same project, open **Storage → Create Database → Blob**.
2. Connect it to the project. Vercel adds `BLOB_READ_WRITE_TOKEN`.

Without it, images uploaded in the CMS would disappear on the next deploy.

## 4. Set the remaining environment variables

Open **Settings → Environment Variables** and add:

| Name | Value |
|---|---|
| `PAYLOAD_SECRET` | A long random string. Run `openssl rand -hex 32` or use any password generator, 32+ characters. Never change it later, or everyone is logged out. |
| `ANTHROPIC_API_KEY` | Create one at console.anthropic.com → **API keys**. Add billing credit there first. |
| `NEXT_PUBLIC_SITE_URL` | Your final address, for example `https://abdulmomen.com`. Until the domain is ready, leave it out and the Vercel address is used. |

Check that `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` are also listed from steps 2 and 3.

## 5. Deploy

1. Open **Deployments** and click **Redeploy** (or push any commit to `main`).
2. When it finishes, open the site. The first load takes a few seconds longer while the database is set up.

From now on every push to `main` deploys automatically.

## 6. Create your CMS login

1. Go to `https://<your-site>/admin`.
2. The first visit asks you to create the admin account. Use a strong password. This is the only account that can edit the site.

## 7. Before you share the link

In the CMS:

- **Site & Home**: upload your portrait, check the email, socials and the "Open to new projects" badge.
- **Testimonials**: replace the placeholder quotes with real ones, then untick **Placeholder** on each. Delete any you don't replace.
- **People**: entries marked **Sample** are demo personas. Replace or delete them.
- **Inbox → Activity** and **Inbox → Conversations**: delete the entries marked **Sample**. Real visitors replace them.
- **Pages → Chat → AI & billing**: choose the model, monthly budget and per-visitor limit. The starting settings are Claude Opus 5.5, low effort, $20 a month and 30 questions per visitor per day. Claude Sonnet 5.5 costs about half as much per answer.
- **Pages → Chat → Answers**: add facts the site doesn't show (rates, time zone, how you like to start a project).

Then test from your phone: send yourself a message from the contact form, sign up for notes, and ask the chat a question. Each should appear in the CMS under **Inbox** or **Writing**.

## Search and AI answers

- Every page has a **Search & sharing** section in the CMS (Pages → each tab, each project and each note): title, description, share image, and a switch to hide the page from search. Left empty, the page's own title and intro are used and a share image is drawn for it.
- **Site & Home → Search & profile** holds the site-wide title and description and the facts search engines and AI assistants read about you: job title, company, company link and topics you know.
- **Pages → About → FAQ** answers show on the About page and are marked up so Google and AI assistants can quote them. Keep them short and factual.
- The site publishes `/sitemap.xml`, `/robots.txt` (search and AI crawlers allowed, the CMS blocked) and `/llms.txt`, a plain summary for AI assistants. All update themselves from the CMS.

## 8. Connect your domain

1. In Vercel, open **Settings → Domains** and add your domain (for example `abdulmomen.com` and `www.abdulmomen.com`).
2. Vercel shows the DNS records to add. Add them at your domain registrar. HTTPS is set up automatically once they resolve.
3. Set `NEXT_PUBLIC_SITE_URL` to the domain and redeploy, so the sitemap, RSS feed and share links use it.
4. Submit `https://<domain>/sitemap.xml` in Google Search Console and Bing Webmaster Tools. Bing also feeds ChatGPT search and Copilot.

## Where everything lands

| What | Where in the CMS |
|---|---|
| Contact form messages | Inbox → Messages |
| Chats, with tokens and cost per chat | Inbox → Conversations |
| Likes, highlights and new chats (shown on /activity) | Inbox → Activity |
| Chat cost per month | Inbox → AI usage |
| Notes signups | Writing → Subscribers |

Visitor locations come from Vercel's request headers: city and country only, never an IP address.

## Costs to expect

- **Vercel Hobby, Neon Free, Blob**: free for a personal site's traffic. Vercel's Hobby plan is for non-commercial use; if the site is used to sell services, Vercel asks for the Pro plan ($20 a month).
- **Claude API**: with Opus 5.5 at low effort, a typical answer costs around one to three cents, mostly from the site briefing, which is cached so repeat questions cost less. The monthly budget in the CMS stops AI answers when it is reached; visitors then see your email instead.

## If something goes wrong

- **Build fails with "Set PAYLOAD_SECRET" or "Set DATABASE_URL"**: the variable is missing for that environment. Add it in Settings → Environment Variables and redeploy.
- **Chat only shows the offline text**: check `ANTHROPIC_API_KEY`, that **Answer with AI** is ticked, and that this month's spend under AI & billing is below the budget. Errors from the Claude API are listed in Vercel under **Logs**.
- **Uploaded images vanish after a deploy**: `BLOB_READ_WRITE_TOKEN` is missing.
- **Locked out of the CMS**: password reset emails need an email service, which isn't set up. Ask a developer to reset the password directly in the database, or add an email adapter (for example Resend) to `src/payload.config.ts`.
