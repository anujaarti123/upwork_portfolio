-- Migration: add media_type to project_screenshots for images + videos
ALTER TABLE project_screenshots
  ADD COLUMN IF NOT EXISTS media_type TEXT NOT NULL DEFAULT 'image'
  CHECK (media_type IN ('image', 'video'));
