-- About / Architect Introduction section
-- Run in Supabase SQL Editor after prior migrations

CREATE TABLE IF NOT EXISTS about_section (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name           TEXT NOT NULL DEFAULT 'Anuj Kumar',
  role_tagline        TEXT DEFAULT 'Jewellery ERP Architect • Full-Stack Engineer • Founder, GoldNest AI',
  profile_photo_url   TEXT,
  availability_status TEXT DEFAULT 'Available for Architecture & Consulting',
  bio                 TEXT DEFAULT 'Deep domain expertise in Jewellery Tech, Cloud Architecture, and Automation — building enterprise-grade ERP systems, SaaS platforms, and AI-driven workflows for jewellers worldwide.',
  linkedin_url        TEXT,
  upwork_url          TEXT,
  github_url          TEXT,
  whatsapp_url        TEXT,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS about_highlights (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label       TEXT NOT NULL,
  sort_order  INT  NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS show_about BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE about_section       ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_highlights    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read about_section" ON about_section
  FOR SELECT USING (true);
CREATE POLICY "Public read about_highlights" ON about_highlights
  FOR SELECT USING (true);
CREATE POLICY "Admin write about_section" ON about_section
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write about_highlights" ON about_highlights
  FOR ALL USING (auth.role() = 'authenticated');

INSERT INTO about_section (id)
SELECT uuid_generate_v4()
WHERE NOT EXISTS (SELECT 1 FROM about_section LIMIT 1);

INSERT INTO about_highlights (label, sort_order)
SELECT v.label, v.sort_order
FROM (VALUES
  ('100+ Active Users', 0),
  ('20+ SaaS Jewellers', 1),
  ('AWS & Flutter Expert', 2),
  ('Enterprise ERP Architect', 3)
) AS v(label, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM about_highlights LIMIT 1);
