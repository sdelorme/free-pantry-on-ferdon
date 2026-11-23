import { sql } from './db';
import { SEED_RESPONSES } from './seed';

export type Kind = 'gave' | 'took';

/** One anonymous answer. Mirrors `responses` in db/schema.sql exactly. */
export interface Response {
  id: number;
  kind: Kind;
  body: string;
  lang: string;
  /** ISO date, no time. See the note in db/schema.sql for why. */
  day: string;
}

/** Hard cap, enforced again by a CHECK constraint in the schema. */
export const MAX_BODY_LENGTH = 180;

/**
 * Card colours, lifted off the physical box's painted daisies.
 *
 * Warm flowers for giving, cool flowers for taking: the two groups stay
 * tellable apart across a page while no two neighbouring cards match.
 * Which colour a card gets is derived from its id rather than stored,
 * so a card is always the same colour without costing a column.
 */
const WARM = ['red', 'pink', 'orange', 'yellow'] as const;
const COOL = ['green', 'teal', 'blue', 'purple'] as const;

export type CardColor = (typeof WARM)[number] | (typeof COOL)[number];

/**
 * Bit-mixing integer hash (the murmur3 finalizer).
 *
 * `id % palette.length` is the obvious thing here and it is wrong: it
 * inherits the arithmetic structure of the id sequence. When gives and
 * takes alternate, one kind gets every odd id and the other every even
 * one, so each palette can only ever reach half its colours. Mixing the
 * bits first decouples the colour from how the ids happened to fall.
 */
function hash(n: number): number {
  let h = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

export function cardColor(response: Response): CardColor {
  const palette = response.kind === 'gave' ? WARM : COOL;
  return palette[hash(response.id) % palette.length]!;
}

/**
 * The sentence stem each card completes, so the board reads as a wall of
 * answers to the headline's blank.
 *
 * Keyed by language because responses are shown in the language they were
 * written in — an English stem in front of Spanish words would read as
 * broken. Unknown languages fall back to English rather than failing.
 */
const STEMS: Record<string, Record<Kind, string>> = {
  en: { gave: 'I gave because', took: 'I took because' },
  es: { gave: 'Doné porque', took: 'Tomé algo porque' },
};

export function stemFor(response: Response): string {
  return (STEMS[response.lang] ?? STEMS.en!)[response.kind];
}

/**
 * Every approved response, newest first.
 *
 * Only `status = 'published'` is ever read here — nothing reaches the
 * board until it has been approved in the moderation queue.
 */
export async function publishedResponses(): Promise<Response[]> {
  if (!sql) {
    // A missing database is fine locally and unacceptable in production,
    // where silently serving invented cards would be a lie to visitors.
    if (import.meta.env.PROD) {
      throw new Error(
        'DATABASE_URL is not set. Refusing to serve seed data in production.',
      );
    }
    console.warn(
      '[pantry] DATABASE_URL unset — serving seed data from src/lib/seed.ts',
    );
    return SEED_RESPONSES;
  }

  const rows = await sql`
    select id, kind, body, lang, to_char(day, 'YYYY-MM-DD') as day
    from responses
    where status = 'published'
    order by day desc, id desc
  `;

  return rows as Response[];
}
