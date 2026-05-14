-- EduPilot Seed Data
-- Run AFTER supabase-schema.sql

-- ============================================
-- 1. SCHOOLS
-- ============================================
INSERT INTO schools (id, name_en, name_zh, code) VALUES
  ('school-1', 'LSI Learning Academy', 'LSI 學習學院', 'LSI001'),
  ('school-2', 'Hong Kong Primary School', '香港小學', 'HKP002'),
  ('school-3', 'Kowloon International School', '九龍國際學校', 'KIS003');

-- ============================================
-- 2. SUBJECTS (All Primary Subjects)
-- ============================================
INSERT INTO subjects (id, name_en, name_zh, code, icon, color) VALUES
  ('subj-1', 'Chinese', '中文', 'CHI', '中', '#fef3c7'),
  ('subj-2', 'English', '英文', 'ENG', 'En', '#dbeafe'),
  ('subj-3', 'Mathematics', '數學', 'MATH', '123', '#dcfce7'),
  ('subj-4', 'General Studies', '常識', 'GS', '🌍', '#e0e7ff'),
  ('subj-5', 'Science', '科學', 'SCI', '🔬', '#fae8ff'),
  ('subj-6', 'Putonghua', '普通話', 'PTH', '普', '#fed7aa'),
  ('subj-7', 'Physical Education', '體育', 'PE', '⚽', '#fce7f3'),
  ('subj-8', 'Music', '音樂', 'MUS', '🎵', '#ccfbf1'),
  ('subj-9', 'Visual Arts', '視藝', 'VA', '🎨', '#fef3c7'),
  ('subj-10', 'Information Technology', '電腦', 'IT', '💻', '#cffafe'),
  ('subj-11', 'Library', '圖書', 'LIB', '📖', '#f3e8ff'),
  ('subj-12', 'Bible Studies', '聖經', 'BIB', '✝️', '#fee2e2');

-- ============================================
-- 3. TEACHERS
-- ============================================
INSERT INTO users (id, email, full_name, display_name, avatar, role, school_id, language, points, level) VALUES
  ('teacher-1', 'patrick@lsistream.ai', 'Mr. Patrick Siu', 'Mr. Patrick', '👨‍🏫', 'teacher', 'school-1', 'en', 5000, 10),
  ('teacher-2', 'wong@lsistream.ai', 'Ms. Wendy Wong', 'Ms. Wong', '👩‍🏫', 'teacher', 'school-1', 'zh', 4500, 9),
  ('teacher-3', 'chen@lsistream.ai', 'Mr. David Chen', 'Mr. Chen', '👨‍🏫', 'teacher', 'school-2', 'en', 4000, 8);

-- ============================================
-- 4. CLASSES
-- ============================================
INSERT INTO classes (id, name, code, school_id, teacher_id, grade, subject) VALUES
  ('class-1', 'Primary 4 - Class A', 'P4CS21', 'school-1', 'teacher-1', 'P4', 'Chinese, Math'),
  ('class-2', 'Primary 4 - Class B', 'P4CS22', 'school-1', 'teacher-1', 'P4', 'Chinese, Math'),
  ('class-3', 'Primary 5 - Class A', 'P5CS11', 'school-1', 'teacher-2', 'P5', 'English, Science');

-- ============================================
-- 5. STUDENTS
-- ============================================
INSERT INTO users (id, email, full_name, display_name, avatar, role, school_id, language, points, level) VALUES
  ('student-1', 'tommy@edu.test', 'Tommy Tsang', 'Tommy', '👦', 'student', 'school-1', 'en', 2050, 9),
  ('student-2', 'emily@edu.test', 'Emily Wong', 'Emily', '👧', 'student', 'school-1', 'zh', 3240, 12),
  ('student-3', 'jason@edu.test', 'Jason Lee', 'Jason', '👦', 'student', 'school-1', 'en', 2890, 11),
  ('student-4', 'sarah@edu.test', 'Sarah Chan', 'Sarah', '👧', 'student', 'school-1', 'en', 2340, 10),
  ('student-5', 'michael@edu.test', 'Michael Ng', 'Michael', '👦', 'student', 'school-1', 'en', 1870, 8),
  ('student-6', 'hannah@edu.test', 'Hannah Yip', 'Hannah', '👧', 'student', 'school-1', 'zh', 1720, 8),
  ('student-7', 'david@edu.test', 'David Chan', 'David', '👦', 'student', 'school-1', 'en', 1580, 7),
  ('student-8', 'jessica@edu.test', 'Jessica Ho', 'Jessica', '👧', 'student', 'school-1', 'en', 1450, 7),
  ('student-9', 'ryan@edu.test', 'Ryan Tam', 'Ryan', '👦', 'student', 'school-2', 'en', 1320, 6),
  ('student-10', 'nicole@edu.test', 'Nicole Fong', 'Nicole', '👧', 'student', 'school-2', 'zh', 1280, 6);

