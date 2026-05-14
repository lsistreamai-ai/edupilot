-- ============================================
-- EduPilot Demo Data Seed
-- ============================================

-- Schools
INSERT INTO schools (id, name, code, contact_email) VALUES
  ('school-1', 'LSI Learning Academy', 'LSI', 'contact@lsi.edu.hk'),
  ('school-2', 'APlus Education Centre', 'APLUS', 'info@aplus.edu.hk'),
  ('school-3', 'HK Future Learning Centre', 'HKFL', 'admin@hkfl.edu.hk');

-- Teachers
INSERT INTO users (id, email, display_name, role, school_id, avatar_url, created_at) VALUES
  ('teacher-1', 'patrick@lsi.edu', 'Mr. Patrick Siu', 'teacher', 'school-1', '👨‍🏫', '2025-09-01'),
  ('teacher-2', 'sarah@lsi.edu', 'Ms. Sarah Wong', 'teacher', 'school-1', '👩‍🏫', '2025-09-01'),
  ('teacher-3', 'david@aplus.edu', 'Mr. David Lee', 'teacher', 'school-2', '👨‍🏫', '2025-09-01');

-- Classes
INSERT INTO classes (
  id, school_id, name, grade_level, teacher_id, 
  class_code, academic_year, term, max_students, subject_focus
) VALUES
  ('class-1', 'school-1', 'Primary 4 - Class A', 4, 'teacher-1', 'P4CS21', '2025-26', '2', 30, 'all'),
  ('class-2', 'school-1', 'Primary 4 - Class B', 4, 'teacher-1', 'P4CS22', '2025-26', '2', 30, 'all'),
  ('class-3', 'school-1', 'Primary 5 - Class A', 5, 'teacher-2', 'P5CS11', '2025-26', '2', 28, 'all'),
  ('class-4', 'school-2', 'Secondary 1 - Class A', 7, 'teacher-3', 'S1CS01', '2025-26', '2', 32, 'dse');

-- Students
INSERT INTO users (id, email, display_name, role, class_id, school_id, level, total_points, avatar_url, created_at) VALUES
  ('student-1', 'tommy@lsi.edu', 'Tommy Tsang', 'student', 'class-1', 'school-1', 9, 2050, '👦', '2025-09-01'),
  ('student-2', 'emily@lsi.edu', 'Emily Chen', 'student', 'class-1', 'school-1', 12, 3240, '👧', '2025-09-01'),
  ('student-3', 'jayden@lsi.edu', 'Jayden Lee', 'student', 'class-1', 'school-1', 11, 2890, '👦', '2025-09-01'),
  ('student-4', 'sophie@lsi.edu', 'Sophie Wong', 'student', 'class-1', 'school-1', 10, 2670, '👧', '2025-09-01'),
  ('student-5', 'ryan@lsi.edu', 'Ryan Ng', 'student', 'class-1', 'school-1', 8, 1820, '👦', '2025-09-01'),
  ('student-6', 'mia@lsi.edu', 'Mia Lam', 'student', 'class-1', 'school-1', 8, 1680, '👧', '2025-09-01'),
  ('student-7', 'lucas@lsi.edu', 'Lucas Ho', 'student', 'class-1', 'school-1', 7, 1540, '👦', '2025-09-01'),
  ('student-8', 'chloe@lsi.edu', 'Chloe Chan', 'student', 'class-1', 'school-1', 7, 1420, '👧', '2025-09-01'),
  ('student-9', 'oscar@lsi.edu', 'Oscar Yip', 'student', 'class-1', 'school-1', 6, 1290, '👦', '2025-09-01'),
  ('student-10', 'ava@lsi.edu', 'Ava Tsang', 'student', 'class-1', 'school-1', 6, 1180, '👧', '2025-09-01'),
  ('student-11', 'ethan@lsi.edu', 'Ethan Mak', 'student', 'class-2', 'school-1', 8, 1750, '👦', '2025-09-01'),
  ('student-12', 'hannah@lsi.edu', 'Hannah Tang', 'student', 'class-2', 'school-1', 7, 1600, '👧', '2025-09-01'),
  ('student-13', 'nathan@lsi.edu', 'Nathan Cheng', 'student', 'class-3', 'school-1', 10, 2100, '👦', '2025-09-01'),
  ('student-14', 'lily@lsi.edu', 'Lily Chiu', 'student', 'class-3', 'school-1', 9, 1950, '👧', '2025-09-01');

