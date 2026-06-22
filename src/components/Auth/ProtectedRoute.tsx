import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../utils/supabaseClient';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [checkingAdmin, setCheckingAdmin] = useState(requireAdmin);

  useEffect(() => {
    const checkUser = async () => {
      if (loading) return;

      if (!user) {
        navigate('/');
        return;
      }

      if (requireAdmin) {
        const { data } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (!data?.is_admin && user.email !== 'robsoncordeiro1966@gmail.com') {
          navigate('/');
          return;
        }
      }

      setCheckingAdmin(false);
    };

    checkUser();
  }, [user, loading, requireAdmin, navigate]);

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-800">Carregando...</div>
      </div>
    );
  }

  return <>{children}</>;
}
