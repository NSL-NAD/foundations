export type UserRole = "student" | "admin";
export type ProductType = "course" | "kit" | "bundle";
export type PurchaseStatus = "pending" | "completed" | "refunded";
export type KitOrderStatus = "pending" | "shipped" | "delivered";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  user_id: string | null;
  email: string;
  stripe_customer_id: string | null;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  product_type: ProductType;
  amount_cents: number;
  currency: string;
  status: PurchaseStatus;
  created_at: string;
}

export interface KitOrder {
  id: string;
  purchase_id: string;
  user_id: string | null;
  email: string;
  shipping_name: string;
  shipping_address_line1: string;
  shipping_address_line2: string | null;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  status: KitOrderStatus;
  tracking_number: string | null;
  tracking_url: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_slug: string;
  module_slug: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at">>;
      };
      purchases: {
        Row: Purchase;
        Insert: Omit<Purchase, "id" | "created_at">;
        Update: Partial<Omit<Purchase, "id" | "created_at">>;
      };
      kit_orders: {
        Row: KitOrder;
        Insert: Omit<KitOrder, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<KitOrder, "id" | "created_at">>;
      };
      lesson_progress: {
        Row: LessonProgress;
        Insert: Omit<LessonProgress, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<LessonProgress, "id" | "created_at">>;
      };
    };
  };
}
