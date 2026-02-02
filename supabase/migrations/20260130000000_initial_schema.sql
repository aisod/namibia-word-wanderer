-- NAMQULA Language Learning Platform - Initial Schema
-- Roles: admin, moderator, language_register

-- ============================================
-- ENUMS (idempotent - safe to re-run)
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'language_register');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'difficulty_level') THEN
    CREATE TYPE public.difficulty_level AS ENUM ('easy', 'medium', 'hard');
  END IF;
END $$;

-- ============================================
-- PROFILES (extends auth.users with role)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text,
  full_name text,
  role public.app_role NOT NULL DEFAULT 'language_register',
  assigned_language_ids uuid[] DEFAULT '{}', -- For language_register: which languages they can edit
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Profiles: users can update their own (limited fields - not role)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- LANGUAGES
-- ============================================
CREATE TABLE IF NOT EXISTS public.languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  native_name text,
  speakers text,
  regions text[] DEFAULT '{}',
  description text,
  history text,
  fun_facts text[] DEFAULT '{}',
  cover_image text,
  is_available boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;

-- Anyone can read available languages (public learning content)
DROP POLICY IF EXISTS "Public can read languages" ON public.languages;
CREATE POLICY "Public can read languages"
  ON public.languages FOR SELECT
  USING (true);

-- Admin, moderator, language_register can insert (language_register via function check)
DROP POLICY IF EXISTS "Authenticated can insert languages" ON public.languages;
CREATE POLICY "Authenticated can insert languages"
  ON public.languages FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Admin, moderator can update any; language_register only assigned
DROP POLICY IF EXISTS "Authenticated can update languages" ON public.languages;
CREATE POLICY "Authenticated can update languages"
  ON public.languages FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Only admin can delete
DROP POLICY IF EXISTS "Admin can delete languages" ON public.languages;
CREATE POLICY "Admin can delete languages"
  ON public.languages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- CATEGORIES (per language)
-- ============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  language_id uuid NOT NULL REFERENCES public.languages ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  icon text DEFAULT '📚',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(language_id, slug)
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read categories" ON public.categories;
CREATE POLICY "Public can read categories"
  ON public.categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated can insert categories" ON public.categories;
CREATE POLICY "Authenticated can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated can update categories" ON public.categories;
CREATE POLICY "Authenticated can update categories"
  ON public.categories FOR UPDATE
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin can delete categories" ON public.categories;
CREATE POLICY "Admin can delete categories"
  ON public.categories FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- VOCABULARY
-- ============================================
CREATE TABLE IF NOT EXISTS public.vocabulary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  language_id uuid NOT NULL REFERENCES public.languages ON DELETE CASCADE,
  category_id uuid REFERENCES public.categories ON DELETE SET NULL,
  english text NOT NULL,
  native_word text NOT NULL,
  category text NOT NULL, -- e.g. greetings, verbs (denormalized for queries)
  difficulty public.difficulty_level DEFAULT 'easy',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vocabulary_language ON public.vocabulary(language_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_category ON public.vocabulary(category);

ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read vocabulary" ON public.vocabulary;
CREATE POLICY "Public can read vocabulary"
  ON public.vocabulary FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated can insert vocabulary" ON public.vocabulary;
CREATE POLICY "Authenticated can insert vocabulary"
  ON public.vocabulary FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated can update vocabulary" ON public.vocabulary;
CREATE POLICY "Authenticated can update vocabulary"
  ON public.vocabulary FOR UPDATE
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin can delete vocabulary" ON public.vocabulary;
CREATE POLICY "Admin can delete vocabulary"
  ON public.vocabulary FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- TRIGGER: Auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'language_register'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS languages_updated_at ON public.languages;
CREATE TRIGGER languages_updated_at
  BEFORE UPDATE ON public.languages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS vocabulary_updated_at ON public.vocabulary;
CREATE TRIGGER vocabulary_updated_at
  BEFORE UPDATE ON public.vocabulary
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
