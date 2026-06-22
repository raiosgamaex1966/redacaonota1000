# Prompt Completo para o Lovable — RCS Prime Redação Nota Mil

---

## 🎯 O QUE É O APP

Crie uma **plataforma educacional SaaS completa** chamada **"RCS Prime Redação Nota Mil"**, voltada para estudantes que querem tirar nota 1000 na redação do ENEM 2026.

O aluno se cadastra, aprende sobre as 5 competências do ENEM, pratica exercícios, escreve redações e recebe avaliação automática por **Inteligência Artificial** com nota e feedback detalhado — exatamente como a correção real do ENEM funciona.

---

## 🏗️ STACK TÉCNICA

- **Frontend**: React + TypeScript + Vite
- **Estilo**: Tailwind CSS com Dark Mode
- **Backend**: Supabase (autenticação + banco PostgreSQL)
- **IA**: OpenRouter, OpenAI, Gemini, Groq, DeepInfra, Claude (o usuário escolhe)
- **Gráficos**: Recharts (RadarChart)
- **Pagamentos**: Mercado Pago (integração futura via backend)

---

## 🗂️ PÁGINAS E ROTAS

### 1. `/` — Dashboard (após login)
Página principal do aluno logado. Deve conter:
- Header fixo com nome do app, botão dark mode (🌙/☀️), link "Minha Conta" e botão "Sair"
- Saudação: "Olá, [Nome do aluno]! 👋 Sua jornada rumo à nota mil começa aqui."
- 3 cards de estatísticas: **Total de Pontos**, **Badges Conquistadas**, **Streak (dias consecutivos)** 🔥
- Grid com os **5 cards de competências** (descrição abaixo)
- Banner CTA verde/índigo: "Enriqueça seu repertório" → link para `/repertoire`
- Botão flutuante fixo no canto inferior esquerdo: 💳 Planos → `/plans`
- Botão flutuante fixo no canto inferior direito (só para admin): 🛠️ Admin → `/admin`

### 2. `/competency/:id` — Página da Competência
Acessada ao clicar em um card de competência. Tem **3 abas**:

**Aba "Aprenda"**
- Revisão rápida (parágrafo explicativo)
- "O que o avaliador do ENEM quer ver" (parágrafo)
- Lista de tópicos para estudar (chips/badges visuais)

**Aba "Pratique"**
- Cards de exercícios com título e descrição
- Pode conter um texto para análise ou frases para reescrita

**Aba "Escreva"**
- Exibe o tema da redação para aquela competência
- Seção para escolher a IA: radio buttons "a) Usar IA do Site" ou "b) Usar Sua IA"
  - Se "Usar Sua IA": dropdown para escolher provedor + campo de API key com botão "Salvar"
- Campo de título (opcional)
- Textarea grande para escrever (15 linhas)
- Contador de palavras em tempo real
- Botão "Enviar para Avaliação" (desabilitado se campo vazio)
- Após envio: exibe a tela de resultados com nota e radar chart

**Tela de Resultados (após envio da redação):**
- Nota total em destaque (ex: 840/1000)
- RadarChart com as 5 competências
- Cards individuais por competência: nome, nota (ex: 160/200), feedback textual
- Caixa azul com feedback geral e lista de sugestões prioritárias
- 3 botões: "Salvar Redação", "Compartilhar Progresso", "Escrever Novamente"

