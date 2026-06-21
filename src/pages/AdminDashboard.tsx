import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  subscription_plan: string | null;
  created_at: string;
  is_active: boolean;
}

interface Essay {
  id: string;
  user_id: string;
  theme: string;
  total_score: number | null;
  created_at: string;
  user_email: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [essays, setEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'essays'>('users');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const { data: usersData } = await supabase.from('users').select('*');
        if (usersData) setUsers(usersData as User[]);

        // Fetch essays
        const { data: essaysData } = await supabase
          .from('essays')
          .select(`
            id,
            user_id,
            theme,
            created_at,
            essay_evaluations ( total_score )
          `);
        
        if (essaysData) {
          const formattedEssays = essaysData.map(e => ({
            ...e,
            total_score: e.essay_evaluations[0]?.total_score || null,
            user_email: usersData?.find(u => u.id === e.user_id)?.email || 'Desconhecido'
          }));
          setEssays(formattedEssays as Essay[]);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleUserStatus = async (user: User) => {
    try {
      await supabase
        .from('users')
        .update({ is_active: !user.is_active })
        .eq('id', user.id);

      setUsers(users.map(u => 
        u.id === user.id ? { ...u, is_active: !u.is_active } : u
      ));
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  const updateUserPlan = async (user: User, newPlan: string) => {
    try {
      await supabase
        .from('users')
        .update({ subscription_plan: newPlan })
        .eq('id', user.id);

      setUsers(users.map(u => 
        u.id === user.id ? { ...u, subscription_plan: newPlan } : u
      ));
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-800">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Painel de Administração</h1>
          <p className="text-gray-600">Gerencie seus alunos e redações</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 pb-4">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-bold rounded-lg transition ${
              activeTab === 'users'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Alunos ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('essays')}
            className={`px-6 py-3 font-bold rounded-lg transition ${
              activeTab === 'essays'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Redações ({essays.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Nome</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Plano</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">{user.full_name || 'Sem nome'}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.subscription_plan || 'free'}
                        onChange={(e) => updateUserPlan(user, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg"
                      >
                        <option value="free">Gratuito</option>
                        <option value="monthly">Mensal</option>
                        <option value="quarterly">Trimestral</option>
                        <option value="annual">Anual</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleUserStatus(user)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                          user.is_active
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {user.is_active ? 'Desativar' : 'Ativar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'essays' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Aluno</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Tema</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Nota</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {essays.map(essay => (
                  <tr key={essay.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">{essay.user_email}</td>
                    <td className="px-6 py-4 text-gray-600">{essay.theme}</td>
                    <td className="px-6 py-4">
                      {essay.total_score !== null ? (
                        <span className={`font-bold ${
                          essay.total_score >= 800 ? 'text-primary' :
                          essay.total_score >= 600 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {essay.total_score}
                        </span>
                      ) : (
                        <span className="text-gray-400">Não avaliada</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(essay.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
