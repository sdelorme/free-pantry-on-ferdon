// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';

// Static by default. Only the pages that need fresh data opt out, via
// `export const prerender = false` — currently just the board and (later)
// the moderation queue. Everything else ships as HTML with no function
// invocation, which is most of why this site loads instantly on bad cell
// service at the box.
export default defineConfig({
  output: 'static',
  adapter: vercel(),
  site: 'https://freepantryonferdon.example',

  // Typed env. Secrets are read at runtime rather than inlined at build
  // time, which matters on Vercel: a value changed in the dashboard
  // takes effect without a redeploy. Both are optional so the project
  // builds and runs with no database — see src/lib/seed.ts.
  env: {
    schema: {
      DATABASE_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      ADMIN_PASSWORD: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
    },
  },
});
