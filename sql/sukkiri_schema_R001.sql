-- Sukkiri — Supabase schema (mirrors the calendar_app_sukkiri pattern)
-- Run in Supabase SQL editor. Payload = the whole Sukkiri localStorage state
-- (key sukkiri_v1) minus photos; photos go to storage bucket `sukkiri-photos`.

CREATE TABLE IF NOT EXISTS sukkiri_state (
  user_id     uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  payload     jsonb NOT NULL DEFAULT '{}'::jsonb,   -- cycles, supplies, shop, holidays, pool, points, streak, log, print
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- One row per inspection report (kept separately so the state payload stays small)
CREATE TABLE IF NOT EXISTS sukkiri_reports (
  id          text PRIMARY KEY,                       -- Sukkiri report id (r…)
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_at timestamptz NOT NULL,
  overall     smallint NOT NULL CHECK (overall BETWEEN 0 AND 100),
  summary     text,
  areas       jsonb NOT NULL DEFAULT '[]'::jsonb      -- [{area, score, verdict, issues[], instructions[], suggestedItems[]}]
);
CREATE INDEX IF NOT EXISTS sukkiri_reports_user_time ON sukkiri_reports (user_id, reported_at DESC);

-- Ideal + weekly photos: metadata only; binary lives in storage bucket sukkiri-photos/<user_id>/<area>/<kind>-<ts>.jpg
CREATE TABLE IF NOT EXISTS sukkiri_photos (
  id          bigserial PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  area_id     text NOT NULL,                          -- bed | desk | wardrobe | floor | laundry | custom
  kind        text NOT NULL CHECK (kind IN ('ideal','current')),
  storage_path text NOT NULL,
  locked      boolean NOT NULL DEFAULT false,         -- ideal photos lock once set
  taken_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sukkiri_photos_user_area ON sukkiri_photos (user_id, area_id, kind);

-- Purchase requests handed to the cost management app (same shape as localStorage sukkiri_cost_requests)
CREATE TABLE IF NOT EXISTS sukkiri_cost_requests (
  id           text PRIMARY KEY,                      -- req…
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status       text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  requested_at timestamptz NOT NULL DEFAULT now(),
  approved_at  timestamptz,
  currency     text NOT NULL DEFAULT 'JPY',
  total_yen    integer NOT NULL DEFAULT 0,
  items        jsonb NOT NULL DEFAULT '[]'::jsonb     -- [{name, priceYen, link, reason, category}]
);

-- Row-level security: each user only sees their own rows
ALTER TABLE sukkiri_state          ENABLE ROW LEVEL SECURITY;
ALTER TABLE sukkiri_reports        ENABLE ROW LEVEL SECURITY;
ALTER TABLE sukkiri_photos         ENABLE ROW LEVEL SECURITY;
ALTER TABLE sukkiri_cost_requests  ENABLE ROW LEVEL SECURITY;

DO $$ DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['sukkiri_state','sukkiri_reports','sukkiri_photos','sukkiri_cost_requests'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "%1$s_own" ON %1$s', t);
    EXECUTE format('CREATE POLICY "%1$s_own" ON %1$s FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)', t);
  END LOOP;
END $$;

-- Storage bucket for photos (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('sukkiri-photos', 'sukkiri-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Sync contract with the calendar app:
--   Sukkiri writes cycles[] into calendar_app_sukkiri.payload.cycles
--   ({id:'sk_<cycleId>', name, every, anchor:'YYYY-MM-DD', color}) — the same
--   shape js/sukkiri.js in Calender_app reads. Garbage rules stay in that payload
--   and Sukkiri reads them back for its print sheets.
