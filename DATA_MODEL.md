# EduPilot Data Model

## Overview

Simple, flat structure optimized for:
- Supabase PostgreSQL
- Row-Level Security (RLS) for multi-tenant safety
- JSONB for flexible activity content
- Real-time subscriptions for leaderboard updates

---

## Tables

### 1. Users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  class_id UUID REFERENCES classes(id),
  school_id UUID REFERENCES schools(id),
  level INTEGER DEFAULT 1,
  total_points INTEGER DEFAULT 0,
  avatar_url TEXT,
  badges JSONB DEFAULT '[]',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_users_class ON users(class_id);
CREATE INDEX idx_users_school ON users(school_id);
CREATE INDEX idx_users_points ON users(total_points DESC);
```

### 2. Schools

```sql
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  contact_email TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3. Classes

```sql
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id),
  name TEXT NOT NULL,
  grade_level INTEGER,
  teacher_id UUID REFERENCES users(id),
  academic_year TEXT,
  term TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_classes_teacher ON classes(teacher_id);
```

### 4. Subjects

```sql
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  category TEXT NOT NULL CHECK (category IN (
    'ar-vr',         -- AR/VR Experience
    'ai-tech',       -- AI & Technology
    'creativity',    -- Digital Creativity
    'design',        -- 3D Design
    'metaverse',     -- VR/Metaverse
    'dse'            -- DSE Prep
  )),
  grade_range TEXT, -- 'P1-S6', 'P4-S6', etc.
  icon TEXT,        -- emoji icon
  description TEXT,
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 5. Activities

```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id),
  title TEXT NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'learn',    -- Main lesson
    'build',    -- Create something
    'present'   -- Share/present work
  )),
  difficulty TEXT CHECK (difficulty IN ('basic', 'intermediate', 'advanced')),
  estimated_minutes INTEGER,
  instructions JSONB NOT NULL, -- Array of steps
  skill_goal TEXT,
  points_reward INTEGER DEFAULT 10,
  metadata JSONB DEFAULT '{}', -- Timer mode, templates, etc.
  created_by UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_activities_subject ON activities(subject_id);
CREATE INDEX idx_activities_type ON activities(activity_type);
```

**Example instructions JSONB:**
```json
{
  "steps": [
    {"step": 1, "title": "Read the task", "description": "Read carefully"},
    {"step": 2, "title": "Write answer", "description": "Type in the box"},
    {"step": 3, "title": "Check work", "description": "Verify your answer"}
  ]
}
```

### 6. Practice Sessions

```sql
CREATE TABLE practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) NOT NULL,
  activity_id UUID REFERENCES activities(id) NOT NULL,
  practice_type TEXT NOT NULL CHECK (practice_type IN (
    'ai', 'art', 'model', 'ar', 'vr'
  )),
  status TEXT NOT NULL CHECK (status IN (
    'draft',
    'in_progress',
    'submitted',
    'reviewed'
  )),
  attempts INTEGER DEFAULT 1,
  time_spent_seconds INTEGER,
  submission_id UUID REFERENCES submissions(id),
  checklist_progress JSONB DEFAULT '{}',
  score INTEGER,
  feedback TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  submitted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_practice_student ON practice_sessions(student_id);
CREATE INDEX idx_practice_status ON practice_sessions(status);
```

### 7. Submissions

```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) NOT NULL,
  activity_id UUID REFERENCES activities(id) NOT NULL,
  session_id UUID REFERENCES practice_sessions(id),
  content TEXT,
  attachments JSONB DEFAULT '[]', -- URLs to files
  teacher_notes TEXT,
  teacher_rating INTEGER CHECK (teacher_rating >= 1 AND teacher_rating <= 5),
  points_awarded INTEGER DEFAULT 0,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id)
);

CREATE INDEX idx_submissions_student ON submissions(student_id);
CREATE INDEX idx_submissions_activity ON submissions(activity_id);
```

### 8. Points (Leaderboard Engine)

```sql
CREATE TABLE points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN (
    'lesson_complete',
    'practice_complete',
    'project_submit',
    'help_peer',
    'bonus_on_time',
    'bonus_perfect',
    'manual_adjustment'
  )),
  reference_id UUID, -- submission_id, session_id, etc.
  season TEXT, -- '2026-term1', '2026-may', 'all-time'
  awarded_at TIMESTAMPTZ DEFAULT now(),
  awarded_by UUID REFERENCES users(id)
);

