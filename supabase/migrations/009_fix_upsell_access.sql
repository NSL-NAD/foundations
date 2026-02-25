-- 009: Fix upsell product type detection
-- The ai_chat_upsell purchases were not being matched by has_ai_chat_access,
-- meaning users who bought AI Chat through the post-checkout upsell flow
-- didn't get unlimited access.

CREATE OR REPLACE FUNCTION has_ai_chat_access(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM purchases
    WHERE user_id = p_user_id
    AND product_type IN ('ai_chat', 'ai_chat_upsell')
    AND status = 'completed'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