-- Subjects
INSERT INTO subjects (id, name, code, category, grade_range, icon, description) VALUES
  ('subj-1', 'AR/VR Experience', 'ARVR', 'ar-vr', 'P1-S6', '🥽', 'Explore virtual and augmented reality experiences'),
  ('subj-2', 'AI & Technology', 'AITECH', 'ai-tech', 'P4-S6', '🤖', 'Learn artificial intelligence and technology basics'),
  ('subj-3', 'Digital Creativity', 'DIGICRE', 'creativity', 'P1-S6', '🎨', 'Express creativity through digital tools'),
  ('subj-4', '3D Design', '3DDESIGN', 'design', 'S1-S6', '🎲', 'Create and design 3D models'),
  ('subj-5', 'VR/Metaverse', 'META', 'metaverse', 'S3-S6', '🌐', 'Navigate and build in virtual worlds'),
  ('subj-6', 'DSE Prep', 'DSEPREP', 'dse', 'S4-S6', '📝', 'Hong Kong DSE examination preparation');

-- Activities
INSERT INTO activities (id, subject_id, title, activity_type, difficulty, estimated_minutes, instructions, skill_goal, points_reward) VALUES
  -- AR/VR Activities
  ('act-1', 'subj-1', 'Solar System Explorer', 'learn', 'basic', 50,
    '{"steps":[{"step":1,"title":"Put on VR headset","description":"Make sure it is charged and connected"},{"step":2,"title":"Launch the app","description":"Click the Launch button to start"},{"step":3,"title":"Explore planets","description":"Point at planets to learn facts"},{"step":4,"title":"Complete the quiz","description":"Answer questions to earn points"}]}',
    'Learn to navigate VR environments and identify planets', 20),
  
  ('act-2', 'subj-1', 'AR Science Model', 'build', 'intermediate', 30,
    '{"steps":[{"step":1,"title":"Open AR camera","description":"Point at a flat surface"},{"step":2,"title":"Place 3D model","description":"Select and place your model"},{"step":3,"title":"Customize","description":"Change colors and size"}]}',
    'Create AR models using 3D placement', 25),
  
  ('act-3', 'subj-1', 'VR Presentation', 'present', 'intermediate', 20,
    '{"steps":[{"step":1,"title":"Prepare your creation","description":"Review your AR/VR work"},{"step":2,"title":"Record presentation","description":"Explain your project in 2 minutes"}]}',
    'Present and explain VR creations to others', 15),

  -- AI & Tech Activities
  ('act-4', 'subj-2', 'AI Basics', 'learn', 'basic', 45,
    '{"steps":[{"step":1,"title":"Read about AI","description":"Learn how AI thinks"},{"step":2,"title":"Try examples","description":"See AI in action"},{"step":3,"title":"Complete quiz","description":"Test your knowledge"}]}',
    'Understand basic AI concepts and how machines learn', 20),
  
  ('act-5', 'subj-2', 'AI Prompt Practice', 'build', 'intermediate', 25,
    '{"steps":[{"step":1,"title":"Read the task","description":"Understand what to create"},{"step":2,"title":"Write your prompt","description":"Be specific and clear"},{"step":3,"title":"Test and improve","description":"Refine your prompt"}]}',
    'Write effective AI prompts for better results', 30),
  
  ('act-6', 'subj-2', 'Train a Chatbot', 'build', 'advanced', 40,
    '{"steps":[{"step":1,"title":"Design your bot","description":"Choose personality and purpose"},{"step":2,"title":"Add responses","description":"Create Q&A pairs"},{"step":3,"title":"Test with friends","description":"See how it works"}]}',
    'Build and train a simple AI chatbot', 35),

  -- Digital Creativity Activities
  ('act-7', 'subj-3', 'Digital Art Basics', 'learn', 'basic', 35,
    '{"steps":[{"step":1,"title":"Learn color theory","description":"Warm vs cool colors"},{"step":2,"title":"Try the tools","description":"Practice with brushes"}]}',
    'Understand digital art principles and tools', 20),
  
  ('act-8', 'subj-3', 'Design an Avatar', 'build', 'basic', 20,
    '{"steps":[{"step":1,"title":"Choose base","description":"Select avatar template"},{"step":2,"title":"Customize","description":"Add features and colors"},{"step":3,"title":"Save and share","description":"Download your creation"}]}',
    'Create personalized digital avatars', 15),

  -- 3D Design Activities
  ('act-9', 'subj-4', '3D Modeling Basics', 'learn', 'intermediate', 55,
    '{"steps":[{"step":1,"title":"Learn the interface","description":"Navigate 3D tools"},{"step":2,"title":"Create basic shapes","description":"Cube, sphere, cylinder"},{"step":3,"title":"Combine objects","description":"Build simple structures"}]}',
    'Learn fundamental 3D modeling techniques', 25),
  
  ('act-10', 'subj-4', 'Build a House Model', 'build', 'intermediate', 35,
    '{"steps":[{"step":1,"title":"Create base","description":"Start with a cube"},{"step":2,"title":"Add roof","description":"Use triangular prism"},{"step":3,"title":"Add details","description":"Windows and doors"}]}',
    'Create 3D architectural models from scratch', 30),

  -- DSE Prep Activities
  ('act-11', 'subj-6', 'Past Paper Analysis', 'learn', 'advanced', 75,
    '{"steps":[{"step":1,"title":"Select subject","description":"Choose your DSE subject"},{"step":2,"title":"Review past papers","description":"Study question patterns"},{"step":3,"title":"Practice answering","description":"Time yourself"}]}',
    'Analyze DSE past papers and exam strategies', 35),
  
  ('act-12', 'subj-6', 'Mock Exam Practice', 'build', 'advanced', 60,
    '{"steps":[{"step":1,"title":"Start timer","description":"Simulate exam conditions"},{"step":2,"title":"Answer all questions","description":"Complete the mock exam"},{"step":3,"title":"Review answers","description":"Learn from mistakes"}]}',
    'Practice timed DSE mock examinations', 40);

