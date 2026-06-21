import { useState } from 'react';

type AIProvider = 'openrouter' | 'openai' | 'deepinfra';

interface ClaudeEvaluationResult {
  competence_1: {
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  };
  competence_2: {
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  };
  competence_3: {
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  };
  competence_4: {
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  };
  competence_5: {
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  };
  total_score: number;
  overall_feedback: string;
  top_priority_suggestions: string[];
}

export function useEssayEvaluation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('openrouter');

  const getAPIConfig = (provider: AIProvider) => {
    switch (provider) {
      case 'openrouter':
        return {
          url: 'https://openrouter.ai/api/v1/chat/completions',
          apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
          model: 'anthropic/claude-sonnet-4-6',
        };
      case 'openai':
        return {
          url: 'https://api.openai.com/v1/chat/completions',
          apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
          model: 'gpt-4o',
        };
      case 'deepinfra':
        return {
          url: 'https://api.deepinfra.com/v1/openai/chat/completions',
          apiKey: import.meta.env.VITE_DEEPINFRA_API_KEY || '',
          model: 'meta-llama/Llama-3-8B-Instruct',
        };
    }
  };

  const evaluateEssay = async (essayContent: string): Promise<ClaudeEvaluationResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const config = getAPIConfig(selectedProvider);

      // System prompt para avaliação
      const systemPrompt = `Você é um avaliador especializado em redações do ENEM 2026. 
Sua tarefa é avaliar uma redação contra as 5 competências oficiais.

Competência 1 (0-200): Dominar a norma culta da língua escrita
- Ortografia, acentuação, pontuação corretos
- Concordância verbal e nominal adequada
- Regência verbal e nominal correta
- Estrutura de frases clara e coesa
- Vocabulário variado e preciso
- Ausência de vícios de linguagem

Competência 2 (0-200): Compreender a proposta e aplicar repertório
- Entendimento completo do tema (sem fuga ou tangenciamento)
- Estrutura dissertativo-argumentativa presente
- Uso de repertório sociocultural legítimo, pertinente e produtivo
- Conhecimentos de diferentes áreas aplicados adequadamente

Competência 3 (0-200): Selecionar, relacionar e interpretar informações
- Tese clara e bem defendida
- Argumentos consistentes e coerentes
- Progressão temática (ideias avançam, não se repetem)
- Estratégias argumentativas eficientes (exemplos, dados, comparações)

Competência 4 (0-200): Conhecimento de mecanismos linguísticos
- Uso adequado de conectivos entre e dentro dos parágrafos
- Coesão referencial (pronomes, sinônimos, elipses)
- Coesão sequencial (progressão lógica)
- Texto fluido e sem "saltos" de ideias
- Coerência temática mantida

Competência 5 (0-200): Proposta de intervenção para o problema
- Presença dos 5 elementos obrigatórios:
  1. Agente social (quem executa)
  2. Ação (o que fazer)
  3. Meio/Modo (como fazer)
  4. Finalidade/Efeito (para que/resultado esperado)
  5. Detalhamento de um desses 4
- Respeito aos Direitos Humanos
- Viabilidade e especificidade da proposta
- Conexão com os argumentos desenvolvidos

INSTRUÇÕES DE AVALIAÇÃO:
1. Leia a redação completa
2. Avalie cada competência de 0 a 200 pontos (múltiplos de 10 recomendados)
3. Forneça feedback específico para CADA competência
4. Destaque pontos fortes E pontos de melhoria
5. Forneça 2-3 sugestões concretas e prioritárias
6. Seja construtivo e motivador, mas honesto

Retorne APENAS um JSON válido, sem markdown, sem explicações extras.`;

      const response = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
          ...(selectedProvider === 'openrouter' && {
            'HTTP-Referer': window.location.origin,
            'X-Title': 'RCS Redação Nota Mil',
          }),
        },
        body: JSON.stringify({
          model: config.model,
          max_tokens: 2000,
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: `REDAÇÃO:\n---\n${essayContent}\n---`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao avaliar redação: ${response.statusText}`);
      }

      const data = await response.json();
      let textContent: string;

      if (selectedProvider === 'openrouter' || selectedProvider === 'openai' || selectedProvider === 'deepinfra') {
        textContent = data.choices[0].message.content;
      } else {
        textContent = data.content[0]?.text;
      }

      if (!textContent) {
        throw new Error('Resposta inválida da API');
      }

      const evaluation = JSON.parse(textContent) as ClaudeEvaluationResult;
      return evaluation;

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    evaluateEssay,
    loading,
    error,
    selectedProvider,
    setSelectedProvider,
  };
}
