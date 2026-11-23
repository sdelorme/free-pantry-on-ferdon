# free-pantry-on-ferdon

A public board of anonymous notes left at a Little Free Pantry on Ferdon Avenue.

Scan the QR code on the box, answer one question — why you gave, or why you
took — and your words go up on the board once a human has read them. No names,
no accounts, no tracking. The site stores your words and the date, and nothing
else.

## Running it

```bash
npm install
npm run dev
```

Works with no database: the board falls back to seed data and says so in the
console. See `.env.example` to connect a real one.

```bash
npm run check    # typecheck
npm run build    # production build
```

## Stack

Astro 5 · Neon Postgres · Vercel. Static by default; only the board is
server-rendered.

See `CLAUDE.md` for architecture, read order, and the constraints that aren't
obvious from the code.

## Status

The board renders. The submission form, the moderation queue, and the real
About/Find copy are still to come.
