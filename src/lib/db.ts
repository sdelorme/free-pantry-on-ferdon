import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from 'astro:env/server';

/**
 * The Neon query function, or null when no DATABASE_URL is configured.
 *
 * Null is a legitimate local state, not an error: with no database the
 * board falls back to seed data so the design is workable without
 * provisioning anything. Callers must handle null — see
 * `publishedResponses` for how, including the production guard.
 *
 * DATABASE_URL comes from `astro:env/server` rather than
 * `import.meta.env` because secrets there are read at runtime. An
 * `import.meta.env` read would be inlined at build time, so changing
 * the value in the Vercel dashboard would silently do nothing until
 * the next deploy.
 */
export const sql = DATABASE_URL ? neon(DATABASE_URL) : null;

export const hasDatabase = sql !== null;
