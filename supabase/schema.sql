-- ============================================================
-- Developer Portfolio CMS — Supabase PostgreSQL Schema
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Global Site Settings (singleton) ────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  primary_accent    TEXT NOT NULL DEFAULT '#D4AF37',
  secondary_accent  TEXT NOT NULL DEFAULT '#10B981',
  background_color  TEXT NOT NULL DEFAULT '#0A0A0C',
  text_color        TEXT NOT NULL DEFAULT '#F5F5F5',
  card_fill         TEXT NOT NULL DEFAULT '#141418',
  font_family       TEXT NOT NULL DEFAULT 'sans' CHECK (font_family IN ('sans', 'mono')),
  logo_url          TEXT,
  favicon_url       TEXT,
  show_hero         BOOLEAN NOT NULL DEFAULT TRUE,
  show_ecosystem    BOOLEAN NOT NULL DEFAULT TRUE,
  show_case_studies BOOLEAN NOT NULL DEFAULT TRUE,
  show_tech_stack   BOOLEAN NOT NULL DEFAULT TRUE,
  show_footer       BOOLEAN NOT NULL DEFAULT TRUE,
  section_labels    JSONB NOT NULL DEFAULT '{
    "ecosystem_label": "Portfolio",
    "ecosystem_title": "Product Ecosystem",
    "case_studies_label": "Proof",
    "case_studies_title": "Client Success Stories",
    "tech_stack_label": "Stack",
    "tech_stack_title": "Technologies We Master",
    "nav_links": [
      {"href": "#ecosystem", "label": "Portfolio"},
      {"href": "#case-studies", "label": "Case Studies"},
      {"href": "#tech-stack", "label": "Tech Stack"},
      {"href": "#contact", "label": "Contact"}
    ]
  }'::jsonb,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Hero Section (singleton) ────────────────────────────────