CREATE INDEX idx_points_user ON points(user_id);
CREATE INDEX idx_points_season ON points(season);
CREATE INDEX idx_points_awarded ON points(awarded_at DESC);
```

### 9. Point Rules (Configurable)

```sql
CREATE TABLE point_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id),
  reason TEXT NOT NULL UNIQUE,
  base_points INTEGER NOT NULL,
  multiplier_enabled BOOLEAN DEFAULT false,
  max_per_day INTEGER,
  description TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Default rules
INSERT INTO point_rules (reason, base_points, description) VALUES
  ('lesson_complete', 20, 'Complete a lesson'),
  ('practice_complete', 15, 'Finish practice activity'),
  ('project_submit', 30, 'Submit a project'),
  ('help_peer', 10, 'Help a classmate'),
  ('bonus_on_time', 10, 'Submit before deadline'),
  ('bonus_perfect', 20, 'Perfect score on activity');
```

### 10. Leaderboard Seasons

```sql
CREATE TABLE leaderboard_seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id),
  name TEXT NOT NULL,
  season_type TEXT CHECK (season_type IN ('term', 'month', 'custom')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true
);
```

---

## Views

### Leaderboard View

```sql
CREATE VIEW leaderboard_view AS
SELECT 
  u.id,
  u.display_name,
  u.level,
  u.avatar_url,
  c.name as class_name,
  COALESCE(SUM(p.points), 0) as total_points,
  RANK() OVER (PARTITION BY u.class_id ORDER BY COALESCE(SUM(p.points), 0) DESC) as rank
FROM users u
LEFT JOIN points p ON p.user_id = u.id
LEFT JOIN classes c ON c.id = u.class_id
WHERE u.role = 'student'
GROUP BY u.id, u.display_name, u.level, u.avatar_url, c.name, u.class_id;
```

### Student Progress View

```sql
CREATE VIEW student_progress_view AS
SELECT 
  u.id as student_id,
  u.display_name,
  COUNT(DISTINCT ps.id) as total_sessions,
  COUNT(DISTINCT s.id) as total_submissions,
  SUM(p.points) as total_points,
  COUNT(DISTINCT CASE WHEN ps.status = 'completed' THEN ps.id END) as completed_count
FROM users u
LEFT JOIN practice_sessions ps ON ps.student_id = u.id
LEFT JOIN submissions s ON s.student_id = u.id
LEFT JOIN points p ON p.user_id = u.id
WHERE u.role = 'student'
GROUP BY u.id, u.display_name;
```

---

## Row-Level Security (RLS)

```sql
-- Students can only see users in their class
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students see own class" ON users
  FOR SELECT
  USING (
    role = 'student' AND class_id = current_setting('request.jwt.claims.class_id')::uuid
    OR role = 'teacher'
  );

-- Students can only update their own records
CREATE POLICY "Users update own" ON users
  FOR UPDATE
  USING (id = current_setting('request.jwt.claims.sub')::uuid);

-- Teachers can manage their class
CREATE POLICY "Teachers manage class" ON practice_sessions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = current_setting('request.jwt.claims.sub')::uuid 
      AND role = 'teacher'
    )
  );
