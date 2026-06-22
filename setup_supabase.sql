-- 1. Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Criar todas as tabelas (se não existirem)
-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  trial_ends_at TIMESTAMP,
  subscription_plan VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela para armazenar chaves API dos usuários
CREATE TABLE IF NOT EXISTS user_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- openrouter, openai, gemini, claude, groq, deepinfra
  api_key TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Políticas RLS para user_api_keys (com verificação de existência)
ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_api_keys' AND policyname = 'Usuários podem ver suas próprias chaves') THEN
    CREATE POLICY "Usuários podem ver suas próprias chaves" ON user_api_keys
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_api_keys' AND policyname = 'Usuários podem inserir suas próprias chaves') THEN
    CREATE POLICY "Usuários podem inserir suas próprias chaves" ON user_api_keys
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_api_keys' AND policyname = 'Usuários podem atualizar suas próprias chaves') THEN
    CREATE POLICY "Usuários podem atualizar suas próprias chaves" ON user_api_keys
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Políticas RLS para repertoire
ALTER TABLE repertoire ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'repertoire' AND policyname = 'Todo mundo pode ver o repertório') THEN
    CREATE POLICY "Todo mundo pode ver o repertório" ON repertoire
      FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'repertoire' AND policyname = 'Apenas admin pode modificar o repertório') THEN
    CREATE POLICY "Apenas admin pode modificar o repertório" ON repertoire
      FOR ALL USING (auth.email() = 'robsoncordeiro1966@gmail.com');
  END IF;
END
$$;

-- Políticas RLS para user_repertoire_favorites
ALTER TABLE user_repertoire_favorites ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_repertoire_favorites' AND policyname = 'Usuários podem ver seus próprios favoritos') THEN
    CREATE POLICY "Usuários podem ver seus próprios favoritos" ON user_repertoire_favorites
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_repertoire_favorites' AND policyname = 'Usuários podem adicionar/remover favoritos') THEN
    CREATE POLICY "Usuários podem adicionar/remover favoritos" ON user_repertoire_favorites
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END
$$;

-- 3. Inserir o usuário admin padrão (se não existir)
-- NOTA: Você precisará criar o usuário na autenticação do Supabase primeiro e pegar o ID

-- Tabela de competências
CREATE TABLE IF NOT EXISTS competencies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  short_name VARCHAR(50),
  icon VARCHAR(100),
  order_number INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de aulas
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competency_id INT NOT NULL REFERENCES competencies(id),
  title VARCHAR(255),
  section VARCHAR(50),
  content TEXT,
  order_number INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de exercícios
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competency_id INT NOT NULL REFERENCES competencies(id),
  lesson_id UUID REFERENCES lessons(id),
  title VARCHAR(255),
  description TEXT,
  exercise_type VARCHAR(50),
  prompt TEXT,
  correct_answer TEXT,
  explanation TEXT,
  order_number INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Progresso dos exercícios do usuário
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

-- Tabela de redações
CREATE TABLE IF NOT EXISTS essays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  competency_id INT REFERENCES competencies(id),
  title VARCHAR(255),
  content TEXT NOT NULL,
  theme VARCHAR(500),
  submitted_at TIMESTAMP DEFAULT NOW(),
  evaluated BOOLEAN DEFAULT false,
  evaluated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de avaliações de redações
CREATE TABLE IF NOT EXISTS essay_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  essay_id UUID NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
  comp1_score INT,
  comp2_score INT,
  comp3_score INT,
  comp4_score INT,
  comp5_score INT,
  total_score INT,
  comp1_feedback TEXT,
  comp2_feedback TEXT,
  comp3_feedback TEXT,
  comp4_feedback TEXT,
  comp5_feedback TEXT,
  general_feedback TEXT,
  top_priority_suggestions TEXT[],
  evaluated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de repertório
CREATE TABLE IF NOT EXISTS repertoire (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competency_ids INT[] NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50),
  content TEXT,
  tags TEXT[],
  source VARCHAR(255),
  relevant_year INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Favoritos do repertório do usuário
CREATE TABLE IF NOT EXISTS user_repertoire_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  repertoire_id UUID NOT NULL REFERENCES repertoire(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, repertoire_id)
);

-- Tabela de conquistas
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_name VARCHAR(255),
  badge_icon VARCHAR(255),
  achieved_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, badge_name)
);

-- Tabela de XP do usuário
CREATE TABLE IF NOT EXISTS user_xp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  competency_id INT REFERENCES competencies(id),
  xp_earned INT,
  action VARCHAR(100),
  action_id UUID,
  earned_at TIMESTAMP DEFAULT NOW()
);

-- 3. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_essays_user_id ON essays(user_id);
CREATE INDEX IF NOT EXISTS idx_essays_submitted ON essays(submitted_at);
CREATE INDEX IF NOT EXISTS idx_evaluations_essay_id ON essay_evaluations(essay_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_exercise ON user_exercise_progress(user_id, exercise_id);
CREATE INDEX IF NOT EXISTS idx_xp_user_competency ON user_xp(user_id, competency_id);

-- 4. Habilitar Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE essays ENABLE ROW LEVEL SECURITY;
ALTER TABLE essay_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exercise_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_repertoire_favorites ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas RLS
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

-- 6. Inserir as 5 competências do ENEM
INSERT INTO competencies (id, name, short_name, description, icon, order_number)
VALUES
  (1, 'Dominar a norma culta da língua escrita', 'Norma Culta', 'Uso correto da gramática, pontuação, concordância, regência, crase e vocabulário.', '📝', 1),
  (2, 'Compreender a proposta e aplicar repertório', 'Repertório', 'Entendimento do tema e uso de conhecimentos de diferentes áreas.', '🧠', 2),
  (3, 'Selecionar, relacionar e interpretar informações', 'Argumentação', 'Construção de argumentos consistentes e coerentes.', '⚔️', 3),
  (4, 'Conhecimento de mecanismos linguísticos', 'Coesão', 'Uso de conectivos e coesão textual.', '🔗', 4),
  (5, 'Proposta de intervenção para o problema', 'Intervenção', 'Proposta de solução com os 5 elementos obrigatórios.', '💡', 5)
ON CONFLICT (id) DO NOTHING;

-- 7. Configurar keep-alive com pg_cron (evita que o banco seja pausado)
-- Função que faz um ping no banco de dados
CREATE OR REPLACE FUNCTION public.keep_alive() 
RETURNS void AS $$
BEGIN
  -- Faz um select simples para manter o banco ativo
  PERFORM 1;
END;
$$ LANGUAGE plpgsql;

-- Cria um cron job que executa a função a cada 6 horas
-- (verifique se o job já existe para evitar erros)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM cron.job WHERE jobname = 'keep-supabase-alive'
  ) THEN
    PERFORM cron.schedule(
      'keep-supabase-alive',
      '0 */6 * * *',
      'SELECT public.keep_alive();'
    );
  END IF;
END $$;
