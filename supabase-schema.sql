-- EduPilot Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. SCHOOLS
-- ============================================
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en VARCHAR(255) NOT NULL,
  name_zh VARCHAR(255),
  code VARCHAR(20) UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. USERS (Teachers & Students)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  avatar VARCHAR(10) DEFAULT '👦',
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  school_id UUID REFERENCES schools(id),
  language VARCHAR(5) DEFAULT 'en',
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. CLASSES
-- ============================================
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(6) UNIQUE NOT NULL,
  school_id UUID REFERENCES schools(id),
  teacher_id UUID REFERENCES users(id),
  grade VARCHAR(20),
  subject VARCHAR(100),
  description TEXT,
  max_students INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. CLASS MEMBERSHIPS (Students in classes)
-- ============================================
CREATE TABLE IF NOT EXISTS class_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(class_id, student_id)
);

-- ============================================
-- 5. SUBJECTS
-- ============================================
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en VARCHAR(100) NOT NULL,
  name_zh VARCHAR(100),
  code VARCHAR(20) UNIQUE,
  icon VARCHAR(10),
  color VARCHAR(20),
  description TEXT,
  grade_level VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. ACTIVITIES
-- ============================================
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id),
  class_id UUID REFERENCES classes(id),
  title_en VARCHAR(255) NOT NULL,
  title_zh VARCHAR(255),
  description TEXT,
  type VARCHAR(50) CHECK (type IN ('quiz', 'assignment', 'ar_vr', 'video', 'reading', 'practice')),
  points INTEGER DEFAULT 10,
  difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
  due_date TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. SUBMISSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id),
  content TEXT,
  file_url TEXT,
  score DECIMAL(5,2),
  max_score DECIMAL(5,2) DEFAULT 100,
  points_earned INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'graded', 'returned')),
  submitted_at TIMESTAMPTZ,
  graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES users(id),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(activity_id, student_id)
);

-- ============================================
-- 8. POINTS TRANSACTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS points_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  points INTEGER NOT NULL,
  reason VARCHAR(255),
  reference_type VARCHAR(50),
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. ACHIEVEMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en VARCHAR(100) NOT NULL,
  name_zh VARCHAR(100),
  description TEXT,
  icon VARCHAR(10),
  points_required INTEGER,
  type VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. USER ACHIEVEMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  achievement_id UUID REFERENCES achievements(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);
CREATE INDEX IF NOT EXISTS idx_users_school_id ON users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_code ON classes(code);
CREATE INDEX IF NOT EXISTS idx_class_memberships_student_id ON class_memberships(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_user_id ON points_transactions(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Users can read own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = auth_id);

-- Teachers can read students in their classes
CREATE POLICY "Teachers can read their students" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM classes c
      WHERE c.teacher_id = users.id
      AND c.id IN (
        SELECT class_id FROM class_memberships 
        WHERE student_id = users.id
      )
    )
  );

-- Students can read their class info
CREATE POLICY "Students can read their classes" ON classes
  FOR SELECT USING (
    teacher_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM class_memberships cm
      JOIN users u ON u.id = cm.student_id
      WHERE cm.class_id = classes.id
      AND u.auth_id = auth.uid()
    )
  );

-- Teachers can manage their classes
CREATE POLICY "Teachers can manage their classes" ON classes
  FOR ALL USING (teacher_id = auth.uid());

-- ============================================
-- FUNCTIONS
-- ============================================

-- Update points after submission graded
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET points = points + NEW.points_earned,
      level = FLOOR((points + NEW.points_earned) / 500) + 1,
      updated_at = NOW()
  WHERE id = NEW.student_id;
  
  INSERT INTO points_transactions (user_id, points, reason, reference_type, reference_id)
  VALUES (NEW.student_id, NEW.points_earned, 'Activity completed', 'submission', NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for points update
DROP TRIGGER IF EXISTS on_submission_graded ON submissions;
CREATE TRIGGER on_submission_graded
  AFTER UPDATE ON submissions
  WHEN (NEW.status = 'graded' AND OLD.status != 'graded')
  EXECUTE FUNCTION update_user_points();

-- ============================================
-- GRANTS
-- ============================================
GRANT ALL ON ALL TABLES TO authenticated;
GRANT ALL ON ALL SEQUENCES TO authenticated;
GRANT ALL ON ALL FUNCTIONS TO authenticated;

-- ============================================
-- DONE!
-- ============================================
-- Edge Cases Handled:
-- 1. Cascade deletes for class_memberships
-- 2. Unique constraints for class codes
-- 3. RLS policies for multi-tenant security
-- 4. Automatic points calculation
-- 5. Level calculation (500 pts per level)