### 3. `/repertoire` — Biblioteca de Repertório
- Header com título "Repertório de Redação" e subtítulo
- Filtros em pills: Todos, Filmes, Livros, Conceitos, Dados, História, Legislação
- Grid 3 colunas de cards com: título, tipo (badge), descrição, trecho do conteúdo, tags (#tag)
- Carregado do Supabase (tabela `repertoire`)

### 4. `/plans` — Planos de Assinatura
Grid de 4 planos lado a lado:

| Plano | Preço | Extras |
|---|---|---|
| Gratuito (Trial) | R$ 0 / 7 dias | Competência 1, 3 avaliações |
| Mensal ⭐ (Mais Escolhido) | R$ 49,90/mês | 5 competências, 10 avaliações/mês, repertório, histórico, suporte e-mail |
| Trimestral | R$ 129,90/3 meses | + mentoria 1x/mês |
| Anual | R$ 399,90/ano | + suporte prioritário, mentoria 2x/mês, materiais exclusivos |

- Plano "Mensal" com destaque visual (borda verde e badge "MAIS ESCOLHIDO")
- Hover: card sobe com sombra
- Botão "Escolher Plano" → simula pagamento via Mercado Pago

### 5. `/my-account` — Minha Conta
- Grid 2 colunas:
  - **Dados Pessoais**: nome completo, e-mail, data de cadastro
  - **Minha Assinatura**: plano atual em destaque, data de expiração do trial (se aplicável), botão "Alterar Plano"
- Seção inferior: botão "Sair da Conta" (vermelho suave)

### 6. `/admin` — Painel de Administração (só admin)
- Título "Painel de Administração" + botão "📚 Gerenciar Repertório" → `/admin/repertoire`
- 2 abas: **Alunos** e **Redações**

**Aba Alunos** — tabela com colunas:
- Nome | E-mail | Plano (dropdown editável: Gratuito/Mensal/Trimestral/Anual) | Status (badge verde/vermelho) | Ações (botão Ativar/Desativar)

**Aba Redações** — tabela com colunas:
- Aluno (e-mail) | Tema | Nota (colorida: verde ≥800, amarelo ≥600, vermelho <600) | Data

### 7. `/admin/repertoire` — Gerenciar Repertório (só admin)
- Botão "+ Adicionar Novo" abre formulário no topo da página
- Formulário com campos: Título, Tipo (dropdown), Descrição, Conteúdo (textarea), Tags (separadas por vírgula), Competências (IDs separados por vírgula), Fonte (opcional), Ano Relevante (opcional)
- Botões: Salvar / Cancelar
- Tabela com todos os itens: Título | Tipo | Descrição | Ações (Editar / Excluir)

---

## 🔐 AUTENTICAÇÃO

### Tela de Login (antes de entrar no app)
- Card centralizado na tela com gradiente azul/índigo ao fundo
- Título "RCS Prime Redação Nota Mil"
- Subtítulo "Entrar na Conta"
- Campos: E-mail e Senha
- Botão verde "Entrar"
- Link "Não tem uma conta? Criar Conta"
- Exibe mensagem de erro se credenciais inválidas

### Tela de Cadastro
- Campos: Nome Completo, E-mail, Senha
- Botão verde "Criar Conta"
- Link "Já tem uma conta? Entrar"
- Ao cadastrar: cria conta no Supabase Auth + insere perfil na tabela `users` com trial de 7 dias

---

## 🗄️ BANCO DE DADOS SUPABASE

### Tabelas Necessárias

```sql
-- USUÁRIOS
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR,
  trial_ends_at TIMESTAMP,
  subscription_plan VARCHAR, -- 'trial', 'monthly', 'quarterly', 'annual'
  is_active BOOLEAN DEFAULT true,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
)

-- CHAVES API DOS USUÁRIOS
user_api_keys (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  provider VARCHAR, -- 'openrouter', 'openai', 'gemini', 'claude', 'groq', 'deepinfra'
  api_key TEXT,
  UNIQUE(user_id, provider)
)

-- REDAÇÕES
essays (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  competency_id INT,
  title VARCHAR,
  content TEXT NOT NULL,
  theme VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
)

-- AVALIAÇÕES
essay_evaluations (
  id UUID PRIMARY KEY,
  essay_id UUID REFERENCES essays(id),
  comp1_score INT, comp2_score INT, comp3_score INT, comp4_score INT, comp5_score INT,
  total_score INT,
  comp1_feedback TEXT, comp2_feedback TEXT, comp3_feedback TEXT, comp4_feedback TEXT, comp5_feedback TEXT,
  general_feedback TEXT,
  top_priority_suggestions TEXT[],
  evaluated_at TIMESTAMP DEFAULT NOW()
)

-- REPERTÓRIO
repertoire (
  id UUID PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  type VARCHAR, -- 'filme', 'livro', 'conceito', 'dados', 'historico', 'legislacao'
  content TEXT,
  tags TEXT[],
  competency_ids INT[],
  source VARCHAR,
  relevant_year INT,
  created_at TIMESTAMP DEFAULT NOW()
)

-- PONTOS
user_pontos (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  competency_id INT,
  pontos_earned INT,
  action VARCHAR, -- ex: 'essay_submitted'
  action_id UUID,
  earned_at TIMESTAMP DEFAULT NOW()
)

-- BADGES
user_badges (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  badge_name VARCHAR,
  badge_icon VARCHAR,
  achieved_at TIMESTAMP DEFAULT NOW()
)

-- FAVORITOS DO REPERTÓRIO
user_repertoire_favorites (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  repertoire_id UUID REFERENCES repertoire(id),
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, repertoire_id)
)
```

### Trigger Automático ao Cadastrar
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, trial_ends_at, subscription_plan)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NOW() + INTERVAL '7 days', 'trial');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 🤖 INTEGRAÇÃO COM IA — AVALIAÇÃO DE REDAÇÕES

