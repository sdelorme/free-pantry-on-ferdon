-- Free Pantry on Ferdon — schema
--
-- One table. Every row is one anonymous answer left at the box.
--
-- Note what is NOT here: no IP, no session id, no user agent, no
-- created_at timestamp. The site promises "we keep the words and the
-- date, and nothing else", and that promise is kept by the schema
-- rather than by remembering to be careful in application code.
--
-- `day` is a DATE, not a TIMESTAMPTZ, on purpose. At a few dozen
-- responses a year, a wall-clock time is enough to re-identify
-- someone: a neighbour seen at the box at 4:12pm matches the 4:12pm
-- card. A date alone does not narrow it down to a person.

create table if not exists responses (
  id     bigserial primary key,
  kind   text not null check (kind in ('gave', 'took')),
  body   text not null check (char_length(body) between 1 and 180),
  lang   text not null default 'en',
  status text not null default 'pending'
           check (status in ('pending', 'published', 'rejected')),
  day    date not null default current_date
);

-- The board's only read: published rows, newest first. Partial index
-- because pending and rejected rows are never on this path.
create index if not exists responses_published_idx
  on responses (day desc, id desc)
  where status = 'published';

-- The moderation queue's only read: oldest pending first, so the
-- person who answered first goes up first.
create index if not exists responses_pending_idx
  on responses (id)
  where status = 'pending';