```

---

## Functions

### Award Points

```sql
CREATE OR REPLACE FUNCTION award_points(
  p_user_id UUID,
  p_points INTEGER,
  p_reason TEXT,
  p_reference_id UUID DEFAULT NULL,
  p_season TEXT DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO points (user_id, points, reason, reference_id, season)
  VALUES (p_user_id, p_points, p_reason, p_reference_id, p_season);
  
  UPDATE users 
  SET total_points = total_points + p_points,
      level = FLOOR((total_points + p_points) / 500) + 1
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Get Leaderboard

```sql
CREATE OR REPLACE FUNCTION get_class_leaderboard(
  p_class_id UUID,
  p_season TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 10
) RETURNS TABLE (
  student_id UUID,
  display_name TEXT,
  level INTEGER,
  total_points BIGINT,
  rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.display_name,
    u.level,
    COALESCE(SUM(p.points), 0)::BIGINT as total_points,
    RANK() OVER (ORDER BY COALESCE(SUM(p.points), 0) DESC) as rank
  FROM users u
  LEFT JOIN points p ON p.user_id = u.id 
    AND (p_season IS NULL OR p.season = p_season)
  WHERE u.class_id = p_class_id AND u.role = 'student'
  GROUP BY u.id, u.display_name, u.level
  ORDER BY total_points DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;
```

---

## TypeScript Types

```typescript
// lib/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface User {
  id: string
  email: string
  display_name: string
  role: 'student' | 'teacher' | 'admin'
  class_id: string | null
  school_id: string | null
  level: number
  total_points: number
  avatar_url: string | null
  badges: string[]
  settings: Json
  created_at: string
  updated_at: string
}

export interface Subject {
  id: string
  name: string
  code: string
  category: 'ar-vr' | 'ai-tech' | 'creativity' | 'design' | 'metaverse' | 'dse'
  grade_range: string
  icon: string
  description: string
  metadata: Json
  is_active: boolean
}

export interface Activity {
  id: string
  subject_id: string
  title: string
  activity_type: 'learn' | 'build' | 'present'
  difficulty: 'basic' | 'intermediate' | 'advanced'
  estimated_minutes: number
  instructions: {
    steps: Array<{
      step: number
      title: string
      description: string
    }>
  }
  skill_goal: string
  points_reward: number
  metadata: Json
  is_active: boolean
}

export interface PracticeSession {
  id: string
  student_id: string
  activity_id: string
  practice_type: 'ai' | 'art' | 'model' | 'ar' | 'vr'
  status: 'draft' | 'in_progress' | 'submitted' | 'reviewed'
  attempts: number
  time_spent_seconds: number | null
  submission_id: string | null
  checklist_progress: Json
  score: number | null
  feedback: string | null
  started_at: string
  submitted_at: string | null
  completed_at: string | null
}

export interface Submission {
  id: string
  student_id: string
  activity_id: string
  session_id: string | null
  content: string | null
  attachments: Array<{ url: string; type: string }>
  teacher_notes: string | null
  teacher_rating: number | null
  points_awarded: number
  submitted_at: string
  reviewed_at: string | null
  reviewed_by: string | null
}

export interface PointRule {
  reason: 'lesson_complete' | 'practice_complete' | 'project_submit' | 'help_peer' | 'bonus_on_time' | 'bonus_perfect'
  base_points: number
  description: string
}
```

---

## Sample Data

```sql
-- Sample School
INSERT INTO schools (id, name, code) VALUES
  ('school-1', 'LSI Learning Academy', 'LSI');

-- Sample Class
INSERT INTO classes (id, school_id, name, grade_level, academic_year, term) VALUES
  ('class-1', 'school-1', 'Primary 4 - Class A', 4, '2025-2026', 'Term 2');

-- Sample Teacher
INSERT INTO users (id, email, display_name, role, class_id, school_id) VALUES
  ('teacher-1', 'patrick@lsi.edu', 'Mr. Patrick', 'teacher', 'class-1', 'school-1');

-- Sample Students
INSERT INTO users (id, email, display_name, role, class_id, school_id, level, total_points) VALUES
  ('student-1', 'tommy@lsi.edu', 'Tommy Tsang', 'student', 'class-1', 'school-1', 9, 2050),
  ('student-2', 'emily@lsi.edu', 'Emily Chen', 'student', 'class-1', 'school-1', 12, 3240),
  ('student-3', 'jayden@lsi.edu', 'Jayden Lee', 'student', 'class-1', 'school-1', 11, 2890);

-- Sample Subjects
INSERT INTO subjects (id, name, category, grade_range, icon) VALUES
  ('subj-1', 'AR/VR Experience', 'ar-vr', 'P1-S6', '🥽'),
  ('subj-2', 'AI & Technology', 'ai-tech', 'P4-S6', '🤖'),
  ('subj-3', 'Digital Creativity', 'creativity', 'P1-S6', '🎨');
```

---

## Summary

**Core Tables:** 10
- users, schools, classes (authentication & org)
- subjects, activities (content)
- practice_sessions, submissions (student work)
- points, point_rules, leaderboard_seasons (gamification)

**Key Features:**
- ✅ Multi-tenant (schools, classes)
- ✅ Role-based access (student, teacher, admin)
- ✅ Flexible activity content (JSONB)
- ✅ Real-time leaderboard (PostgreSQL views + Supabase subscriptions)
- ✅ Seasonal leaderboards (term, month, custom)
- ✅ Configurable point rules (per school)
- ✅ Row-Level Security for data isolation

**Performance:**
- Indexes on frequently queried columns
- Materialized view option for leaderboard caching
- Supabase real-time for live updates


---

## Class Code System (May 2026 Update)

### Class Code Generation

Classes now have a unique 6-character code that students use to join:

```sql
-- Add to classes table
ALTER TABLE classes ADD COLUMN class_code TEXT UNIQUE NOT NULL;
ALTER TABLE classes ADD COLUMN max_students INTEGER DEFAULT 30;
ALTER TABLE classes ADD COLUMN subject_focus TEXT;

-- Generate unique code on insert
CREATE OR REPLACE FUNCTION generate_class_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code TEXT := '';
  exists BOOLEAN;
BEGIN
  LOOP
    code := '';
    FOR i IN 1..6 LOOP
      code := code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    
    SELECT EXISTS(SELECT 1 FROM classes WHERE class_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Auto-generate code on insert
CREATE TRIGGER generate_class_code_trigger
  BEFORE INSERT ON classes
  FOR EACH ROW
  EXECUTE FUNCTION set_class_code();

CREATE OR REPLACE FUNCTION set_class_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.class_code IS NULL OR NEW.class_code = '' THEN
    NEW.class_code := generate_class_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Student-Class Membership

Students can join multiple classes:

```sql
-- Many-to-many relationship
CREATE TABLE student_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  UNIQUE(student_id, class_id)
);

