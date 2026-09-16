# Noiz Systems portal

Marketing site for Noiz Systems: a Next.js 16 landing page in French and
English, with its content managed in [Payload CMS](https://payloadcms.com).

## Getting started

```bash
pnpm install
cp .env.example .env        # then set PAYLOAD_SECRET (openssl rand -hex 32)
pnpm seed                   # creates the database, an admin user and the launch copy
pnpm dev
```

- Site: <http://localhost:3000> (French) and <http://localhost:3000/en>
- Admin: <http://localhost:3000/admin> — sign in with the seed credentials
  from `.env` (`PAYLOAD_SEED_USER_EMAIL` / `PAYLOAD_SEED_USER_PASSWORD`).

## Where content lives

| What                                                  | Where                                    |
| ----------------------------------------------------- | ---------------------------------------- |
| Headlines, hero, stats, ticker, section intros, SEO   | Admin → **Landing page** (global)        |
| Product cards, markets table, news cards, FAQ entries | Admin → **Products / Markets / Posts / FAQs** |
| Images                                                | Admin → **Media**                        |
| UI microcopy (nav labels, form fields, aria text)     | `messages/fr.json`, `messages/en.json`   |

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

Development uses a local SQLite file (`DATABASE_URI=file:./noiz.db`) and
Payload pushes schema changes to it automatically. In production the schema
is applied through migrations instead:

```bash
pnpm payload migrate:create   # after changing a collection or global
pnpm payload migrate          # on deploy
```

`DATABASE_URI` accepts any libSQL URL, so a hosted Turso database is a
one-line change.
