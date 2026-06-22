import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

interface UserProgress {
  userId: string;
  totalPontos: number;
  competencyPontos: Record<number, number>;
  badges: string[];
  streak: number;
}

export function useUserProgress(userId: string | undefined) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        // Total Pontos
        const { data: pontosData } = await supabase
          .from('user_pontos')
          .select('pontos_earned')
          .eq('user_id', userId);

        const totalPontos = pontosData?.reduce((sum, item) => sum + item.pontos_earned, 0) || 0;

        // Pontos per competency
        const { data: pontosByComp } = await supabase
          .from('user_pontos')
          .select('competency_id, pontos_earned')
          .eq('user_id', userId);

        const competencyPontos: Record<number, number> = {};
        pontosByComp?.forEach(item => {
          if (item.competency_id) {
            competencyPontos[item.competency_id] = 
              (competencyPontos[item.competency_id] || 0) + item.pontos_earned;
          }
        });

        // Badges
        const { data: badgesData } = await supabase
          .from('user_badges')
          .select('badge_name')
          .eq('user_id', userId);

        const badges = badgesData?.map(b => b.badge_name) || [];

        // Streak (simplified)
        const streak = 0;

        setProgress({
          userId,
          totalPontos,
          competencyPontos,
          badges,
          streak,
        });
      } catch (err) {
        console.error('Erro ao buscar progresso:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId]);

  return { progress, loading };
}
