-- Notebook File Uploads & Design Brief Generation
-- Migration 006: notebook_files table, generated_briefs table,
-- and private storage bucket policies for 'notebook-files'

-- ============================================
-- NOTEBOOK FILES (attached to lesson notes or general)
-- ============================================
CREATE TABLE notebook_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  module_slug TEXT,            -- NULL for "general" uploads not tied to a lesson
  lesson_slug TEXT,            -- NULL for "general" uploads not tied to a lesson
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,  -- path within the 'notebook-files' bucket
  file_type TEXT NOT NULL,     -- MIME type (e.g. image/jpeg, application/pdf)
  file_size INTEGER NOT NULL,  -- size in bytes
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notebook_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own notebook files" ON notebook_files
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_notebook_files_user ON notebook_files(user_id);
CREATE INDEX idx_notebook_files_user_lesson ON notebook_files(user_id, module_slug, lesson_slug);

-- ============================================
-- GENERATED DESIGN BRIEFS (AI-compiled briefs)
-- ============================================
CREATE TABLE generated_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  firm_name TEXT,
  color_palette TEXT NOT NULL,       -- 'classic', 'warm', or 'modern'
  font_style TEXT NOT NULL,          -- 'serif', 'clean', or 'minimal'
  ai_content TEXT NOT NULL,          -- raw AI-generated text (markdown/structured)
  pdf_storage_path TEXT,             -- path in storage if PDF saved
  docx_storage_path TEXT,            -- path in storage if DOCX saved
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE generated_briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own briefs" ON generated_briefs
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_generated_briefs_user ON generated_briefs(user_id);

-- ============================================
-- NOTEBOOK FILES STORAGE POLICIES
-- Bucket 'notebook-files' must be created in Supabase dashboard as PRIVATE
-- (Settings > Storage > New Bucket > uncheck "Public bucket")
-- ============================================

-- Users can upload files to their own folder
CREATE POLICY "Users can upload notebook files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'notebook-files'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can view only their own files
CREATE POLICY "Users can view own notebook files" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'notebook-files'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete only their own files
CREATE POLICY "Users can delete own notebook files" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'notebook-files'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
