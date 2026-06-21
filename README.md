# RCS Prime Redação Nota Mil

Plataforma premium de preparação para redação do ENEM com avaliação por IA usando Claude API, gamificação e muito mais!

## Tecnologias

- **Frontend**: React 19 + TypeScript + Vite
- **Estilos**: Tailwind CSS
- **Backend/Auth**: Supabase
- **Charts**: Recharts
- **IA**: Claude API (Anthropic)

## Funcionalidades (MVP)

- ✅ Autenticação (Cadastro/Login com trial de 7 dias)
- ✅ Dashboard principal com 5 competências
- ✅ Competência 1 completa (Aprenda, Pratique, Escreva)
- ✅ Editor de redação com envio para avaliação
- ✅ Avaliação por Claude API
- ✅ Resultados com radar chart e feedback detalhado
- ✅ Sistema básico de XP

## Configuração

### 1. Supabase Setup

1. Crie uma conta no [Supabase](https://supabase.com/)
2. Crie um novo projeto
3. Vá para **SQL Editor** e execute o arquivo `supabase_schema.sql`
4. Vá para **Settings → API** para pegar suas credenciais

### 2. Claude API Setup

1. Crie uma conta no [Anthropic Console](https://console.anthropic.com/)
2. Crie uma API Key

### 3. Instalação

Clone o repositório e instale as dependências:

```bash
cd rcs-redacao-nota-mil
npm install
```

### 4. Variáveis de Ambiente

Renomeie `.env.local.example` para `.env.local` e preencha as variáveis:

```env
VITE_SUPABASE_URL=seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
VITE_CLAUDE_API_KEY=sua-chave-claude
```

### 5. Rodar o projeto

```bash
npm run dev
```

## Estrutura do Projeto

```
src/
├── components/
│   ├── Auth/          # Componentes de login/cadastro
│   ├── Dashboard/     # Componentes do dashboard
│   ├── Essay/         # Editor e resultados de redação
│   └── Layout/        # Componentes de layout
├── hooks/             # Custom hooks
├── pages/             # Páginas da aplicação
├── types/             # Definições de tipos TypeScript
├── utils/             # Utilitários (Supabase client, etc.)
├── App.tsx
├── main.tsx
└── index.css
```

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Cria a build de produção |
| `npm run preview` | Visualiza a build de produção |
| `npm run lint` | Executa o ESLint |

## Próximos Passos (Fase 2)

- [ ] Implementar Competências 2-5
- [ ] Banco de repertório completo
- [ ] Sistema de badges
- [ ] Histórico de redações
- [ ] Integração de pagamento (Stripe)
- [ ] Melhorias de UI/UX
- [ ] Testes
