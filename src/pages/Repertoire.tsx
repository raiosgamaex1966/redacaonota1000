import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

interface RepertoireItem {
  id: string;
  title: string;
  description: string;
  type: 'filme' | 'livro' | 'conceito' | 'dados' | 'historico' | 'legislacao';
  content: string;
  tags: string[];
}

const typeLabels: Record<RepertoireItem['type'], string> = {
  filme: 'Filme',
  livro: 'Livro',
  conceito: 'Conceito',
  dados: 'Dados',
  historico: 'História',
  legislacao: 'Legislação'
};

export default function Repertoire() {
  const navigate = useNavigate();
  const [repertoire, setRepertoire] = useState<RepertoireItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchRepertoire = async () => {
      try {
        const { data, error } = await supabase
          .from('repertoire')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setRepertoire(data || []);
      } catch (error) {
        console.error('Erro ao buscar repertório:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRepertoire();
  }, []);

  const filteredRepertoire = filter === 'all' 
    ? repertoire 
    : repertoire.filter(item => item.type === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-800">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            ← Voltar ao Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Repertório de Redação</h1>
          <p className="text-xl text-gray-600">
            Explore conteúdos para enriquecer suas redações
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { key: 'all', label: 'Todos' },
            { key: 'filme', label: 'Filmes' },
            { key: 'livro', label: 'Livros' },
            { key: 'conceito', label: 'Conceitos' },
            { key: 'dados', label: 'Dados' },
            { key: 'historico', label: 'História' },
            { key: 'legislacao', label: 'Legislação' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                filter === key
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid de repertório */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRepertoire.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                    {typeLabels[item.type]}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{item.description}</p>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.content}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-blue-50 text-primary px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
