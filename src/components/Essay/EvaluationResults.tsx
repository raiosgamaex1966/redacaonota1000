import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface EssayEvaluation {
  id: string;
  essay_id: string;
  comp1_score: number;
  comp2_score: number;
  comp3_score: number;
  comp4_score: number;
  comp5_score: number;
  total_score: number;
  comp1_feedback: string;
  comp2_feedback: string;
  comp3_feedback: string;
  comp4_feedback: string;
  comp5_feedback: string;
  general_feedback: string;
  top_priority_suggestions: string[];
  evaluated_at: string;
}

interface EvaluationResultsProps {
  evaluation: EssayEvaluation;
}

export default function EvaluationResults({ evaluation }: EvaluationResultsProps) {
  const competencies = [
    { name: 'Comp 1: Norma Culta', score: evaluation.comp1_score, feedback: evaluation.comp1_feedback },
    { name: 'Comp 2: Repertório', score: evaluation.comp2_score, feedback: evaluation.comp2_feedback },
    { name: 'Comp 3: Argumentação', score: evaluation.comp3_score, feedback: evaluation.comp3_feedback },
    { name: 'Comp 4: Coesão', score: evaluation.comp4_score, feedback: evaluation.comp4_feedback },
    { name: 'Comp 5: Intervenção', score: evaluation.comp5_score, feedback: evaluation.comp5_feedback },
  ];

  const chartData = competencies.map(c => ({
    name: c.name.split(':')[0],
    value: c.score,
    fullName: c.name,
  }));

  const getScoreColor = (score: number) => {
    if (score >= 160) return 'text-primary';
    if (score >= 120) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sua Avaliação</h2>
        <div className="text-5xl font-bold text-primary">{evaluation.total_score}</div>
        <div className="text-gray-600">Pontos totais (máx: 1000)</div>
      </div>

      {/* Radar Chart */}
      <div className="mb-12 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Desempenho por Competência</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={90} domain={[0, 200]} />
            <Radar name="Score" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Feedback per Competency */}
      <div className="space-y-6 mb-12">
        {competencies.map((comp, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-gray-900">{comp.name}</h4>
              <div className={`text-2xl font-bold ${getScoreColor(comp.score)}`}>
                {comp.score}/200
              </div>
            </div>
            <p className="text-gray-700">{comp.feedback}</p>
          </div>
        ))}
      </div>

      {/* General Feedback */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h4 className="font-bold text-gray-900 mb-2">Feedback Geral</h4>
        <p className="text-gray-700 mb-4">{evaluation.general_feedback}</p>
        
        <h5 className="font-semibold text-gray-900 mb-3">Próximos passos recomendados:</h5>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {evaluation.top_priority_suggestions.map((suggestion, idx) => (
            <li key={idx}>{suggestion}</li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button className="flex-1 min-w-[150px] bg-primary text-white font-bold py-3 rounded-lg hover:bg-emerald-600 transition">
          Salvar Redação
        </button>
        <button className="flex-1 min-w-[150px] bg-secondary text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition">
          Compartilhar Progresso
        </button>
        <button className="flex-1 min-w-[150px] bg-accent text-white font-bold py-3 rounded-lg hover:bg-purple-600 transition">
          Escrever Novamente
        </button>
      </div>
    </div>
  );
}
