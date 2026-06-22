import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../hooks/useAuth';

interface RepertoireItem {
  id: string;
  title: string;
  description: string;
  type: 'filme' | 'livro' | 'conceito' | 'dados' | 'historico' | 'legislacao';
  content: string;
  tags: string[];
  competency_ids: number[];
  source?: string;
  relevant_year?: number;
}

const typeLabels: Record<RepertoireItem['type'], string> = {
  filme: 'Filme',
  livro: 'Livro',
  conceito: 'Conceito',
  dados: 'Dados',
  historico: 'História',
  legislacao: 'Legislação'
};

export default function AdminRepertoire() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [repertoire, setRepertoire] = useState<RepertoireItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<RepertoireItem | null>(null);
  const [formData, setFormData] = useState<Partial<RepertoireItem>>({
    title: '',
    description: '',
    type: 'livro',
    content: '',
    tags: [],
    competency_ids: [],
    source: '',
    relevant_year: undefined
  });

  // Verifica se é admin
  const isAdmin = user?.email === 'robsoncordeiro1966@gmail.com';

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchRepertoire();
  }, [isAdmin]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        // Atualizar item existente
        const { error } = await supabase
          .from('repertoire')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        // Adicionar novo item
        const { error } = await supabase
          .from('repertoire')
          .insert([formData]);

        if (error) throw error;
      }

      // Resetar formulário
      setFormData({
        title: '',
        description: '',
        type: 'livro',
        content: '',
        tags: [],
        competency_ids: [],
        source: '',
        relevant_year: undefined
      });
      setIsAdding(false);
      setEditingItem(null);
      fetchRepertoire(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao salvar repertório:', error);
      alert('Erro ao salvar. Verifique os dados e tente novamente.');
    }
  };

  const handleEdit = (item: RepertoireItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;
    try {
      const { error } = await supabase
        .from('repertoire')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchRepertoire();
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsStr = e.target.value;
    const tags = tagsStr.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleCompetenciesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const compStr = e.target.value;
    const competency_ids = compStr.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    setFormData(prev => ({ ...prev, competency_ids }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <button
              onClick={() => navigate('/admin')}
              className="mb-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              ← Voltar ao Painel de Admin
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Repertório</h1>
            <p className="text-gray-600">Adicione, edite ou remova conteúdos do repertório</p>
          </div>
          <button
            onClick={() => {
              setIsAdding(!isAdding);
              if (!isAdding) {
                setEditingItem(null);
                setFormData({
                  title: '',
                  description: '',
                  type: 'livro',
                  content: '',
                  tags: [],
                  competency_ids: [],
                  source: '',
                  relevant_year: undefined
                });
              }
            }}
            className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 font-semibold"
          >
            {isAdding ? 'Cancelar' : '+ Adicionar Novo'}
          </button>
        </div>

        {/* Formulário de Adição/Edição */}
        {isAdding && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingItem ? 'Editar Item' : 'Adicionar Novo Item'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Título</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo</label>
                  <select
                    value={formData.type || 'livro'}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {Object.entries(typeLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição</label>
                <input
                  type="text"
                  required
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Conteúdo</label>
                <textarea
                  required
                  rows={6}
                  value={formData.content || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tags (separadas por vírgula)</label>
                  <input
                    type="text"
                    placeholder="tag1, tag2, tag3"
                    value={formData.tags?.join(', ') || ''}
                    onChange={handleTagsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Competências (IDs separados por vírgula)</label>
                  <input
                    type="text"
                    placeholder="1, 2, 3"
                    value={formData.competency_ids?.join(', ') || ''}
                    onChange={handleCompetenciesChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Fonte (opcional)</label>
                  <input
                    type="text"
                    value={formData.source || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Ano Relevante (opcional)</label>
                  <input
                    type="number"
                    value={formData.relevant_year || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, relevant_year: e.target.value ? parseInt(e.target.value) : undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-emerald-500 text-white px-6 py-2 rounded hover:bg-emerald-600 font-semibold"
                >
                  {editingItem ? 'Atualizar' : 'Salvar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingItem(null);
                  }}
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Itens */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Título</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Descrição</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {repertoire.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.title}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                      {typeLabels[item.type]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.description}</td>
                  <td className="px-6 py-4 text-right text-sm">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {repertoire.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Nenhum item no repertório ainda. Adicione o primeiro!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
