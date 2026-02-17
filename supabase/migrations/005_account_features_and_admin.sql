-- Account Features & Admin New Students
-- Migration 005: course_reviews, dream_home_submissions, contact_messages,
-- admin_viewed_at on purchases, storage policies, fix get_course_completion

-- ============================================
-- COURSE REVIEWS (one per student)
-- ============================================
CREATE TABLE course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own review" ON course_reviews
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all reviews" ON course_reviews
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE TRIGGER course_reviews_updated_at
  BEFORE UPDATE ON course_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- DREAM HOME SUBMISSIONS (one per student)
-- ============================================
CREATE TABLE dream_home_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE dream_home_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own submission" ON dream_home_submissions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all submissions" ON dream_home_submissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- CONTACT MESSAGES
-- ============================================
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT '',
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own messages" ON contact_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own messages" ON contact_messages
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- NEW STUDENTS TRACKING (admin_viewed_at on purchases)
-- ============================================
ALTER TABLE purchases ADD COLUMN admin_viewed_at TIMESTAMPTZ DEFAULT NULL;

-- ============================================
-- DREAM HOME IMAGES STORAGE POLICIES
-- (Bucket 'dream-home-images' must be created in Supabase dashboard)
-- ============================================
CREATE POLICY "Users can upload dream home images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'dream-home-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own dream home images" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'dream-home-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Anyone can view dream home images" ON storage.objects
  FOR SELECT USING (bucket_id = 'dream-home-images');

-- ============================================
-- FIX get_course_completion (accept total as param)
-- ============================================
CREATE OR REPLACE FUNCTION get_course_completion(p_user_id UUID, p_total_lessons INTEGER DEFAULT 95)
RETURNS NUMERIC AS $$
DECLARE
  completed_lessons INTEGER;
BEGIN
  SELECT COUNT(*) INTO completed_lessons
  FROM lesson_progress
  WHERE user_id = p_user_id AND completed = TRUE;

  IF p_total_lessons = 0 THEN RETURN 0; END IF;
  RETURN ROUND((completed_lessons::NUMERIC / p_total_lessons) * 100, 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
