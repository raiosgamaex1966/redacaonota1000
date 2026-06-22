import { useAuth } from '../../hooks/useAuth';
import { useUserProgress } from '../../hooks/useUserProgress';
import { useNavigate } from 'react-router-dom';
import CompetencyCard from './CompetencyCard';

interface Competency {
  id: number;
  name: string;
  short_name: string;
  description: string;
  icon: string;
}

const COMPETENCIES: Competency[] = [
  {
    id: 1,
    name: 'Norma Culta',
    short_name: 'Competência 1',
    description: 'Dominar a norma culta da língua escrita',
    icon: '📝',
  },
  {
    id: 2,
    name: 'Compreensão e Repertório',
    short_name: 'Competência 2',
    description: 'Compreender a proposta e aplicar repertório sociocultural',
    icon: '🧠',
  },
  {
    id: 3,
    name: 'Argumentação',
    short_name: 'Competência 3',
    description: 'Selecionar, relacionar e interpretar informações',
    icon: '⚔️',
  },
  {
    id: 4,
    name: 'Mecanismos Linguísticos',
    short_name: 'Competência 4',
    description: 'Conhecimento de mecanismos linguísticos',
    icon: '🔗',
  },
  {
    id: 5,
    name: 'Proposta de Intervenção',
    short_name: 'Competência 5',
    description: 'Proposta de intervenção para o problema',
    icon: '💡',
  },
];

export default function DashboardMain() {
  const { user } = useAuth();
  const { progress } = useUserProgress(user?.id);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Carregando...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Olá, {user.user_metadata?.full_name || 'Estudante'}! 👋
        </h1>
        <p className="text-gray-600">
          Sua jornada rumo à nota mil começa aqui.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="text-3xl font-bold text-primary">{progress?.totalPontos || 0}</div>
          <div className="text-gray-600 text-sm">Pontos Total</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="text-3xl font-bold text-accent">{progress?.badges.length || 0}</div>
          <div className="text-gray-600 text-sm">Badges</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="text-3xl font-bold text-orange-600">🔥 {progress?.streak || 0}</div>
          <div className="text-gray-600 text-sm">Dias Consecutivos</div>
        </div>
      </div>

      {/* Competências */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Competências</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMPETENCIES.map((comp) => (
            <CompetencyCard
              key={comp.id}
              competency={comp}
              xpEarned={progress?.competencyPontos[comp.id] || 0}
            />
          ))}
        </div>
      </div>

      {/* CTA for repertório */}
      <div className="bg-gradient-to-r from-accent to-indigo-600 rounded-lg p-8 text-white mb-24">
        <h3 className="text-xl font-bold mb-2">Enriqueça seu repertório</h3>
        <p className="mb-4">Explore exemplos de filmes, livros, conceitos e dados para usar em suas redações.</p>
        <button
          onClick={() => navigate('/repertoire')}
          className="bg-white text-accent font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Acessar Repertório
        </button>
      </div>
    </div>
  );
}