CREATE INDEX idx_student_classes_student ON student_classes(student_id);
CREATE INDEX idx_student_classes_class ON student_classes(class_id);
```

### Join Class API

```typescript
// Student joins class by code
async function joinClass(studentId: string, classCode: string) {
  const { data: classData, error } = await supabase
    .from('classes')
    .select('id, name, teacher_id, max_students')
    .eq('class_code', classCode.toUpperCase())
    .single();
  
  if (error || !classData) {
    return { error: 'Class not found' };
  }
  
  // Check if already joined
  const { data: existing } = await supabase
    .from('student_classes')
    .select('id')
    .eq('student_id', studentId)
    .eq('class_id', classData.id)
    .single();
  
  if (existing) {
    return { error: 'Already joined this class' };
  }
  
  // Check capacity
  const { count } = await supabase
    .from('student_classes')
    .select('id', { count: 'exact' })
    .eq('class_id', classData.id);
  
  if (count >= classData.max_students) {
    return { error: 'Class is full' };
  }
  
  // Join class
  const { error: joinError } = await supabase
    .from('student_classes')
    .insert({
      student_id: studentId,
      class_id: classData.id
    });
  
  if (joinError) {
    return { error: 'Failed to join class' };
  }
  
  return { 
    success: true, 
    class: classData 
  };
}
```

### Teacher Class Management

```typescript
// Teacher creates class
async function createClass(teacherId: string, classData: {
  name: string;
  grade_level: number;
  academic_year: string;
  term: string;
  max_students?: number;
  subject_focus?: string;
}) {
  const { data, error } = await supabase
    .from('classes')
    .insert({
      ...classData,
      teacher_id: teacherId,
      max_students: classData.max_students || 30
    })
    .select()
    .single();
  
  return { data, error };
}

// Teacher copies class code
function copyClassCode(classCode: string) {
  navigator.clipboard.writeText(classCode);
}