A função de avaliação deve receber o texto da redação e retornar o seguinte JSON:

```json
{
  "competence_1": { "score": 160, "feedback": "Texto..." },
  "competence_2": { "score": 140, "feedback": "Texto..." },
  "competence_3": { "score": 160, "feedback": "Texto..." },
  "competence_4": { "score": 140, "feedback": "Texto..." },
  "competence_5": { "score": 180, "feedback": "Texto..." },
  "total_score": 780,
  "overall_feedback": "Feedback geral da redação...",
  "top_priority_suggestions": [
    "Sugestão 1",
    "Sugestão 2",
    "Sugestão 3"
  ]
}
```

O prompt enviado para a IA deve ser:
> "Você é um corretor especialista do ENEM. Avalie a seguinte redação dissertativo-argumentativa nas 5 competências do ENEM (0-200 pontos cada, total 0-1000). Retorne APENAS JSON válido com: competence_1 a competence_5 (score e feedback), total_score, overall_feedback e top_priority_suggestions (array de 3 strings). Redação: [TEXTO]"

### Provedores Disponíveis:
| Provider | Label | Modelo |
|---|---|---|
| `openrouter` | OpenRouter | Llama 3.2 1B (Gratuito) |
| `openai` | OpenAI | GPT-3.5 Turbo |
| `gemini` | Gemini | Gemini 2.0 Flash |
| `claude` | Claude | Claude 3 Haiku |
| `groq` | Groq | Llama 3.3 70B |
| `deepinfra` | DeepInfra | Llama 3.2 1B |

O usuário escolhe entre **"IA do Site"** (usa chaves do `.env`) ou **"Minha IA"** (insere sua própria chave, que é salva no banco).

---

## 🎮 GAMIFICAÇÃO

- **200 pontos** ganhos a cada redação enviada e avaliada
- **Badges**: conquistadas por metas (ex: primeira redação, 5 redações, streak 7 dias)
- **Streak**: contagem de dias consecutivos com atividade
- Dashboard exibe os 3 indicadores em cards de destaque

---

## 🎨 IDENTIDADE VISUAL

### Cores (Tailwind)
- **Primary** (verde esmeralda): `#10B981` → `emerald-500`
- **Secondary** (azul): `#3B82F6` → `blue-500`
- **Accent** (roxo): `#8B5CF6` → `violet-500`
- **Background**: gradiente `from-blue-50 to-indigo-50` (light) / `from-gray-900 to-gray-800` (dark)

### Estilo Geral
- Cards com `rounded-xl shadow-sm` e hover com `shadow-md` + leve elevação (`-translate-y-1`)
- Botões primários: verde (`bg-primary text-white`)
- Botões secundários: azul (`bg-secondary text-white`)
- Header sticky com logo em gradiente verde→azul (`bg-clip-text text-transparent`)
- Fonte padrão do Tailwind (inter/sans)
- Dark mode completo com classes `dark:`

---

## 📋 AS 5 COMPETÊNCIAS DO ENEM (conteúdo embutido no código)

### Competência 1 — Norma Culta
- **Revisão**: "Escrever de acordo com as regras da gramática formal: ortografia, concordância, regência, pontuação, crase, vocabulário variado."
- **Foco**: Texto sem desvios gramaticais, estrutura clara, vocabulário preciso.
- **Tópicos**: Ortografia, Pontuação (CRÍTICA!), Acentuação, Crase, Concordância Verbal, Concordância Nominal, Regência Verbal, Regência Nominal, Colocação Pronominal, Variação Linguística
- **Exercícios**: Caça aos erros no parágrafo | Reescrita com expansão
- **Tema da redação**: "A importância da educação financeira para jovens brasileiros"

### Competência 2 — Repertório Sociocultural
- **Revisão**: "Entender o tema e usar conhecimentos de mundo (filmes, livros, filósofos, dados, história) de forma produtiva."
- **Foco**: Não fugir do tema, usar repertório que reforce o argumento.
- **Tópicos**: Análise da proposta, tipos de repertório, como não fugir do tema, aplicação produtiva
- **Exercícios**: Identificar repertório em trechos | Conectar repertório ao tema
- **Tema**: "Formas de combater a desinformação nas redes sociais"

### Competência 3 — Argumentação
- **Revisão**: "Selecionar, relacionar e interpretar informações para defender um ponto de vista com lógica e coerência."
- **Foco**: Tese clara, argumentos com dados/exemplos/causas/consequências, sem contradições.
- **Tópicos**: Estrutura dissertativa-argumentativa, tipos de argumento, tese e antítese, coerência
- **Exercícios**: Identificar falácias | Construir argumento com dado estatístico
- **Tema**: "Desafios para a inclusão digital no Brasil"

