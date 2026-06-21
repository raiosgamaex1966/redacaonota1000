export interface User {
  id: string;
  email: string;
  full_name?: string;
  trial_ends_at?: string;
  subscription_plan?: 'trial' | 'monthly' | 'quarterly' | 'annual';
  is_active?: boolean;
}

export interface Competency {
  id: number;
  name: string;
  short_name: string;
  description: string;
  icon: string;
}

export interface Essay {
  id: string;
  user_id: string;
  title?: string;
  content: string;
  theme: string;
  submitted_at: string;
  evaluated?: boolean;
}

export interface EssayEvaluation {
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

export interface UserProgress {
  userId: string;
  totalXp: number;
  competencyXp: Record<number, number>;
  badges: string[];
  streak: number;
}

export interface ClaudeEvaluationResult {
  competence_1: {
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  };
  competence_2: {
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  };
  competence_3: {
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  };
  competence_4: {
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  };
  competence_5: {
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  };
  total_score: number;
  overall_feedback: string;
  top_priority_suggestions: string[];
}
