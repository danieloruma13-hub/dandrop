-- =============================================
-- DANDROP SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS TABLE (extends Supabase auth.users)
-- =============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  trial_started_at TIMESTAMPTZ DEFAULT NOW(),
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  is_trial_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PLANS TABLE
-- =============================================
CREATE TABLE public.plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL, -- starter, pro, business
  display_name TEXT NOT NULL,
  price_monthly INTEGER NOT NULL, -- in cents (1900, 4900, 9900)
  stripe_price_id TEXT, -- add after Stripe setup
  max_stores INTEGER, -- NULL = unlimited
  max_products_per_day INTEGER, -- NULL = unlimited
  features JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SUBSCRIPTIONS TABLE
-- =============================================
CREATE TABLE public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.plans(id) NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'trialing', -- trialing, active, past_due, canceled, expired
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- STORES TABLE
-- =============================================
CREATE TABLE public.stores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  shopify_domain TEXT,
  shopify_access_token TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SEED PLANS DATA
-- =============================================
INSERT INTO public.plans (name, display_name, price_monthly, max_stores, max_products_per_day, features) VALUES
(
  'starter',
  'Starter',
  1900,
  1,
  10,
  '[
    "1 Shopify store",
    "Product research (10 products/day)",
    "Basic supplier monitoring",
    "Auto order fulfillment",
    "Email customer updates",
    "Profit tracking dashboard",
    "7 day free trial"
  ]'::jsonb
),
(
  'pro',
  'Pro',
  4900,
  3,
  50,
  '[
    "3 Shopify stores",
    "Product research (50 products/day)",
    "Advanced supplier monitoring + alerts",
    "Auto order fulfillment",
    "Email + SMS customer updates",
    "Profit tracking + weekly reports",
    "Store scheduler & planner",
    "Competitor tracking",
    "Priority support",
    "7 day free trial"
  ]'::jsonb
),
(
  'business',
  'Business',
  9900,
  NULL,
  NULL,
  '[
    "Unlimited Shopify stores",
    "Unlimited product research",
    "Real time supplier monitoring + auto switch",
    "Auto order fulfillment",
    "Email + SMS + WhatsApp updates",
    "Full profit analytics + custom reports",
    "Store scheduler & planner",
    "Competitor tracking",
    "Multi store dashboard",
    "API access",
    "Dedicated support",
    "7 day free trial"
  ]'::jsonb
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see/edit their own
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Subscriptions: users can only see their own
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Stores: users can only manage their own
CREATE POLICY "Users can manage own stores" ON public.stores
  FOR ALL USING (auth.uid() = user_id);

-- Plans are public
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Plans are viewable by everyone" ON public.plans
  FOR SELECT USING (true);

-- =============================================
-- FUNCTION: Auto create profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- FUNCTION: Check if trial is still active
-- =============================================
CREATE OR REPLACE FUNCTION public.check_trial_status(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  trial_end TIMESTAMPTZ;
BEGIN
  SELECT trial_ends_at INTO trial_end
  FROM public.profiles
  WHERE id = user_id;

  IF trial_end > NOW() THEN
    RETURN TRUE;
  ELSE
    UPDATE public.profiles SET is_trial_active = FALSE WHERE id = user_id;
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