### Competência 4 — Coesão Textual
- **Revisão**: "Usar conectivos adequados para ligar ideias, parágrafos e manter a progressão temática."
- **Foco**: Texto que flui naturalmente, sem repetições desnecessárias, com conectivos variados.
- **Tópicos**: Conectivos de adição/contraste/causa/conclusão, referenciação, elipse, substituição
- **Exercícios**: Completar com conectivo correto | Reescrever sem repetições
- **Tema**: "O papel do esporte na formação do caráter dos jovens"

### Competência 5 — Proposta de Intervenção
- **Revisão**: "Apresentar proposta de solução detalhada com os 5 elementos: Agente + Ação + Modo/Meio + Efeito + Detalhamento."
- **Foco**: Proposta realista, detalhada, que respeita os direitos humanos.
- **Tópicos**: Os 5 elementos obrigatórios, como detalhar a proposta, evitar propostas genéricas
- **Exercícios**: Identificar os 5 elementos em propostas | Reescrever proposta incompleta
- **Tema**: "Estratégias para reduzir o abandono escolar no Brasil"

---

## 🔧 HOOKS CUSTOMIZADOS NECESSÁRIOS

```typescript
// useAuth — gerencia sessão do usuário
// Retorna: { user, loading, signUp, signIn, signOut }

// useDarkMode — toggle dark mode
// Retorna: { isDark, toggleDarkMode }

// useEssayEvaluation — avalia redação com IA
// Retorna: { evaluateEssay, loading, error, selectedProvider, setSelectedProvider, useSiteAI, setUseSiteAI }

// useUserProgress — busca pontos, badges e streak do usuário
// Retorna: { progress: { totalPontos, badges, streak, competencyPontos } }
```

---

## 🚧 REGRAS DE NEGÓCIO IMPORTANTES

1. **Rotas protegidas**: usuário não autenticado é redirecionado para a tela de login
2. **Rotas admin**: só acessíveis se `is_admin = true` no banco OU e-mail = `robsoncordeiro1966@gmail.com`
3. **Trial**: ao cadastrar, o usuário recebe 7 dias de trial com acesso limitado
4. **IA do Site**: usa as chaves de API configuradas como variáveis de ambiente (VITE_*)
5. **IA do Usuário**: chave salva na tabela `user_api_keys` por provedor; carregada automaticamente ao trocar de provedor
6. **Pontos**: 200 pontos creditados por redação avaliada com sucesso
7. **Dark mode**: persistido no localStorage

---

## ✅ O QUE JÁ EXISTE E FUNCIONA

- Cadastro e login com Supabase Auth ✅
- Dashboard com stats do usuário ✅
- 5 páginas de competências com conteúdo completo (aprenda, pratique, escreva) ✅
- Editor de redação com escolha de IA ✅
- Avaliação por IA e exibição de resultados com RadarChart ✅
- Banco de repertório com filtros ✅
- Painel admin: alunos, redações e gerenciamento de repertório ✅
- Planos de assinatura (Mercado Pago simulado) ✅
- Minha Conta ✅
- Dark Mode ✅
- Deploy na Vercel com variáveis de ambiente configuradas ✅

---

## ❌ O QUE AINDA FALTA (Melhorias para implementar no Lovable)

1. **Bloqueio real por plano**: trial só acessa Comp. 1 e 3 avaliações — falta lógica de controle de acesso
2. **Histórico de redações**: página `/my-essays` com todas as redações do aluno e seus resultados
3. **Favoritos no repertório**: botão de ❤️ favoritar item; página `/my-favorites`
4. **Pagamento real** com Mercado Pago via Supabase Edge Functions
5. **Badges automáticos**: dar badge ao atingir marcos (1ª redação, 5 redações, 7-day streak, etc.)
6. **Gráfico de evolução**: linha do tempo da nota do aluno ao longo das redações
7. **Notificações por e-mail**: lembrete de estudar via Supabase Edge Functions + Resend
8. **PWA/Mobile**: manifest + service worker para instalação no celular
9. **Busca no repertório**: campo de busca por palavra-chave além dos filtros de tipo
10. **Compartilhar resultado**: gerar imagem/card da nota para compartilhar nas redes sociais

---

## 🌐 LINKS
- **App em produção**: https://enem-redacaonota1000.vercel.app
- **Repositório**: https://github.com/raiosgamaex1966/redacaonota1000
- **Admin**: e-mail `robsoncordeiro1966@gmail.com`
