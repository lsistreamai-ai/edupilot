-- EduPilot Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- CLASSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
  subject TEXT NOT NULL CHECK (subject IN ('Chinese', 'English', 'Math', 'Science')),
  grade_level TEXT DEFAULT 'P4',
  schedule TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast class code lookup
CREATE INDEX IF NOT EXISTS idx_classes_code ON classes(code);
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_id);

-- ============================================
-- ENROLLMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, class_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_class ON enrollments(class_id);

-- ============================================
-- ACTIVITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('quiz', 'video', 'worksheet')),
  content JSONB DEFAULT '{}',
  due_date TIMESTAMPTZ,
  points INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activities_class ON activities(class_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);

-- ============================================
-- SUBMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'graded')),
  answers JSONB DEFAULT '{}',
  score INTEGER,
  feedback TEXT,
  submitted_at TIMESTAMPTZ,
  graded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(activity_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_activity ON submissions(activity_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Classes: Teachers can manage their own, students can view
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage own classes" ON classes
  FOR ALL USING (
    teacher_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Students can view enrolled classes" ON classes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM enrollments WHERE user_id = auth.uid() AND class_id = classes.id)
  );

-- Enrollments: Users can view own enrollments
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own enrollments" ON enrollments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Teachers can view class enrollments" ON enrollments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM classes WHERE id = class_id AND teacher_id = auth.uid())
  );

-- Activities: Teachers manage, students view
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage class activities" ON activities
  FOR ALL USING (
    EXISTS (SELECT 1 FROM classes WHERE id = class_id AND teacher_id = auth.uid())
  );

CREATE POLICY "Students can view enrolled class activities" ON activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM enrollments 
      WHERE user_id = auth.uid() 
      AND class_id = activities.class_id
    )
  );

-- Submissions: Users manage own, teachers view class submissions
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own submissions" ON submissions
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Teachers can view class submissions" ON submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM activities a
      JOIN classes c ON c.id = a.class_id
      WHERE a.id = activity_id AND c.teacher_id = auth.uid()
    )
  );

-- ============================================
-- UPDATED AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- DEMO DATA (Optional - for testing)
-- ============================================

-- -- Sample Classes (run after you login as teacher)
-- INSERT INTO classes (name, code, teacher_id, subject, grade_level) VALUES
-- ('P4A - Chinese 中文', 'P4CS21', 'YOUR_USER_ID', 'Chinese', 'P4'),
-- ('P4B - Math 數學', 'P4CS22', 'YOUR_USER_ID', 'Math', 'P4'),
-- ('P5A - Chinese 中文', 'P5CS11', 'YOUR_USER_ID', 'Chinese', 'P5');

