import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useEssayEvaluation } from '../../hooks/useEssayEvaluation';
import { supabase } from '../../utils/supabaseClient';

interface EssayEditorProps {
  competencyId: number;
  theme: string;
  onEvaluationComplete?: (evaluationId: string) => void;
}

const providerLabels: Record<string, { label: string; model: string }> = {
  openrouter: { label: 'OpenRouter', model: 'Llama 3.2 1B (Gratuito)' },
  openai: { label: 'OpenAI', model: 'GPT-3.5 Turbo' },
  gemini: { label: 'Gemini', model: 'Gemini 2.0 Flash' },
  claude: { label: 'Claude', model: 'Claude 3 Haiku' },
  groq: { label: 'Groq', model: 'Llama 3.3 70B' },
  deepinfra: { label: 'DeepInfra', model: 'Llama 3.2 1B' }
};

export default function EssayEditor({ competencyId, theme, onEvaluationComplete }: EssayEditorProps) {
  const { user } = useAuth();
  const {
    evaluateEssay,
    loading: evaluating,
    error: evalError,
    selectedProvider,
    setSelectedProvider,
    useSiteAI,
    setUseSiteAI
  } = useEssayEvaluation();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userApiKey, setUserApiKey] = useState('');
  const [savingKey, setSavingKey] = useState(false);
  const [loadingKey, setLoadingKey] = useState(false);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  // Load saved API key when component mounts or provider changes
  useEffect(() => {
    const loadSavedKey = async () => {
      if (!user || useSiteAI) return;

      setLoadingKey(true);
      try {
        const { data, error } = await supabase
          .from('user_api_keys')
          .select('api_key')
          .eq('user_id', user.id)
          .eq('provider', selectedProvider)
          .single();

        if (!error && data) {
          setUserApiKey(data.api_key);
        }
      } catch (err) {
        console.error('Erro ao carregar chave API:', err);
      } finally {
        setLoadingKey(false);
      }
    };

    loadSavedKey();
  }, [user, selectedProvider, useSiteAI]);

  const saveApiKey = async () => {
    if (!user || !userApiKey.trim()) {
      setError('Por favor, insira sua chave API');
      return;
    }

    setSavingKey(true);
    setError(null);

    try {
      // Check if the key already exists
      const { data: existingKey } = await supabase
        .from('user_api_keys')
        .select('id')
        .eq('user_id', user.id)
        .eq('provider', selectedProvider)
        .single();

      if (existingKey) {
        // Update existing key
        await supabase
          .from('user_api_keys')
          .update({
            api_key: userApiKey,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingKey.id);
      } else {
        // Insert new key
        await supabase
          .from('user_api_keys')
          .insert({
            user_id: user.id,
            provider: selectedProvider,
            api_key: userApiKey
          });
      }

      alert('Chave API salva com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar chave API:', err);
      setError('Erro ao salvar chave API');
    } finally {
      setSavingKey(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !content.trim()) return;
    if (!useSiteAI && !userApiKey.trim()) {
      setError('Por favor, insira sua chave API');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // 1. Save essay
      const { data: essay, error: essayError } = await supabase
        .from('essays')
        .insert({
          user_id: user.id,
          competency_id: competencyId,
          title: title || 'Redação sem título',
          content,
          theme,
        })
        .select()
        .single();

      if (essayError) throw essayError;

      // 2. Evaluate with the selected AI
      const evaluation = await evaluateEssay(content, useSiteAI ? undefined : userApiKey);

      if (!evaluation) throw new Error('Erro ao avaliar redação');

      // 3. Save evaluation
      const { data: evalData, error: evalError } = await supabase
        .from('essay_evaluations')
        .insert({
          essay_id: essay.id,
          comp1_score: evaluation.competence_1.score,
          comp2_score: evaluation.competence_2.score,
          comp3_score: evaluation.competence_3.score,
          comp4_score: evaluation.competence_4.score,
          comp5_score: evaluation.competence_5.score,
          total_score: evaluation.total_score,
          comp1_feedback: evaluation.competence_1.feedback,
          comp2_feedback: evaluation.competence_2.feedback,
          comp3_feedback: evaluation.competence_3.feedback,
          comp4_feedback: evaluation.competence_4.feedback,
          comp5_feedback: evaluation.competence_5.feedback,
          general_feedback: evaluation.overall_feedback,
          top_priority_suggestions: evaluation.top_priority_suggestions,
        })
        .select()
        .single();

      if (evalError) throw evalError;

      // 4. Give Pontos to user
      await supabase
        .from('user_pontos')
        .insert({
          user_id: user.id,
          competency_id: competencyId,
          pontos_earned: 200,
          action: 'essay_submitted',
          action_id: essay.id,
        });

      // 5. Callback
      if (onEvaluationComplete) {
        onEvaluationComplete(evalData.id);
      }

    } catch (err) {
      console.error('Erro:', err);
      setError(err instanceof Error ? err.message : 'Erro ao enviar redação');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-8 shadow-sm">
      <h3 className="text-2xl font-bold mb-2">Escreva sua redação</h3>
      <p className="text-gray-600 mb-6">
        Tema: <span className="font-semibold">{theme}</span>
      </p>

      {/* Opção de escolha da IA */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Como você quer avaliar sua redação?</h4>
        <div className="flex flex-wrap gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={useSiteAI}
              onChange={() => setUseSiteAI(true)}
              className="w-4 h-4 text-primary"
            />
            <span className="font-medium text-gray-800">a) Usar IA do Site</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={!useSiteAI}
              onChange={() => setUseSiteAI(false)}
              className="w-4 h-4 text-primary"
            />
            <span className="font-medium text-gray-800">b) Usar Sua IA</span>
          </label>
        </div>

        {!useSiteAI && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Escolha o provedor de IA
              </label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {Object.entries(providerLabels).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label} - {val.model}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sua chave API ({providerLabels[selectedProvider].label})
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={userApiKey}
                  onChange={(e) => setUserApiKey(e.target.value)}
                  placeholder="Digite sua chave API aqui..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={saveApiKey}
                  disabled={savingKey || loadingKey}
                  className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
                >
                  {savingKey ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
              {loadingKey && <p className="text-sm text-gray-500 mt-1">Carregando chave salva...</p>}
            </div>
          </div>
        )}
      </div>

      {(error || evalError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error || evalError}
        </div>
      )}

      <input
        type="text"
        placeholder="Título da sua redação (opcional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escreva sua redação aqui..."
        rows={15}
        className="w-full mb-4 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-sans text-base"
      />

      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          {wordCount} palavras
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting || evaluating || !content.trim()}
        className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {submitting || evaluating ? 'Enviando e Avaliando...' : 'Enviar para Avaliação'}
      </button>
    </div>
  );
}
