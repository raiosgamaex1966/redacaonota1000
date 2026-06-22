import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../utils/supabaseClient';

interface UserData {
  id: string;
  email: string;
  full_name: string | null;
  subscription_plan: string | null;
  trial_ends_at: string | null;
  created_at: string;
}

export default function MyAccount() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        setUserData(data);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  const getPlanName = (plan: string | null) => {
    switch (plan) {
      case 'monthly': return 'Mensal';
      case 'quarterly': return 'Trimestral';
      case 'annual': return 'Anual';
      default: return 'Gratuito (Trial)';
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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            ← Voltar ao Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-900">Minha Conta</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dados do perfil */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dados Pessoais</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Nome Completo</label>
                <div className="mt-1 text-lg text-gray-900">{userData?.full_name || 'Não informado'}</div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Email</label>
                <div className="mt-1 text-lg text-gray-900">{userData?.email}</div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Data de Cadastro</label>
                <div className="mt-1 text-lg text-gray-900">
                  {userData?.created_at ? new Date(userData.created_at).toLocaleDateString('pt-BR') : 'Não informado'}
                </div>
              </div>
            </div>
          </div>

          {/* Assinatura */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Minha Assinatura</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Plano Atual</label>
                <div className="mt-1 text-2xl font-bold text-primary">
                  {getPlanName(userData?.subscription_plan ?? null)}
                </div>
              </div>
              {userData?.trial_ends_at && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">Trial termina em</label>
                  <div className="mt-1 text-lg text-gray-900">
                    {new Date(userData.trial_ends_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              )}
              <div className="pt-6">
                <button
                  onClick={() => navigate('/plans')}
                  className="w-full bg-secondary text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition"
                >
                  Alterar Plano
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ações</h2>
          <button
            onClick={() => {
              if (window.confirm('Tem certeza que deseja sair da sua conta?')) {
                signOut();
              }
            }}
            className="w-full max-w-xs bg-red-100 text-red-700 font-bold py-3 rounded-lg hover:bg-red-200 transition"
          >
            Sair da Conta
          </button>
        </div>
      </div>
    </div>
  );
}
