-- Supabase SQL Schema for RCS Prime Redação Nota Mil

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  trial_ends_at TIMESTAMP,
  subscription_plan VARCHAR(50), -- 'trial', 'monthly', 'quarterly', 'annual'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Competencies table
CREATE TABLE IF NOT EXISTS competencies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  short_name VARCHAR(50),
  icon VARCHAR(100),
  order_number INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competency_id INT NOT NULL REFERENCES competencies(id),
  title VARCHAR(255),
  section VARCHAR(50), -- 'aprenda', 'pratique', 'escreva'
  content TEXT, -- Markdown
  order_number INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competency_id INT NOT NULL REFERENCES competencies(id),
  lesson_id UUID REFERENCES lessons(id),
  title VARCHAR(255),
  description TEXT,
  exercise_type VARCHAR(50), -- 'multiple_choice', 'text_input', 'open_ended'
  prompt TEXT, -- The question/exercise
  correct_answer TEXT, -- For validation/feedback
  explanation TEXT, -- Feedback
  order_number INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User exercise progress
CREATE TABLE IF NOT EXISTS user_exercise_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  completed BOOLEAN DEFAULT false,
  user_answer TEXT,
  is_correct BOOLEAN,
  attempted_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Essays table
CREATE TABLE IF NOT EXISTS essays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  competency_id INT REFERENCES competencies(id),
  title VARCHAR(255),
  content TEXT NOT NULL,
  theme VARCHAR(500), -- The essay theme
  submitted_at TIMESTAMP DEFAULT NOW(),
  evaluated BOOLEAN DEFAULT false,
  evaluated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Essay evaluations table
CREATE TABLE IF NOT EXISTS essay_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  essay_id UUID NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
  comp1_score INT, -- 0-200
  comp2_score INT,
  comp3_score INT,
  comp4_score INT,
  comp5_score INT,
  total_score INT, -- Sum of all 5
  comp1_feedback TEXT,
  comp2_feedback TEXT,
  comp3_feedback TEXT,
  comp4_feedback TEXT,
  comp5_feedback TEXT,
  general_feedback TEXT,
  top_priority_suggestions TEXT[], -- JSON array of suggestions
  evaluated_at TIMESTAMP DEFAULT NOW()
);

-- Repertoire table
CREATE TABLE IF NOT EXISTS repertoire (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competency_ids INT[] NOT NULL, -- Can be used in multiple competencies
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50), -- 'filme', 'livro', 'conceito', 'dados', 'historico', 'legislacao'
  content TEXT, -- Detailed description
  tags TEXT[], -- For search
  source VARCHAR(255), -- Where it came from (IMDb, Wikipedia, etc.)
  relevant_year INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User repertoire favorites
CREATE TABLE IF NOT EXISTS user_repertoire_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  repertoire_id UUID NOT NULL REFERENCES repertoire(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, repertoire_id)
);

-- User badges
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_name VARCHAR(255), -- 'Master Comp 1', 'Primeira Redação', 'Score 1000', etc.
  badge_icon VARCHAR(255),
  achieved_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, badge_name)
);

-- User XP
CREATE TABLE IF NOT EXISTS user_xp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  competency_id INT REFERENCES competencies(id),
  xp_earned INT,
  action VARCHAR(100), -- 'exercise_completed', 'essay_submitted', 'lesson_completed'
  action_id UUID,
  earned_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_essays_user_id ON essays(user_id);
CREATE INDEX IF NOT EXISTS idx_essays_submitted ON essays(submitted_at);
CREATE INDEX IF NOT EXISTS idx_evaluations_essay_id ON essay_evaluations(essay_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_exercise ON user_exercise_progress(user_id, exercise_id);
CREATE INDEX IF NOT EXISTS idx_xp_user_competency ON user_xp(user_id, competency_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE essays ENABLE ROW LEVEL SECURITY;
ALTER TABLE essay_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exercise_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_repertoire_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view own essays" ON essays
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own essays" ON essays
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own evaluations" ON essay_evaluations
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM essays WHERE id = essay_id));

CREATE POLICY "Users can insert own evaluations" ON essay_evaluations
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM essays WHERE id = essay_id));

CREATE POLICY "Users can view own XP" ON user_xp
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own XP" ON user_xp
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own badges" ON user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges" ON user_badges
  FOR INSERT WITH CHECK (auth.uid() = user_id);
