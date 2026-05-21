-- Skills taxonomy for Wiki Brain
-- Add to existing migration

CREATE TABLE IF NOT EXISTS skills (
    id bigserial PRIMARY KEY,
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    subject_code text REFERENCES subjects(code),
    category text,
    description text,
    icon text,
    created_at timestamptz DEFAULT now()
);

-- Junction: wiki_pages <-> skills
CREATE TABLE IF NOT EXISTS page_skills (
    id bigserial PRIMARY KEY,
    page_id bigint REFERENCES wiki_pages(id) ON DELETE CASCADE,
    skill_id bigint REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE(page_id, skill_id)
);

-- RLS for skills
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "skills_select_all" ON skills FOR SELECT USING (true);
CREATE POLICY "skills_insert_auth" ON skills FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "page_skills_select_all" ON page_skills FOR SELECT USING (true);
CREATE POLICY "page_skills_insert_auth" ON page_skills FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM wiki_pages WHERE wiki_pages.id = page_skills.page_id AND wiki_pages.author_id = auth.uid())
);
CREATE POLICY "page_skills_delete_own" ON page_skills FOR DELETE USING (
    EXISTS (SELECT 1 FROM wiki_pages WHERE wiki_pages.id = page_skills.page_id AND wiki_pages.author_id = auth.uid())
);

-- Seed skills
INSERT INTO skills (name, slug, subject_code, category, description, icon) VALUES
    ('Reading Comprehension', 'reading-comprehension', 'ENG-P', 'Language', 'Understanding and interpreting written texts', '📖'),
    ('Writing', 'writing', 'ENG-P', 'Language', 'Composition, grammar, and written expression', '✍️'),
    ('Listening', 'listening', 'ENG-P', 'Language', 'Aural comprehension and listening strategies', '🎧'),
    ('Speaking', 'speaking', 'ENG-P', 'Language', 'Oral presentation and communication', '🗣️'),
    ('Vocabulary', 'vocabulary', 'ENG-P', 'Language', 'Word knowledge and usage', '📝'),
    ('閱讀理解', 'reading-zh', 'CHIN-P', 'Language', '閱讀文章並理解內容', '📖'),
    ('寫作', 'writing-zh', 'CHIN-P', 'Language', '文章寫作與表達', '✍️'),
    ('聆聽', 'listening-zh', 'CHIN-P', 'Language', '聆聽理解能力', '🎧'),
    ('算術', 'arithmetic', 'MATH-P', 'Math', 'Basic arithmetic operations', '🔢'),
    ('代數', 'algebra', 'MATH-P', 'Math', 'Equations, expressions, and algebraic thinking', '📐'),
    ('幾何', 'geometry', 'MATH-P', 'Math', 'Shapes, space, and spatial reasoning', '📏'),
    ('數據處理', 'data-handling', 'MATH-P', 'Math', 'Statistics, probability, and data analysis', '📊'),
    ('科學探究', 'scientific-inquiry', 'GS-P', 'Science', 'Scientific method and investigation skills', '🔬'),
    ('人體健康', 'health', 'GS-P', 'Science', 'Human body and health science', '🏥'),
    ('環境科學', 'environmental', 'GS-P', 'Science', 'Ecology and environmental awareness', '🌍'),
    ('香港歷史', 'hk-history', 'GS-P', 'Social Studies', 'Hong Kong history and development', '🏛️'),
    ('中國歷史', 'china-history', 'CHIST-S', 'Humanities', 'Chinese history from ancient to modern', '📜'),
    ('世界歷史', 'world-history', 'HIST-S', 'Humanities', 'World history and civilizations', '🌏'),
    ('經濟概念', 'economics', 'ECON-S', 'Social Science', 'Basic economic principles and concepts', '💰'),
    ('地理知識', 'geography', 'GEOG-S', 'Science', 'Physical and human geography', '🗺️')
ON CONFLICT (slug) DO NOTHING;