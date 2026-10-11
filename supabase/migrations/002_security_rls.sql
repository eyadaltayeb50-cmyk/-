-- ========================================================================
-- Smart Campus (الحرم الذكي) - Row Level Security (RLS) Policies
-- Strict Multi-Tenant, Privacy, and Content Access Security
-- ========================================================================

-- Enable RLS on all tables
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lecture_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activation_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current user is admin/super_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'content_manager')
  );
$$;

-- Helper function: Check if current student is actively subscribed
CREATE OR REPLACE FUNCTION public.is_active_student()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND status = 'active'
      AND (subscription_expires_at IS NULL OR subscription_expires_at > NOW())
  );
$$;

-- -----------------------------------------------------------------------------
-- 1. PROFILES POLICIES
-- -----------------------------------------------------------------------------
-- Students can read their own profile, Admins can read all profiles
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- Users can update only their own profile, but cannot tamper with role or status
CREATE POLICY "Users can update non-sensitive profile fields"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (
    (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()) AND status = (SELECT status FROM public.profiles WHERE id = auth.uid()))
    OR public.is_admin()
  );

-- -----------------------------------------------------------------------------
-- 2. ACADEMIC STRUCTURE (Institutions, Depts, Years, Professors, Plans)
-- Public read access so students can register and view catalog
-- -----------------------------------------------------------------------------
CREATE POLICY "Public read active institutions" ON public.institutions FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Public read active departments" ON public.departments FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Public read active academic years" ON public.academic_years FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Public read professors" ON public.professors FOR SELECT USING (TRUE);
CREATE POLICY "Public read subscription plans" ON public.subscription_plans FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Public read platform settings" ON public.platform_settings FOR SELECT USING (TRUE);

-- -----------------------------------------------------------------------------
-- 3. SUBJECTS & STUDENT SELECTIONS
-- -----------------------------------------------------------------------------
CREATE POLICY "Public read active subjects" ON public.subjects FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Public read subject professors" ON public.subject_professors FOR SELECT USING (TRUE);

CREATE POLICY "Students manage own subject selections"
  ON public.student_subjects FOR ALL
  USING (auth.uid() = student_id OR public.is_admin())
  WITH CHECK (auth.uid() = student_id OR public.is_admin());

-- -----------------------------------------------------------------------------
-- 4. LECTURES & DRIVE RESOURCES (STRICT PAYWALL ACCESS)
-- Only ACTIVE subscribed students and administrators can view lectures and files!
-- -----------------------------------------------------------------------------
CREATE POLICY "Active students and admins read published lectures"
  ON public.lectures FOR SELECT
  USING (
    (public.is_active_student() AND is_published = TRUE)
    OR public.is_admin()
  );

CREATE POLICY "Active students and admins read lecture resources"
  ON public.lecture_resources FOR SELECT
  USING (
    (public.is_active_student() AND EXISTS (
      SELECT 1 FROM public.lectures l
      WHERE l.id = lecture_id AND l.is_published = TRUE
    ))
    OR public.is_admin()
  );

-- -----------------------------------------------------------------------------
-- 5. ANNOUNCEMENTS & EVENTS
-- -----------------------------------------------------------------------------
CREATE POLICY "Users read targeted published announcements"
  ON public.announcements FOR SELECT
  USING (is_published = TRUE OR public.is_admin());

CREATE POLICY "Users read non-cancelled events"
  ON public.events FOR SELECT
  USING (is_cancelled = FALSE OR public.is_admin());

-- -----------------------------------------------------------------------------
-- 6. ACTIVATION CODES (ADMIN ONLY READ / INSERT / UPDATE)
-- Students never select codes directly; they invoke activate_student_subscription
-- -----------------------------------------------------------------------------
CREATE POLICY "Admins manage activation codes"
  ON public.activation_codes FOR ALL
  USING (public.is_admin());

CREATE POLICY "Students view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = student_id OR public.is_admin());

-- -----------------------------------------------------------------------------
-- 7. TELEGRAM, PUSH & PREFERENCES (STUDENT PRIVATE)
-- -----------------------------------------------------------------------------
CREATE POLICY "Students view/manage own telegram connection"
  ON public.telegram_connections FOR ALL
  USING (auth.uid() = student_id OR public.is_admin())
  WITH CHECK (auth.uid() = student_id OR public.is_admin());

CREATE POLICY "Students manage own push subscriptions"
  ON public.push_subscriptions FOR ALL
  USING (auth.uid() = student_id OR public.is_admin())
  WITH CHECK (auth.uid() = student_id OR public.is_admin());

CREATE POLICY "Students manage own notification preferences"
  ON public.notification_preferences FOR ALL
  USING (auth.uid() = student_id OR public.is_admin())
  WITH CHECK (auth.uid() = student_id OR public.is_admin());

CREATE POLICY "Students view own notifications"
  ON public.notification_recipients FOR ALL
  USING (auth.uid() = student_id OR public.is_admin());
