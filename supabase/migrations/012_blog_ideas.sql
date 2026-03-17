-- Blog idea queue for the Social Hub admin panel
CREATE TABLE blog_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hook TEXT NOT NULL,
  outline TEXT,
  pillar TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'dismissed')),
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE blog_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage blog ideas" ON blog_ideas
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
