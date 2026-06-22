import { Link } from 'react-router-dom';

interface Competency {
  id: number;
  name: string;
  short_name: string;
  description: string;
  icon: string;
}

interface CompetencyCardProps {
  competency: Competency;
  xpEarned: number;
}

export default function CompetencyCard({ competency, xpEarned }: CompetencyCardProps) {
  // Calculate progress (simplified: max Pontos per competency is 1000)
  const maxPontos = 1000;
  const progress = Math.min((xpEarned / maxPontos) * 100, 100);

  return (
    <Link
      to={`/competency/${competency.id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer dark:border dark:border-gray-700"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-4xl mb-2">{competency.icon}</div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{competency.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{competency.short_name}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progresso</span>
          <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary to-emerald-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        {xpEarned} Pontos
      </div>
    </Link>
  );
}