CREATE TABLE IF NOT EXISTS hero_section (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  main_title            TEXT NOT NULL DEFAULT 'Build. Ship. Scale.',
  subtitle              TEXT DEFAULT 'Full-Stack Developer & Digital Agency',
  typing_texts          JSONB NOT NULL DEFAULT '["Flutter Apps","Next.js Platforms","AI Automations"]'::jsonb,
  background_image_url  TEXT,
  background_video_url  TEXT,
  background_color      TEXT,
  text_color            TEXT,
  cta1_text             TEXT DEFAULT 'View Portfolio',
  cta1_link             TEXT DEFAULT '#ecosystem',
  cta2_text             TEXT DEFAULT 'Get In Touch',
  cta2_link             TEXT DEFAULT '#contact',
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Hero Live Metrics Bar ───────────────────────────────────
CREATE TABLE IF NOT EXISTS hero_metrics (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label       TEXT NOT NULL,
  value       TEXT NOT NULL,
  icon        TEXT NOT NULL DEFAULT 'star',
  sort_order  INT  NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Tech Stack Tags ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tech_stack_tags (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,
  color       TEXT NOT NULL DEFAULT '#D4AF37',
  sort_order  INT  NOT NULL DEFAULT 0
);

-- ── Portfolio Projects ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  description     TEXT,
  category        TEXT,
  play_store_link TEXT,
  live_demo_url   TEXT,
  thumbnail_url   TEXT,
  video_url       TEXT,
  sort_order      INT  NOT NULL DEFAULT 0,
  is_published    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_screenshots (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  media_type  TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  sort_order  INT  NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS project_tags (
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tag_id      UUID NOT NULL REFERENCES tech_stack_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tag_id)
);

-- ── Client Case Studies ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS case_studies (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name       TEXT NOT NULL,
  title             TEXT NOT NULL,
  description       TEXT,
  before_text       TEXT,
  after_text        TEXT,
  testimonial_quote TEXT,
  client_logo_url   TEXT,
  sort_order        INT  NOT NULL DEFAULT 0,
  is_published      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Footer Settings (singleton) ─────────────────────────────
CREATE TABLE IF NOT EXISTS footer_settings (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bio_text          TEXT DEFAULT 'Crafting digital experiences that convert.',
  copyright_notice  TEXT DEFAULT '© 2026 All Rights Reserved.',
  contact_email     TEXT,
  contact_phone     TEXT,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Social Links ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS social_links (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform    TEXT NOT NULL,
  url         TEXT NOT NULL,
  icon        TEXT NOT NULL DEFAULT 'link',
  sort_order  INT  NOT NULL DEFAULT 0,
  is_visible  BOOLEAN NOT NULL DEFAULT TRUE
);

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE site_settings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_section        ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_metrics        ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_stack_tags     ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects            ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tags        ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies        ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_settings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links        ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read site_settings"       ON site_settings       FOR SELECT USING (true);
CREATE POLICY "Public read hero_section"        ON hero_section        FOR SELECT USING (true);
CREATE POLICY "Public read hero_metrics"        ON hero_metrics        FOR SELECT USING (true);
CREATE POLICY "Public read tech_stack_tags"     ON tech_stack_tags     FOR SELECT USING (true);
CREATE POLICY "Public read projects"            ON projects            FOR SELECT USING (is_published = true);
CREATE POLICY "Public read project_screenshots" ON project_screenshots FOR SELECT USING (true);
CREATE POLICY "Public read project_tags"        ON project_tags        FOR SELECT USING (true);
CREATE POLICY "Public read case_studies"        ON case_studies        FOR SELECT USING (is_published = true);
CREATE POLICY "Public read footer_settings"     ON footer_settings     FOR SELECT USING (true);
CREATE POLICY "Public read social_links"        ON social_links        FOR SELECT USING (is_visible = true);

-- Authenticated write policies (admin)
CREATE POLICY "Admin write site_settings"       ON site_settings       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write hero_section"        ON hero_section        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write hero_metrics"        ON hero_metrics        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write tech_stack_tags"     ON tech_stack_tags     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write projects"            ON projects            FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write project_screenshots" ON project_screenshots FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write project_tags"        ON project_tags        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write case_studies"        ON case_studies        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write footer_settings"     ON footer_settings     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write social_links"        ON social_links        FOR ALL USING (auth.role() = 'authenticated');

-- ── Storage Bucket for CMS uploads ───────────────────────────
-- Run in Supabase Dashboard → Storage → Create bucket "cms-assets" (public)

-- ── Seed Data ─────────────────────────────────────────────────
INSERT INTO site_settings (id) VALUES (uuid_generate_v4()) ON CONFLICT DO NOTHING;

INSERT INTO hero_section (id) VALUES (uuid_generate_v4()) ON CONFLICT DO NOTHING;

INSERT INTO footer_settings (id) VALUES (uuid_generate_v4()) ON CONFLICT DO NOTHING;

INSERT INTO hero_metrics (label, value, icon, sort_order) VALUES
  ('Projects Delivered', '50+', 'rocket', 0),
  ('Happy Clients', '30+', 'users', 1),
  ('Years Experience', '5+', 'award', 2),
  ('Uptime SLA', '99.9%', 'shield', 3)
ON CONFLICT DO NOTHING;

INSERT INTO tech_stack_tags (name, color, sort_order) VALUES
  ('Flutter', '#02569B', 0),
  ('Next.js', '#000000', 1),
  ('PostgreSQL', '#336791', 2),
  ('AWS', '#FF9900', 3),
  ('n8n', '#EA4B71', 4),
  ('TypeScript', '#3178C6', 5)
ON CONFLICT (name) DO NOTHING;

INSERT INTO social_links (platform, url, icon, sort_order) VALUES
  ('GitHub', 'https://github.com', 'github', 0),
  ('LinkedIn', 'https://linkedin.com', 'linkedin', 1),
  ('WhatsApp', 'https://wa.me/', 'message-circle', 2),
  ('Upwork', 'https://upwork.com', 'briefcase', 3),
  ('Play Store', 'https://play.google.com', 'smartphone', 4);

INSERT INTO projects (title, description, category, live_demo_url, sort_order) VALUES
  ('E-Commerce Platform', 'Full-stack marketplace with real-time inventory', 'Web App', '#', 0),
  ('Fitness Tracker App', 'Cross-platform Flutter app with wearable sync', 'Mobile', '#', 1);

INSERT INTO case_studies (client_name, title, description, before_text, after_text, testimonial_quote, sort_order) VALUES
  ('Shri Radhey Krishna Jewellers', 'Digital Transformation', 'Complete rebrand and e-commerce launch', 'Offline-only retail with zero online presence', '300% increase in online inquiries within 3 months', 'They transformed our business completely. Sales have never been better.', 0);