-- ============================================
-- 6. CLASS MEMBERSHIPS
-- ============================================
INSERT INTO class_memberships (class_id, student_id) VALUES
  -- P4A students
  ('class-1', 'student-1'),
  ('class-1', 'student-2'),
  ('class-1', 'student-4'),
  ('class-1', 'student-6'),
  ('class-1', 'student-8'),
  ('class-1', 'student-10'),
  -- P4B students
  ('class-2', 'student-3'),
  ('class-2', 'student-5'),
  ('class-2', 'student-7'),
  ('class-2', 'student-9'),
  -- P5A students
  ('class-3', 'student-2'),
  ('class-3', 'student-3'),
  ('class-3', 'student-6'),
  ('class-3', 'student-8');

-- ============================================
-- 7. ACTIVITIES
-- ============================================
INSERT INTO activities (id, subject_id, class_id, title_en, title_zh, type, points, difficulty, created_by) VALUES
  ('act-1', 'subj-1', 'class-1', 'Chinese Reading Comprehension', '中文閱讀理解', 'quiz', 15, 'medium', 'teacher-1'),
  ('act-2', 'subj-3', 'class-1', 'Math Problem Solving', '數學解難', 'quiz', 20, 'hard', 'teacher-1'),
  ('act-3', 'subj-2', 'class-1', 'English Grammar Quiz', '英文語法測驗', 'quiz', 10, 'easy', 'teacher-1'),
  ('act-4', 'subj-4', 'class-2', 'Science Exploration', '科學探索', 'ar_vr', 25, 'medium', 'teacher-1'),
  ('act-5', 'subj-3', 'class-2', 'Math Practice Set 1', '數學練習一', 'practice', 15, 'easy', 'teacher-1'),
  ('act-6', 'subj-2', 'class-3', 'English Writing Assignment', '英文寫作', 'assignment', 30, 'hard', 'teacher-2');

-- ============================================
-- 8. SUBMISSIONS
-- ============================================
INSERT INTO submissions (activity_id, student_id, score, max_score, points_earned, status, submitted_at, graded_at, graded_by) VALUES
  ('act-1', 'student-1', 85.0, 100.0, 13, 'graded', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', 'teacher-1'),
  ('act-1', 'student-2', 98.0, 100.0, 15, 'graded', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', 'teacher-1'),
  ('act-2', 'student-1', 72.0, 100.0, 14, 'graded', NOW() - INTERVAL '1 day', NOW(), 'teacher-1'),
  ('act-2', 'student-2', 95.0, 100.0, 19, 'graded', NOW() - INTERVAL '1 day', NOW(), 'teacher-1'),
  ('act-3', 'student-4', 90.0, 100.0, 9, 'graded', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days', 'teacher-1');

-- ============================================
-- 9. ACHIEVEMENTS
-- ============================================
INSERT INTO achievements (id, name_en, name_zh, description, icon, points_required, type) VALUES
  ('ach-1', 'First Steps', '第一步', 'Complete your first activity', '🎯', 10, 'milestone'),
  ('ach-2', 'Quick Learner', '快速學習者', 'Complete 10 activities', '📚', 100, 'milestone'),
  ('ach-3', 'Top Scorer', '高分王', 'Get 100% on any quiz', '💯', 0, 'performance'),
  ('ach-4', 'Rising Star', '新星', 'Reach Level 5', '⭐', 2000, 'level'),
  ('ach-5', 'Math Master', '數學大師', 'Complete 5 Math activities', '🔢', 0, 'subject'),
  ('ach-6', 'AR Explorer', 'AR 探索者', 'Complete an AR/VR activity', '🥽', 0, 'special');

-- ============================================
-- 10. USER ACHIEVEMENTS
-- ============================================
INSERT INTO user_achievements (user_id, achievement_id, earned_at) VALUES
  ('student-1', 'ach-1', NOW() - INTERVAL '5 days'),
  ('student-1', 'ach-4', NOW() - INTERVAL '2 days'),
  ('student-2', 'ach-1', NOW() - INTERVAL '7 days'),
  ('student-2', 'ach-2', NOW() - INTERVAL '3 days'),
  ('student-2', 'ach-3', NOW() - INTERVAL '1 day');

-- ============================================
-- DONE! Sample data created
-- ============================================
