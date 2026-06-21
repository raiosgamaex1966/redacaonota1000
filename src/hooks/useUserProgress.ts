import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

interface UserProgress {
  userId: string;
  totalXp: number;
  competencyXp: Record<number, number>;
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
        // Total XP
        const { data: xpData } = await supabase
          .from('user_xp')
          .select('xp_earned')
          .eq('user_id', userId);

        const totalXp = xpData?.reduce((sum, item) => sum + item.xp_earned, 0) || 0;

        // XP per competency
        const { data: xpByComp } = await supabase
          .from('user_xp')
          .select('competency_id, xp_earned')
          .eq('user_id', userId);

        const competencyXp: Record<number, number> = {};
        xpByComp?.forEach(item => {
          if (item.competency_id) {
            competencyXp[item.competency_id] = 
              (competencyXp[item.competency_id] || 0) + item.xp_earned;
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
          totalXp,
          competencyXp,
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
