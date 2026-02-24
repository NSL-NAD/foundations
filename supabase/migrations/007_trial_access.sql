-- 007: Trial access tier system
-- Allows users to sign up and access the Welcome module for free.
-- Full course access requires a purchase (course or bundle).

-- 1. Add trial tracking column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ;

-- 2. New RPC: returns access tier as text ('full', 'trial', or NULL)
CREATE OR REPLACE FUNCTION get_course_access_tier(p_user_id UUID)
RETURNS TEXT AS $$
BEGIN
  -- Check for full access (purchased course or bundle)
  IF EXISTS (
    SELECT 1 FROM purchases
    WHERE user_id = p_user_id
    AND product_type IN ('course', 'bundle')
    AND status = 'completed'
  ) THEN
    RETURN 'full';
  END IF;

  -- If user exists in profiles, they get trial access
  IF EXISTS (
    SELECT 1 FROM profiles WHERE id = p_user_id
  ) THEN
    -- Set trial_started_at on first access
    UPDATE profiles
    SET trial_started_at = NOW()
    WHERE id = p_user_id AND trial_started_at IS NULL;

    RETURN 'trial';
  END IF;

  -- No access
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Admin helper: count trial users (signed up, no course/bundle purchase)
CREATE OR REPLACE FUNCTION get_trial_users_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER FROM profiles p
    WHERE NOT EXISTS (
      SELECT 1 FROM purchases pu
      WHERE pu.user_id = p.id
      AND pu.product_type IN ('course', 'bundle')
      AND pu.status = 'completed'
    )
    AND p.role != 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