-- Point Rules
INSERT INTO point_rules (id, school_id, reason, base_points, multiplier_enabled, max_per_day, description, is_active) VALUES
  ('rule-1', NULL, 'lesson_complete', 20, false, 200, 'Complete a lesson', true),
  ('rule-2', NULL, 'practice_complete', 15, false, 150, 'Finish practice activity', true),
  ('rule-3', NULL, 'project_submit', 30, false, 100, 'Submit a project', true),
  ('rule-4', NULL, 'help_peer', 10, false, 50, 'Help a classmate', true),
  ('rule-5', NULL, 'bonus_on_time', 10, false, 50, 'Submit before deadline', true),
  ('rule-6', NULL, 'bonus_perfect', 20, false, 40, 'Perfect score on activity', true);

-- Leaderboard Seasons
INSERT INTO leaderboard_seasons (id, school_id, name, season_type, start_date, end_date, is_active) VALUES
  ('season-1', 'school-1', 'Term 2, 2025-26', 'term', '2026-01-06', '2026-06-30', true),
  ('season-2', 'school-1', 'May 2026', 'month', '2026-05-01', '2026-05-31', true);

-- Student-Class Memberships
INSERT INTO student_classes (student_id, class_id, joined_at, status) VALUES
  ('student-1', 'class-1', '2025-09-01', 'active'),
  ('student-2', 'class-1', '2025-09-01', 'active'),
  ('student-3', 'class-1', '2025-09-01', 'active'),
  ('student-4', 'class-1', '2025-09-01', 'active'),
  ('student-5', 'class-1', '2025-09-01', 'active'),
  ('student-6', 'class-1', '2025-09-01', 'active'),
  ('student-7', 'class-1', '2025-09-01', 'active'),
  ('student-8', 'class-1', '2025-09-01', 'active'),
  ('student-9', 'class-1', '2025-09-01', 'active'),
  ('student-10', 'class-1', '2025-09-01', 'active'),
  ('student-11', 'class-2', '2025-09-01', 'active'),
  ('student-12', 'class-2', '2025-09-01', 'active'),
  ('student-13', 'class-3', '2025-09-01', 'active'),
  ('student-14', 'class-3', '2025-09-01', 'active');

