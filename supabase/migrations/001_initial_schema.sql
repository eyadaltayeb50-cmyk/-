-- ========================================================================
-- Smart Campus (الحرم الذكي) - PostgreSQL Database Schema for Supabase
-- Initial Schema & Atomic Stored Procedures
-- ========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. INSTITUTIONS TABLE
CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    code TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (institution_id, slug)
);

-- 3. ACADEMIC YEARS TABLE (الفرق الدراسية)
CREATE TABLE IF NOT EXISTS public.academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    year_number INT NOT NULL CHECK (year_number BETWEEN 1 AND 7),
    term TEXT NOT NULL DEFAULT 'first' CHECK (term IN ('first', 'second', 'full')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (department_id, year_number, term)
);

-- 4. PROFESSORS TABLE (أعضاء هيئة التدريس)
CREATE TABLE IF NOT EXISTS public.professors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT 'دكتور',
    bio TEXT,
    avatar_url TEXT,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SUBJECTS TABLE (المواد الدراسية)
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    credit_hours INT DEFAULT 3,
    icon TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (academic_year_id, code)
);

-- 6. SUBJECT PROFESSORS (علاقة المادة بالدكتور)
CREATE TABLE IF NOT EXISTS public.subject_professors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    professor_id UUID NOT NULL REFERENCES public.professors(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (subject_id, professor_id)
);

-- 7. PROFILES (ملفات الطلاب والمشرفين - مرتبطة مع Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL CHECK (phone ~ '^01[0125][0-9]{8}$'),
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'content_manager', 'admin', 'super_admin')),
    status TEXT NOT NULL DEFAULT 'pending_activation' CHECK (status IN ('pending_activation', 'active', 'expired', 'suspended', 'banned')),
    institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE SET NULL,
    avatar_url TEXT,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    subscription_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. STUDENT SUBJECT SELECTIONS (اختيارات الطالب للمواد والدكاترة)
CREATE TABLE IF NOT EXISTS public.student_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    professor_id UUID REFERENCES public.professors(id) ON DELETE SET NULL,
    selected_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (student_id, subject_id)
);

-- 9. LECTURES (المحاضرات)
CREATE TABLE IF NOT EXISTS public.lectures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    professor_id UUID REFERENCES public.professors(id) ON DELETE SET NULL,
    lecture_number INT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. LECTURE RESOURCES (ملفات المحاضرة عبر Google Drive)
CREATE TABLE IF NOT EXISTS public.lecture_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lecture_id UUID NOT NULL REFERENCES public.lectures(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('pdf', 'audio', 'video', 'summary', 'assignment', 'link', 'other')),
    drive_url TEXT NOT NULL,
    file_size TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ANNOUNCEMENTS (الإعلانات)
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('urgent', 'high', 'normal')),
    is_pinned BOOLEAN DEFAULT FALSE,
    target_type TEXT NOT NULL DEFAULT 'all' CHECK (target_type IN ('all', 'institution', 'department', 'academic_year', 'subject', 'professor')),
    target_id UUID,
    is_published BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. EVENTS (المواعيد والتقويم الدراسي)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT NOT NULL CHECK (event_type IN ('lecture', 'section', 'exam', 'assignment', 'revision', 'holiday', 'general')),
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location_or_link TEXT,
    target_type TEXT NOT NULL DEFAULT 'academic_year' CHECK (target_type IN ('all', 'institution', 'department', 'academic_year', 'subject')),
    target_id UUID,
    is_cancelled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. SUBSCRIPTION PLANS (باقات الاشتراكات)
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    duration_type TEXT NOT NULL CHECK (duration_type IN ('permanent', 'monthly', 'term', 'yearly', 'custom')),
    duration_days INT NOT NULL,
    price_egp NUMERIC(10, 2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. ACTIVATION CODES (أكواد التفعيل)
CREATE TABLE IF NOT EXISTS public.activation_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    plan_id UUID NOT NULL REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
    duration_days INT NOT NULL,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'used', 'disabled', 'expired')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    used_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. STUDENT SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    code_id UUID NOT NULL REFERENCES public.activation_codes(id) ON DELETE RESTRICT,
    plan_id UUID NOT NULL REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. TELEGRAM CONNECTIONS
CREATE TABLE IF NOT EXISTS public.telegram_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    telegram_user_id BIGINT UNIQUE,
    telegram_username TEXT,
    linking_token TEXT UNIQUE,
    token_expires_at TIMESTAMPTZ,
    is_linked BOOLEAN DEFAULT FALSE,
    linked_at TIMESTAMPTZ,
    last_delivery_status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. WEB PUSH SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    keys_p256dh TEXT NOT NULL,
    keys_auth TEXT NOT NULL,
    device_name TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (student_id, endpoint)
);

