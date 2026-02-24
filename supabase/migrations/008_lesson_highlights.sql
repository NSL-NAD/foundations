-- Persist lesson text highlights across sessions
CREATE TABLE lesson_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  module_slug TEXT NOT NULL,
  lesson_slug TEXT NOT NULL,
  highlighted_text TEXT NOT NULL,
  prefix_context TEXT DEFAULT '',
  suffix_context TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lesson_highlights_user_lesson
  ON lesson_highlights(user_id, module_slug, lesson_slug);

ALTER TABLE lesson_highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own highlights"
  ON lesson_highlights FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