-- Practice Sessions (Sample)
INSERT INTO practice_sessions (id, student_id, activity_id, practice_type, status, attempts, time_spent_seconds, score, started_at, completed_at) VALUES
  ('session-1', 'student-1', 'act-1', 'ar', 'completed', 1, 3200, 85, '2026-05-14 14:00:00', '2026-05-14 14:53:20'),
  ('session-2', 'student-1', 'act-5', 'ai', 'completed', 2, 1800, 92, '2026-05-14 15:30:00', '2026-05-14 16:00:00'),
  ('session-3', 'student-2', 'act-4', 'ai', 'completed', 1, 2700, 98, '2026-05-14 10:00:00', '2026-05-14 10:45:00'),
  ('session-4', 'student-3', 'act-7', 'art', 'in_progress', 1, NULL, NULL, '2026-05-14 16:00:00', NULL);

-- Submissions (Sample)
INSERT INTO submissions (id, student_id, activity_id, session_id, content, teacher_notes, teacher_rating, points_awarded, submitted_at, reviewed_at, reviewed_by) VALUES
  ('sub-1', 'student-1', 'act-1', 'session-1', 'I explored all 8 planets and learned about their sizes and distances from the sun. My favorite was Saturn because of its rings!', 'Great work! Very detailed observations.', 5, 20, '2026-05-14 14:53:20', '2026-05-14 15:00:00', 'teacher-1'),
  ('sub-2', 'student-2', 'act-4', 'session-3', 'AI can recognize patterns and learn from data. It needs training to get better at tasks.', 'Excellent understanding!', 5, 20, '2026-05-14 10:45:00', '2026-05-14 11:00:00', 'teacher-1'),
  ('sub-3', 'student-1', 'act-5', 'session-2', 'Prompt: Write a story about a robot named Robo who wants to learn how to paint. Setting: Future art studio. Goal: Create first painting.', 'Good prompt structure! Clear and specific.', 4, 30, '2026-05-14 16:00:00', NULL, NULL);

-- Points Transactions
INSERT INTO points (id, user_id, points, reason, reference_id, season, awarded_at, awarded_by) VALUES
  -- Tommy's points
  ('pt-1', 'student-1', 20, 'lesson_complete', 'act-1', 'term2-2026', '2026-05-14 15:00:00', 'teacher-1'),
  ('pt-2', 'student-1', 10, 'bonus_perfect', 'act-1', 'term2-2026', '2026-05-14 15:00:00', 'teacher-1'),
  ('pt-3', 'student-1', 30, 'project_submit', 'act-5', 'term2-2026', '2026-05-14 16:00:00', NULL),
  ('pt-4', 'student-1', 15, 'practice_complete', 'session-2', 'term2-2026', '2026-05-14 16:00:00', NULL),
  
  -- Emily's points
  ('pt-5', 'student-2', 20, 'lesson_complete', 'act-4', 'term2-2026', '2026-05-14 11:00:00', 'teacher-1'),
  ('pt-6', 'student-2', 20, 'bonus_perfect', 'act-4', 'term2-2026', '2026-05-14 11:00:00', 'teacher-1'),
  
  -- More historical points (aggregated)
  ('pt-7', 'student-1', 1975, 'practice_complete', NULL, 'term2-2026', '2026-05-01 00:00:00', NULL),
  ('pt-8', 'student-2', 3180, 'practice_complete', NULL, 'term2-2026', '2026-05-01 00:00:00', NULL),
  ('pt-9', 'student-3', 2830, 'practice_complete', NULL, 'term2-2026', '2026-05-01 00:00:00', NULL),
  ('pt-10', 'student-4', 2630, 'practice_complete', NULL, 'term2-2026', '2026-05-01 00:00:00', NULL);

-- User Badges
UPDATE users SET badges = '["🎮 First VR Experience", "🤖 AI Explorer", "⭐ Rising Star"]' WHERE id = 'student-1';
UPDATE users SET badges = '["🏆 Top Learner", "🤖 AI Master", "⭐ Super Achiever", "🎨 Creative Mind"]' WHERE id = 'student-2';
UPDATE users SET badges = '["🎮 VR Enthusiast", "📖 Bookworm", "⭐ Dedicated Learner"]' WHERE id = 'student-3';

-- ============================================
-- END OF SEED DATA
-- ============================================