-- 18. NOTIFICATION PREFERENCES
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lectures_enabled BOOLEAN DEFAULT TRUE,
    resources_enabled BOOLEAN DEFAULT TRUE,
    announcements_enabled BOOLEAN DEFAULT TRUE,
    events_enabled BOOLEAN DEFAULT TRUE,
    subscriptions_enabled BOOLEAN DEFAULT TRUE,
    telegram_enabled BOOLEAN DEFAULT TRUE,
    webpush_enabled BOOLEAN DEFAULT TRUE,
    subject_overrides JSONB DEFAULT '{}'::JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. NOTIFICATIONS & RECIPIENTS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('new_lecture', 'new_resource', 'announcement', 'new_event', 'event_update', 'event_cancel', 'admin_alert', 'subscription_alert')),
    target_url TEXT,
    target_type TEXT NOT NULL DEFAULT 'all',
    target_id UUID,
    priority TEXT DEFAULT 'normal',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notification_recipients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (notification_id, student_id)
);

-- 20. NOTIFICATION JOBS (Queue for Telegram / Push dispatch)
CREATE TABLE IF NOT EXISTS public.notification_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
    recipient_student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    channel TEXT NOT NULL CHECK (channel IN ('telegram', 'webpush')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed', 'retrying')),
    idempotency_key TEXT UNIQUE NOT NULL,
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 3,
    last_error TEXT,
    scheduled_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- 21. PLATFORM SETTINGS
CREATE TABLE IF NOT EXISTS public.platform_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. ADMIN ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ========================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_dept_year ON public.profiles(department_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_student_subjects_student ON public.student_subjects(student_id);
CREATE INDEX IF NOT EXISTS idx_lectures_subject ON public.lectures(subject_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_activation_codes_code ON public.activation_codes(code);
CREATE INDEX IF NOT EXISTS idx_activation_codes_status ON public.activation_codes(status);
CREATE INDEX IF NOT EXISTS idx_notification_jobs_status ON public.notification_jobs(status);
CREATE INDEX IF NOT EXISTS idx_notification_recipients_student ON public.notification_recipients(student_id, is_read);

-- ========================================================================
-- ATOMIC STORED PROCEDURE: ACTIVATE STUDENT SUBSCRIPTION
-- Prevents race conditions and double-spending of activation codes
-- ========================================================================
CREATE OR REPLACE FUNCTION public.activate_student_subscription(
    p_user_id UUID,
    p_code TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_code_record RECORD;
    v_new_expiry TIMESTAMPTZ;
    v_subscription_id UUID;
    v_current_expiry TIMESTAMPTZ;
BEGIN
    -- Normalize code string
    p_code := UPPER(TRIM(p_code));

    -- Lock the code row atomically
    SELECT * INTO v_code_record
    FROM public.activation_codes
    WHERE code = p_code
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error_code', 'NOT_FOUND', 'message', 'كود التفعيل غير صحيح أو غير موجود');
    END IF;

    IF v_code_record.status <> 'available' THEN
        RETURN jsonb_build_object('success', false, 'error_code', 'ALREADY_USED_OR_DISABLED', 'message', 'عفواً، هذا الكود تم استخدامه من قبل أو تم إيقافه');
    END IF;

    -- Check if code itself is past expiration date
    IF v_code_record.expires_at IS NOT NULL AND v_code_record.expires_at < NOW() THEN
        UPDATE public.activation_codes SET status = 'expired' WHERE id = v_code_record.id;
        RETURN jsonb_build_object('success', false, 'error_code', 'EXPIRED_CODE', 'message', 'عفواً، انتهت صلاحية هذا الكود');
    END IF;

    -- Calculate expiration time (if permanent, 100 years ahead; else now() + duration_days)
    SELECT subscription_expires_at INTO v_current_expiry
    FROM public.profiles
    WHERE id = p_user_id;

    IF v_code_record.duration_days = 0 THEN
        -- Permanent
        v_new_expiry := NOW() + INTERVAL '100 years';
    ELSE
        -- If already active with future expiration, extend it; otherwise start from NOW()
        IF v_current_expiry IS NOT NULL AND v_current_expiry > NOW() THEN
            v_new_expiry := v_current_expiry + (v_code_record.duration_days || ' days')::INTERVAL;
        ELSE
            v_new_expiry := NOW() + (v_code_record.duration_days || ' days')::INTERVAL;
        END IF;
    END IF;

    -- Mark code as used
    UPDATE public.activation_codes
    SET status = 'used',
        used_by = p_user_id,
        used_at = NOW()
    WHERE id = v_code_record.id;

    -- Create subscription record
    INSERT INTO public.subscriptions (
        student_id,
        code_id,
        plan_id,
        started_at,
        expires_at,
        status
    ) VALUES (
        p_user_id,
        v_code_record.id,
        v_code_record.plan_id,
        NOW(),
        v_new_expiry,
        'active'
    ) RETURNING id INTO v_subscription_id;

    -- Update profile status to active
    UPDATE public.profiles
    SET status = 'active',
        subscription_expires_at = v_new_expiry,
        updated_at = NOW()
    WHERE id = p_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'subscription_id', v_subscription_id,
        'expires_at', v_new_expiry,
        'duration_days', v_code_record.duration_days,
        'message', 'تم تفعيل حسابك بنجاح! مرحباً بك في الحرم الذكي'
    );
END;
$$;