// Teacher regenerates class code
async function regenerateClassCode(classId: string) {
  const newCode = generateClassCode(); // Same logic as SQL function
  
  const { data, error } = await supabase
    .from('classes')
    .update({ class_code: newCode })
    .eq('id', classId)
    .select('class_code')
    .single();
  
  return { data, error };
}
```

### UI Flow

**Teacher Flow:**
1. Click "Create Class" → `/create-class`
2. Enter class details (name, grade, term, etc.)
3. System generates 6-character code (e.g., `P4CLS21`)
4. Teacher shares code with students
5. Teacher can regenerate code anytime

**Student Flow:**
1. Click "Join Class" → `/join-class`
2. Enter 6-character class code
3. System validates code
4. Student joins class → Success modal
5. Class appears in "My Classes" list

### Sample Data

```sql
-- Teacher creates class
INSERT INTO classes (id, school_id, name, grade_level, teacher_id, class_code, academic_year, term, max_students)
VALUES 
  ('class-1', 'school-1', 'Primary 4 - Class A', 4, 'teacher-1', 'P4CLS21', '2025-26', '2', 30),
  ('class-2', 'school-1', 'Primary 4 - Class B', 4, 'teacher-1', 'P4CLS22', '2025-26', '2', 30);

-- Student joins class
INSERT INTO student_classes (student_id, class_id)
VALUES 
  ('student-1', 'class-1'),
  ('student-2', 'class-1'),
  ('student-3', 'class-1');
```

### Security Rules

```sql
-- Students can only join active classes
CREATE POLICY "Students join active classes" ON student_classes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM classes 
      WHERE id = class_id 
      AND is_active = true
    )
  );

-- Students can see their own memberships
CREATE POLICY "Students see own classes" ON student_classes
  FOR SELECT
  USING (student_id = current_user_id());

-- Teachers can see all students in their classes
CREATE POLICY "Teachers see class students" ON student_classes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM classes
      WHERE id = class_id
      AND teacher_id = current_user_id()
    )
  );
```


---

## SQL Seed Data (May 2026)

### File: `supabase-seed.sql`

This file contains all demo data used in the platform:

**Schools (3):**
- LSI Learning Academy
- APlus Education Centre
- HK Future Learning Centre

**Teachers (3):**
- Mr. Patrick Siu (LSI)
- Ms. Sarah Wong (LSI)
- Mr. David Lee (APlus)

**Classes (4):**
- P4-A (P4CS21) - Mr. Patrick
- P4-B (P4CS22) - Mr. Patrick
- P5-A (P5CS11) - Ms. Sarah
- S1-A (S1CS01) - Mr. David

**Students (14):**
- Tommy, Emily, Jayden, Sophie, Ryan, Mia, Lucas, Chloe, Oscar, Ava (P4-A)
- Ethan, Hannah (P4-B)
- Nathan, Lily (P5-A)

**Subjects (6):**
- AR/VR Experience
- AI & Technology
- Digital Creativity
- 3D Design
- VR/Metaverse
- DSE Prep

**Activities (12):**
See table above for details

**Point Rules (6):**
- Lesson: 20 pts
- Practice: 15 pts
- Project: 30 pts
- Help peer: 10 pts
- On-time bonus: +10 pts
- Perfect score: +20 pts

---

## Running the SQL

### In Supabase SQL Editor:

1. Go to your Supabase project
2. Click "SQL Editor" in sidebar
3. Copy contents of `supabase-schema.sql` and run
4. Copy contents of `supabase-seed.sql` and run
5. Verify data with: `SELECT * FROM users LIMIT 10;`

### Via Supabase CLI:

```bash
# Initialize Supabase locally
supabase init

# Start local instance
supabase start

# Run migrations
supabase db push

# Seed data
supabase db seed
```

---

## Data Migration Notes

When moving from static HTML to Supabase:

1. **Authentication**
   - Use Supabase Auth for login
   - Email/password or OAuth providers
   - RLS policies enforce data access

2. **Read Data**
   - Replace static HTML with dynamic queries
   - Use Supabase client: `supabase.from('users').select()`
   - Subscribe to real-time updates

3. **Write Data**
   - Form submissions → Supabase insert
   - Use optimistic updates for better UX
   - Handle errors gracefully

4. **Real-time Updates**
   - Subscribe to leaderboard changes
   - Show live student progress
   - Instant notifications

