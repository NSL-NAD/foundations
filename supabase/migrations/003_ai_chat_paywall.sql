-- AI Chat Paywall: RPC functions + constraint update
-- Run this in the Supabase SQL Editor

-- ============================================
-- UPDATE PURCHASES CONSTRAINT
-- Allow 'ai_chat' as a product_type
-- ============================================
ALTER TABLE purchases DROP CONSTRAINT IF EXISTS purchases_product_type_check;
ALTER TABLE purchases ADD CONSTRAINT purchases_product_type_check
  CHECK (product_type IN ('course', 'kit', 'bundle', 'ai_chat'));

-- ============================================
-- RPC: Count user's chat messages
-- Used for free tier limit tracking
-- ============================================
CREATE OR REPLACE FUNCTION get_chat_message_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER FROM chat_messages cm
    JOIN chat_conversations cc ON cm.conversation_id = cc.id
    WHERE cc.user_id = p_user_id AND cm.role = 'user'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- RPC: Check if user has paid for AI Chat
-- Returns TRUE if user has a completed ai_chat purchase
-- ============================================
CREATE OR REPLACE FUNCTION has_ai_chat_access(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM purchases
    WHERE user_id = p_user_id
    AND product_type = 'ai_chat'
    AND status = 'completed'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
