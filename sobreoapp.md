# RCS Prime Redação Nota Mil

## Descrição
Plataforma educacional SaaS premium para preparação para a redação do ENEM 2026. O aluno aprende, pratica e escreve redações que são avaliadas automaticamente por Inteligência Artificial, com nota e feedback detalhado por competência — exatamente como na correção real do ENEM.

---

## Tecnologias Utilizadas
- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS + Dark Mode
- **Backend/BaaS**: Supabase (Auth + PostgreSQL + RLS)
- **Charts**: Recharts (RadarChart de desempenho)
- **Deploy**: Vercel
- **IAs Integradas**: OpenRouter, OpenAI, Gemini, Groq, DeepInfra, Claude

---

## Páginas e Rotas

| Rota | Componente | Descrição |
|---|---|---|
| `/` | `DashboardMain` | Dashboard com stats, competências e acesso ao repertório |
| `/competency/:id` | `CompetencyPage` | Página da competência com 3 abas: Aprenda, Pratique, Escreva |
| `/repertoire` | `Repertoire` | Biblioteca de repertórios com filtros por tipo |
| `/plans` | `SubscriptionPlans` | Página de planos de assinatura |
| `/my-account` | `MyAccount` | Dados do usuário e assinatura atual |
| `/admin` | `AdminDashboard` | Painel de administração (protegido) |
| `/admin/repertoire` | `AdminRepertoire` | Gerenciar itens do repertório (protegido) |

---

## Funcionalidades Detalhadas

### 1. Autenticação
- Cadastro com nome, e-mail e senha
- Login com e-mail e senha
- Trial de 7 dias automático ao cadastrar
- Sessão persistente via Supabase Auth
- Usuário admin identificado por e-mail hardcoded + campo `is_admin` no banco

### 2. Dashboard
- Saudação personalizada com nome do usuário
- 3 cards de stats: Total de Pontos, Badges conquistadas, Streak de dias consecutivos
- 5 cards de competências com XP ganho em cada uma
- CTA para o Repertório

### 3. Competências do ENEM
Cada competência tem 3 abas:

**Aprenda**
- Revisão rápida em texto
- Foco do avaliador do ENEM
- Lista de tópicos para estudar

**Pratique**
- Exercícios contextualizados
- Caça aos erros, reescrita, análise de trechos, etc.

**Escreva**
- Tema de redação pré-definido por competência
- Editor de redação com contador de palavras
- Escolha do provedor de IA para correção
- Envio, avaliação e exibição de resultados

#### As 5 Competências:
1. **Norma Culta** — gramática, ortografia, pontuação, concordância, crase, regência
2. **Repertório Sociocultural** — entender o tema, não fugir, usar conhecimentos de mundo
3. **Argumentação** — construir argumentos sólidos, selecionar e relacionar informações
4. **Mecanismos Linguísticos (Coesão)** — uso de conectivos, progressão temática, coerência
5. **Proposta de Intervenção** — proposta completa com agente, ação, modo, efeito e detalhamento

### 4. Sistema de Avaliação por IA
- O usuário escolhe entre **"IA do Site"** (usa as chaves API do admin, configuradas na Vercel) ou **"Sua Própria IA"** (insere sua chave API)
- Provedores disponíveis: OpenRouter (Llama 3.2), OpenAI (GPT-3.5), Gemini (Flash 2.0), Claude (Haiku), Groq (Llama 70B), DeepInfra (Llama 3.2)
- Chave API do usuário é salva no banco (tabela `user_api_keys`) e carregada automaticamente
- Resultado da avaliação:
  - Nota total (0–1000)
  - Nota por competência (0–200 cada)
  - Feedback textual por competência
  - Feedback geral
  - Lista de sugestões prioritárias
  - Gráfico RadarChart de desempenho visual

### 5. Repertório
- Biblioteca de conteúdos organizada por tipo: Filme, Livro, Conceito, Dados, História, Legislação
- Filtros por categoria
- Cards com título, tipo, descrição, conteúdo e tags
- Admin pode adicionar, editar e remover itens via painel dedicado

### 6. Gamificação
- **Pontos (Pontos)**: 200 pontos por redação enviada
- **Badges**: sistema de conquistas (tabela `user_badges`)
- **Streak**: dias consecutivos de acesso (tabela `user_pontos`)
- Dashboard mostra total de pontos, badges e streak

### 7. Planos de Assinatura

