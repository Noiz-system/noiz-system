# Noiz Systems portal

Marketing site for Noiz Systems: a Next.js 16 landing page in French and
English, with its content managed in [Payload CMS](https://payloadcms.com).

## Getting started

```bash
pnpm install
cp .env.example .env        # set PAYLOAD_SECRET (openssl rand -hex 32) and DATABASE_URI
pnpm seed                   # creates the tables, an admin user and the launch copy
pnpm dev
```

- Site: <http://localhost:3000> (French) and <http://localhost:3000/en>
- Admin: <http://localhost:3000/admin> — sign in with the seed credentials
  from `.env` (`PAYLOAD_SEED_USER_EMAIL` / `PAYLOAD_SEED_USER_PASSWORD`).

## Where content lives

| What                                                  | Where                                    |
| ----------------------------------------------------- | ---------------------------------------- |
| Hero, sections, help band, contact, footer CTA, address, legal notice, SEO | Admin → **Landing page** (global) |
| Help centre header, aside and SEO (`/support`)        | Admin → **Help centre** (global)         |
| Product cards, FAQ entries (markets, posts: not displayed) | Admin → **Products / FAQs**         |
| Images                                                | Admin → **Media**                        |
| UI microcopy (nav and footer links, form fields, errors, emails, aria text) | `messages/fr.json`, `messages/en.json` |

Every editorial field is localized. French is the default locale and the
fallback: an English field left empty shows the French text. Headline fields
accept `<accent>…</accent>` to mark words for the brand gradient.

Saving in the admin revalidates the prerendered pages, so edits are live on
the next request.

## Scripts

| Command                   | Purpose                                                          |
| ------------------------- | ---------------------------------------------------------------- |
| `pnpm dev` / `pnpm build` | Next.js dev server / production build                            |
| `pnpm seed`               | Fill an empty database with the launch copy in both languages    |
| `pnpm seed reset`         | Wipe products, markets, posts and FAQs, then seed again          |
| `pnpm sync:content`       | Dry run: list what differs from `scripts/seed/content.ts`        |
| `pnpm sync:content --apply` | Write those differences into the database `DATABASE_URI` points at |
| `pnpm generate:types`     | Regenerate `payload-types.ts` after changing a collection/global |
| `pnpm generate:importmap` | Regenerate the admin import map after adding custom components   |
| `pnpm typecheck`          | Route typegen + `tsc`                                            |
| `pnpm lint`               | ESLint                                                           |

## Project layout

```
app/(frontend)/[locale]/   the site — one root layout per locale
app/(payload)/             the admin panel and REST API — its own root layout
cms/                       Payload collections, globals, access and hooks
payload.config.ts          Payload entry point (locales mirror i18n/routing.ts)
lib/cms.ts                 typed readers used by the server components
scripts/seed/              seed runner and the bilingual launch copy
messages/                  next-intl catalogues (UI strings only)
```

## Database

Payload runs on Postgres; `DATABASE_URI` is a standard connection string
(add `?sslmode=require` for hosted providers such as Neon). Dev push is
disabled (`push: false` in `payload.config.ts`), so the schema only changes
through migrations, locally and in production:

```bash
pnpm payload migrate:create <name>   # after changing a collection or global
pnpm payload migrate                 # apply locally; Vercel runs it on deploy
```

## Syncing content with the reference design

`scripts/seed/content.ts` holds the copy of the reference design (the
"BD Marketing Support Hub" Lovable project) in both languages. To bring an
existing database — dev or production — in line with it without wiping
anything, point `DATABASE_URI` at it and run:

```bash
pnpm payload migrate            # the script writes fields the latest migration adds
pnpm sync:content               # dry run: prints every field that would change
pnpm sync:content --apply       # writes them
```

It updates the two globals, the products (matched by name; store links are
kept) and the FAQs (matched by position). Markets and posts are left alone.
A brand image missing from Media is reported and skipped; `--upload-media`
uploads it, but the file lands in the `media/` folder of the machine running
the script, so only use it where that disk serves the site.

The script bypasses revalidation, so for production run it **before** the
deploy that ships the new code: the build then renders the synced content.
Run afterwards, pages pick it up on the next deploy or the next save in
`/admin`.

If `payload migrate` asks whether you ran Payload in dev mode, the database
still has the dev-push marker. Remove it with
`DELETE FROM payload_migrations WHERE batch = -1;`.
