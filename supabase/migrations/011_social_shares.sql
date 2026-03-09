-- Social Media Content Tracking
-- Migration 011: social_shares table for tracking blog sharing to social platforms

CREATE TABLE social_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_slug TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'x', 'instagram')),
  generated_copy TEXT,
  shared_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (blog_slug, platform)
);

ALTER TABLE social_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage social shares" ON social_shares
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