| Plano | Preço | Recursos |
|---|---|---|
| Gratuito (Trial) | R$ 0 / 7 dias | Competência 1, 3 avaliações |
| Mensal | R$ 49,90/mês | 5 competências, 10 avaliações/mês, repertório completo, histórico, suporte por e-mail |
| Trimestral | R$ 129,90/3 meses | + mentoria 1x/mês |
| Anual | R$ 399,90/ano | + suporte prioritário, mentoria 2x/mês, materiais exclusivos |

- Integração com Mercado Pago (simulada, pronta para backend)

### 8. Painel de Administração (Admin)
- **Aba Alunos**: tabela com todos os usuários, plano atual (editável), status ativo/inativo (toggle)
- **Aba Redações**: tabela com todas as redações, aluno, tema, nota e data
- **Gerenciar Repertório**: CRUD completo de itens do banco de repertório
- Acesso protegido pelo `ProtectedRoute` com `requireAdmin=true`
- Botão flutuante de acesso rápido ao admin (visível só para o admin)

### 9. Minha Conta
- Exibe nome, e-mail e data de cadastro
- Mostra plano atual e data de expiração do trial
- Botão para trocar plano (redireciona para `/plans`)
- Botão para sair da conta

### 10. Dark Mode
- Toggle no header (☀️/🌙)
- Persistido via hook `useDarkMode`
- Aplica classes `dark:` do Tailwind em todo o app

---

## Banco de Dados (Supabase/PostgreSQL)

### Tabelas
| Tabela | Descrição |
|---|---|
| `users` | Perfil do usuário, plano, trial, is_admin |
| `user_api_keys` | Chaves API salvas por provedor |
| `competencies` | 5 competências do ENEM |
| `lessons` | Aulas por competência |
| `exercises` | Exercícios por competência/aula |
| `user_exercise_progress` | Progresso do aluno nos exercícios |
| `essays` | Redações enviadas |
| `essay_evaluations` | Resultados das avaliações por competência |
| `repertoire` | Banco de repertório |
| `user_repertoire_favorites` | Favoritos do repertório por usuário |
| `user_badges` | Badges conquistadas |
| `user_pontos` | Pontos acumulados por ação |

### Segurança (RLS)
- Row Level Security ativo em todas as tabelas
- Usuário só vê/edita seus próprios dados
- Admin (por `is_admin=true` ou e-mail) vê tudo
- Trigger automático cria perfil em `users` ao cadastrar

---

## Variáveis de Ambiente
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_OPENROUTER_API_KEY=
VITE_OPENAI_API_KEY=
VITE_DEEPINFRA_API_KEY=
VITE_CLAUDE_API_KEY=
VITE_GEMINI_API_KEY=
VITE_GROQ_API_KEY=
```

---

## Estrutura de Pastas
```
rcs-redacao-nota-mil/
├── src/
│   ├── components/
│   │   ├── Auth/          # LoginForm, SignUpForm, ProtectedRoute
│   │   ├── Dashboard/     # DashboardMain, CompetencyCard
│   │   ├── Essay/         # EssayEditor, EvaluationResults
│   │   └── Layout/        # Header
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── CompetencyPage.tsx
│   │   ├── Repertoire.tsx
│   │   ├── SubscriptionPlans.tsx
│   │   ├── MyAccount.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── AdminRepertoire.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useDarkMode.ts
│   │   ├── useEssayEvaluation.ts
│   │   └── useUserProgress.ts
│   └── utils/
│       ├── supabaseClient.ts
│       └── mercadopago.ts
├── setup_supabase.sql     # Schema completo do banco
└── sobreoapp.md           # Este arquivo
```

---

## O Que Ainda Falta Implementar (Roadmap)
1. **Pagamento real** com Mercado Pago (backend necessário)
2. **Bloqueio por plano**: trial só acessa Competência 1 / 3 avaliações
3. **Favoritos no repertório**: botão de favoritar itens
4. **Histórico de redações**: página do aluno com todas as redações passadas
5. **Notificações por e-mail** (Supabase Edge Functions)
6. **Versão mobile** (PWA)
7. **Sistema de conquistas automáticas** (badges por metas atingidas)
8. **Painel com gráficos de evolução** do aluno ao longo do tempo

---

## Autor
Robson Cordeiro — RCS Prime
Deploy: [enem-redacaonota1000.vercel.app](https://enem-redacaonota1000.vercel.app)
Repositório: [github.com/raiosgamaex1966/redacaonota1000](https://github.com/raiosgamaex1966/redacaonota1000)
