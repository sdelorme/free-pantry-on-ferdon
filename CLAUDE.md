# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A public board of anonymous notes left at a physical Little Free Pantry on
Ferdon Avenue, run by one family. A QR code on the box leads to a two-step
form; approved answers appear as cards on the landing page.

The site is three pages and one form. Resist growth — "simple site" is a
requirement here, not a starting point.

## Commands

```bash
npm run dev      # localhost:4321, works with no database (see Seed data)
npm run check    # astro check — typecheck .astro and .ts. Run before committing.
npm run build    # production build; also the fastest way to catch SSR errors
npm run preview  # serve the built output
```

There is no test suite yet. `npm run check` plus a build is the current gate.

## Architecture

Astro 5, `output: 'static'` with per-page opt-out. Deployed to Vercel via
`@astrojs/vercel`; Postgres on Neon.

Only pages that need fresh data set `export const prerender = false` —
currently just the board. Everything else ships as static HTML with no
function invocation. That is deliberate: the most common visit is someone
standing at the box on bad cell service.

**Read order** (entry point first, then down the call graph):

| File | Role |
|---|---|
| `src/pages/index.astro` | The board. SSR. Owns the filter/shuffle script. |
| `src/components/Card.astro` | One response. Picks stem, colour, daisy. |
| `src/lib/responses.ts` | Types, colour derivation, stems, the published query. |
| `src/lib/db.ts` | Neon client, or `null` when unconfigured. |
| `src/layouts/Base.astro` | Shell, fonts, nav, `panel` slot. |
| `src/styles/board.css` | The whole design system. |
| `db/schema.sql` | One table. Read the comments before changing it. |

`Base.astro` exposes a named `panel` slot that renders inside the sticky
left column; pages put their headline and controls there and their body
content in the default slot. That is what makes the desktop two-column
layout work without each page re-implementing it.

### Not yet built

Layers 5-8: the form (`/share`, `/share/[kind]`, `/share/thanks`), the
Astro Action that inserts as `pending`, the `/admin` moderation queue, and
the middleware that password-gates it. `.env.example` lists the env vars
these will need.

## Constraints that are not obvious from the code

**The schema keeps the privacy promise, not the application code.** There is
no IP column, no session id, no user agent, no `created_at`. The site tells
visitors "we keep the words and the date, and nothing else" and that is
meant literally. Do not add a column that makes it false.

**`day` is a `date`, not a `timestamptz`, on purpose.** At a few dozen
responses a year an exact time re-identifies people — a neighbour seen at
the box at 4:12pm matches the 4:12pm card. Do not "improve" this to a
timestamp.

**Nothing reaches the board unapproved.** `publishedResponses()` filters to
`status = 'published'`. Any new read path must do the same.

**Responses are never translated.** They are stored and displayed in the
language they were written in, with a small `lang` tag. Machine-translating
someone's anonymous testimony is a dignity problem, not a feature. Stems are
localised per language in `STEMS`; unknown languages fall back to English.

**Card colour is derived, not stored.** `cardColor()` hashes the id before
taking a modulo. Plain `id % palette.length` was tried and is wrong: gives
and takes alternate, so one kind gets every odd id and the other every even
one, and each palette can only reach half its colours.

**No analytics, ever.** Adding any third-party script contradicts the
promise on the front page.

## Design

Every colour in `board.css` was sampled off the physical box — white
painted board, hand-painted daisies, navy block letters with a coloured
outline. Nothing was invented. If you need a new colour, go back to the
photos.

Two typefaces do two different jobs, and the split matters: the site's own
voice is hand-lettered (`Patrick Hand`, `Lilita One`) because the box is
hand-lettered by the family. **Respondents' words are always clean type
(`Inter`).** One handwriting font across every card would put the same hand
on every person, which reads as fake.

Warm daisy colours mean `gave`, cool mean `took`. Kind is also always
stated in text, so nothing depends on colour alone.

`design/` holds the mockups the design was settled from, including the
rejected dark-chalkboard direction. They are static HTML, not part of the
build — useful for seeing why the current design looks the way it does.

## Local setup

Copy `.env.example` to `.env`. Both variables are optional.

With `DATABASE_URL` unset, the board serves `src/lib/seed.ts` — fifteen
invented responses at roughly the density of a real year — and logs a
warning. This is so the design is workable without provisioning anything.
In production the same path throws rather than serving invented cards.

To set up the database, apply `db/schema.sql` to a Neon branch. Creating
Neon projects and running migrations is Seth's to run, not Claude's.
