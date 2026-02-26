-- 010: Allow upsell product types in purchases table
-- The checkout flow creates sessions with 'kit_upsell' and 'ai_chat_upsell'
-- product types, but the DB constraint only allowed:
--   course, kit, bundle, ai_chat
-- This caused the webhook insert to fail with a constraint violation.

ALTER TABLE purchases DROP CONSTRAINT IF EXISTS purchases_product_type_check;
ALTER TABLE purchases ADD CONSTRAINT purchases_product_type_check
  CHECK (product_type IN ('course', 'kit', 'bundle', 'ai_chat', 'kit_upsell', 'ai_chat_upsell'));
