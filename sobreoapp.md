# RCS Prime Redação Nota 1000

## Descrição
Aplicativo educacional premium para preparação para a redação do ENEM 2026.

## Tecnologias Utilizadas
- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS
- **Backend**: Supabase (Autenticação + Banco de Dados PostgreSQL)
- **Charts**: Recharts
- **IA**: Claude, OpenAI, Gemini, Groq, OpenRouter, DeepInfra

## Funcionalidades Principais
1. **Autenticação**: Cadastro e login de usuários com trial de 7 dias
2. **Dashboard**: Visualização das 5 competências do ENEM
3. **Competências**:
   - Aprenda: Conteúdo teórico sobre a competência
   - Pratique: Exercícios para fixar o conhecimento
   - Escreva: Editor de redação com envio para avaliação via IA
4. **Repertório**: Biblioteca de conteúdos para enriquecer as redações
5. **Avaliação**: Correção automática de redações via IA
6. **Monetização**: Planos de assinatura (gratuíto, mensal, trimestral, anual)
7. **Painel de Admin**: Gerenciamento de usuários e redações
8. **Sistema de Pontos**: Gamificação com pontos e conquistas

## Competências do ENEM
1. **Norma Culta**: Uso correto da gramática, pontuação, concordância e vocabulário
2. **Repertório**: Entendimento do tema e uso de conhecimentos de diferentes áreas
3. **Argumentação**: Construção de argumentos consistentes e coerentes
4. **Coesão**: Uso de conectivos e coesão textual
5. **Intervenção**: Proposta de solução com os 5 elementos obrigatórios

## Integração com IA
Os alunos podem escolher:
- **IA do Site**: Usa as chaves API do administrador configuradas no arquivo `.env.local`
- **Sua Própria IA**: O aluno insere sua chave API e escolhe o provedor (OpenAI, Gemini, Claude, Groq, OpenRouter, DeepInfra)

## Como Configurar
1. Clone o repositório: `git clone https://github.com/raiosgamaex1966/redacaonota1000.git`
2. Instale as dependências: `npm install`
3. Crie um arquivo `.env.local` com as suas credenciais:
   ```env
   VITE_SUPABASE_URL=seu-url-supabase
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima
   VITE_OPENROUTER_API_KEY=sua-chave-openrouter
   VITE_OPENAI_API_KEY=sua-chave-openai
   VITE_DEEPINFRA_API_KEY=sua-chave-deepinfra
   VITE_CLAUDE_API_KEY=sua-chave-claude
   VITE_GEMINI_API_KEY=sua-chave-gemini
   VITE_GROQ_API_KEY=sua-chave-groq
   ```
4. Crie o banco de dados no Supabase usando o arquivo `setup_supabase.sql`
5. Execute o servidor de desenvolvimento: `npm run dev`

## Estrutura de Pastas
```
rcs-redacao-nota-mil/
├── src/
│   ├── components/       # Componentes React
│   ├── pages/            # Páginas do app
│   ├── hooks/            # Hooks customizados
│   ├── utils/            # Funções úteis
│   └── App.tsx           # Arquivo principal do app
├── public/               # Arquivos públicos
├── setup_supabase.sql    # Script para criar o banco de dados
└── sobreoapp.md          # Este arquivo
```

## Funcionalidades Futuras
1. Integração com Mercado Pago para pagamentos automáticos
2. Sistema de conquistas (badges)
3. Favoritos no repertório
4. Notificações por e-mail
5. Versão mobile

## Autor
Criado por Robson Cordeiro

## Licença
MIT
