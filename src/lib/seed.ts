import type { Response } from './responses';

/**
 * Stand-in content for local development with no DATABASE_URL set.
 *
 * These are invented, not real submissions. They exist so the board can
 * be designed and reviewed at a realistic density — roughly a year at
 * the rate this pantry expects — without provisioning a database. The
 * Spanish card is here to keep the non-English path visible: responses
 * are stored and shown exactly as written, never translated.
 */
export const SEED_RESPONSES: Response[] = [
  { id: 15, kind: 'gave', lang: 'en', day: '2026-11-18', body: 'I had extra rice and nowhere to put it.' },
  { id: 14, kind: 'took', lang: 'en', day: '2026-11-18', body: "It's between paychecks. My kid eats first." },
  { id: 13, kind: 'gave', lang: 'en', day: '2026-11-16', body: 'Someone did this for me once.' },
  { id: 12, kind: 'took', lang: 'en', day: '2026-11-15', body: 'A car repair ate the grocery money this month.' },
  { id: 11, kind: 'gave', lang: 'en', day: '2026-11-14', body: 'My garden made more tomatoes than two people can eat.' },
  { id: 10, kind: 'took', lang: 'es', day: '2026-11-12', body: 'No me alcanzó hasta el viernes y no quería pedirle a nadie.' },
  { id: 9,  kind: 'gave', lang: 'en', day: '2026-11-11', body: 'I walk past this box every day and finally stopped.' },
  { id: 8,  kind: 'took', lang: 'en', day: '2026-11-09', body: "I'm okay, just stretched thin until Friday." },
  { id: 7,  kind: 'gave', lang: 'en', day: '2026-11-08', body: 'My mother passed in March and she would have wanted the cans used.' },
  { id: 6,  kind: 'took', lang: 'en', day: '2026-11-06', body: 'I lost hours at work this week.' },
  { id: 5,  kind: 'gave', lang: 'en', day: '2026-11-05', body: 'My kids wanted to pick what went in. They chose the cereal.' },
  { id: 4,  kind: 'took', lang: 'en', day: '2026-11-03', body: 'The shelter kitchen is closed on Sundays.' },
  { id: 3,  kind: 'gave', lang: 'en', day: '2026-10-30', body: 'The pantry was empty when I drove past and that bothered me all day.' },
  { id: 2,  kind: 'took', lang: 'en', day: '2026-10-28', body: 'My hours got cut and I have two weeks to cover.' },
  { id: 1,  kind: 'gave', lang: 'en', day: '2026-10-25', body: "My daughter asked why the box was there and I didn't have a good answer for doing nothing." },
];
