import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useEssayEvaluation } from '../../hooks/useEssayEvaluation';
import { supabase } from '../../utils/supabaseClient';

interface EssayEditorProps {
  competencyId: number;
  theme: string;
  onEvaluationComplete?: (evaluationId: string) => void;
}

export default function EssayEditor({ competencyId, theme, onEvaluationComplete }: EssayEditorProps) {
  const { user } = useAuth();
  const {
    evaluateEssay,
    loading: evaluating,
    error: evalError,
    selectedProvider,
    setSelectedProvider,
  } = useEssayEvaluation();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = async () => {
    if (!user || !content.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      // 1. Salvar redação
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

      // 2. Avaliar com a IA selecionada
      const evaluation = await evaluateEssay(content);

      if (!evaluation) throw new Error('Erro ao avaliar redação');

      // 3. Salvar avaliação
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

      // 4. Dar XP ao usuário
      await supabase
        .from('user_xp')
        .insert({
          user_id: user.id,
          competency_id: competencyId,
          xp_earned: 200,
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

      {/* Seletor de provedor de IA */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Provedor de IA para avaliação
        </label>
        <select
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value as any)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="openrouter">OpenRouter (Claude Sonnet)</option>
          <option value="openai">OpenAI (GPT-4o)</option>
          <option value="deepinfra">DeepInfra (Llama 3)</option>
        </select>
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
