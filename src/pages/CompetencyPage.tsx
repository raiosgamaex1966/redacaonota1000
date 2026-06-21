import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EssayEditor from '../components/Essay/EssayEditor';
import EvaluationResults from '../components/Essay/EvaluationResults';
import { supabase } from '../utils/supabaseClient';

interface EssayEvaluation {
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

interface CompetencyContent {
  id: number;
  name: string;
  description: string;
  learn: {
    quickReview: string;
    focus: string;
    topics: string[];
  };
  practice: {
    id: number;
    title: string;
    description: string;
    text?: string;
    phrases?: string[];
  }[];
  essayTheme: string;
}

const COMPETENCIES_DATA: Record<number, CompetencyContent> = {
  1: {
    id: 1,
    name: 'Dominar a norma culta da língua escrita',
    description: 'Uso correto da gramática, pontuação, concordância, regência, crase e vocabulário.',
    learn: {
      quickReview: 'Basicamente, é escrever de acordo com as regras da gramática formal. Isso inclui ortografia, concordância (verbal e nominal), regência (verbal e nominal), pontuação, crase, uso de maiúsculas/minúsculas e flexão de substantivos/adjetivos/verbos. Além disso, a fluidez na construção das frases e a escolha do vocabulário também são avaliadas.',
      focus: 'Um texto com pouquíssimos ou nenhum desvio gramatical e uma estrutura sintática clara e coesa, sem períodos truncados ou confusos. Um vocabulário variado e preciso também conta pontos aqui.',
      topics: [
        'Ortografia',
        'Pontuação (CRÍTICA!)',
        'Acentuação Gráfica',
        'Crase',
        'Concordância Verbal',
        'Concordância Nominal',
        'Regência Verbal',
        'Regência Nominal',
        'Colocação Pronominal',
        'Variação Linguística',
      ],
    },
    practice: [
      {
        id: 1,
        title: 'Caça aos Erros',
        description: 'Leia o parágrafo abaixo e identifique TODOS os erros gramaticais (ortografia, concordância, pontuação, crase).',
        text: 'Os jovens de hoje tem dificuldades em lidar com a pressão social. Muitas vezes, eles não conseguem concentrar em seus objetivos, visto que existe várias distrações a sua volta. Isso implica na formação de cidadãos menos preparados para o mercado de trabalho. Portanto, urge que o governo invista em políticas públicas que ajude no desenvolvimento psicológico desta juventude.',
      },
      {
        id: 2,
        title: 'Reescrita com Expansão',
        description: 'Reescreva as frases abaixo, tornando-as mais complexas e com vocabulário mais refinado, mantendo o sentido.',
        phrases: [
          'A poluição é ruim. Ela estraga o meio ambiente.',
          'Muitos alunos faltam aula. Isso afeta o aprendizado.',
        ],
      },
    ],
    essayTheme: 'A importância da educação financeira para jovens brasileiros',
  },
  2: {
    id: 2,
    name: 'Compreender a proposta e aplicar repertório sociocultural',
    description: 'Entender o tema, não fugir, e usar conhecimentos de diferentes áreas.',
    learn: {
      quickReview: 'Essa competência avalia se você ENTENDEU o tema da redação e se você consegue usar conhecimentos de outras áreas para embasar seus argumentos. Repertório sociocultural é todo conhecimento que você tem de mundo: filmes, livros, notícias, filósofos, teorias, dados estatísticos, histórias, etc.',
      focus: 'Um texto que NÃO FUJA do tema, que usa repertório de forma PRODUTIVA (não só joga um nome, mas o utiliza para desenvolver o argumento) e que demonstra domínio sobre o assunto.',
      topics: [
        'Análise da proposta de redação',
        'Tipos de repertório (dados, filosóficos, históricos, culturais)',
        'Como não fugir do tema',
        'Como aplicar repertório de forma produtiva',
        'Como ligar repertório ao tema',
      ],
    },
    practice: [
      {
        id: 1,
        title: 'Conectando Repertório ao Tema',
        description: 'Para o tema "A importância da preservação da Amazônia para o Brasil", relacione pelo menos 3 repertórios diferentes (um filme, um dado estatístico e um filósofo/teórico) com o tema e explique a conexão.',
      },
      {
        id: 2,
        title: 'Análise de Redações',
        description: 'Leia parágrafos de redações e identifique se o repertório foi usado de forma produtiva ou não.',
      },
    ],
    essayTheme: 'Desafios para a preservação da Amazônia no século XXI',
  },
  3: {
    id: 3,
    name: 'Selecionar, relacionar e interpretar informações',
    description: 'Construir uma tese clara e argumentos consistentes e coerentes.',
    learn: {
      quickReview: 'Essa competência avalia a qualidade da sua argumentação. Você precisa ter uma TESE CLARA (o que você defende?), argumentos que a defendam, e esses argumentos precisam estar conectados e fazer sentido juntos.',
      focus: 'Um texto com tese explícita, argumentos consistentes, sem contradições, com progressão temática (as ideias vão se desenvolvendo, não se repetem) e que responde ao "por quê?" das coisas.',
      topics: [
        'O que é uma tese',
        'Como construir argumentos sólidos',
        'Estrutura dissertativo-argumentativa',
        'Progressão temática',
        'Estratégias argumentativas (exemplos, comparações, dados)',
      ],
    },
    practice: [
      {
        id: 1,
        title: 'Construindo Tese e Argumentos',
        description: 'Para o tema "O papel da internet na democracia brasileira", escreva uma tese clara e pelo menos 2 argumentos que a defendam.',
      },
      {
        id: 2,
        title: 'Planejamento de Redação',
        description: 'Crie um plano/esqueleto de redação para um tema, definindo tese, argumentos de cada parágrafo e repertório.',
      },
    ],
    essayTheme: 'O papel da internet na democracia brasileira atual',
  },
  4: {
    id: 4,
    name: 'Conhecimento de mecanismos linguísticos de coesão',
    description: 'Usar conectivos, pronomes, sinônimos para ligar as ideias do texto.',
    learn: {
      quickReview: 'Essa competência avalia a COESÃO do texto, ou seja, como as suas ideias estão LIGADAS. Isso é feito através de conectivos (porém, portanto, além disso, etc.), pronomes (esse, ele, aquele), sinônimos, elipses, etc.',
      focus: 'Um texto fluido, sem "saltos" de ideias, onde os parágrafos e as frases estão conectados de forma lógica, sem repetir as mesmas palavras o tempo todo.',
      topics: [
        'Tipos de conectivos (aditivos, adversativos, consequenciais, explicativos)',
        'Coesão referencial (pronomes, sinônimos)',
        'Coesão sequencial',
        'Como evitar repetições',
      ],
    },
    practice: [
      {
        id: 1,
        title: 'Inserindo Conectivos',
        description: 'Leia o texto com lacunas e insira os conectivos mais adequados em cada espaço.',
      },
      {
        id: 2,
        title: 'Melhorando a Coesão',
        description: 'Reescreva um texto repetitivo, adicionando pronomes, sinônimos e conectivos para melhorar a coesão.',
      },
    ],
    essayTheme: 'Desafios da mobilidade urbana nas grandes cidades brasileiras',
  },
  5: {
    id: 5,
    name: 'Proposta de intervenção para o problema',
    description: 'Propor uma solução com os 5 elementos obrigatórios: agente, ação, meio/modo, finalidade e detalhamento.',
    learn: {
      quickReview: 'A última competência (e a única que você não pode zerar se quiser nota mil!) avalia sua capacidade de resolver o problema que você discutiu na redação. Lembre-se dos 5 elementos obrigatórios: 1. Agente Social (QUEM faz), 2. Ação (O QUE faz), 3. Meio/Modo (COMO faz), 4. Finalidade (PARA QUE faz) e 5. DETALHAMENTO de um desses.',
      focus: 'Uma proposta clara, específica, que respeita os Direitos Humanos, que é viável e que contém todos os 5 elementos obrigatórios.',
      topics: [
        'Os 5 elementos da proposta de intervenção',
        'Como não ser genérico',
        'Como detalhar um elemento',
        'Respeito aos Direitos Humanos',
      ],
    },
    practice: [
      {
        id: 1,
        title: 'Analisando Propostas',
        description: 'Leia propostas de intervenção de redações e identifique quais elementos estão presentes e quais estão faltando.',
      },
      {
        id: 2,
        title: 'Criando sua Própria Proposta',
        description: 'Para um tema específico, escreva uma proposta de intervenção completa com os 5 elementos.',
      },
    ],
    essayTheme: 'Formas de combater a desinformação nas redes sociais',
  },
};

export default function CompetencyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'aprenda' | 'pratique' | 'escreva'>('aprenda');
  const [evaluationId, setEvaluationId] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<EssayEvaluation | null>(null);

  const competencyId = parseInt(id || '1');
  const competency = COMPETENCIES_DATA[competencyId];

  const handleEvaluationComplete = async (evalId: string) => {
    setEvaluationId(evalId);
    const { data } = await supabase
      .from('essay_evaluations')
      .select('*')
      .eq('id', evalId)
      .single();
    if (data) {
      setEvaluation(data);
    }
  };

  if (!competency) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Competência não encontrada</h2>
          <button 
            onClick={() => navigate('/')}
            className="text-primary font-semibold hover:underline"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (evaluation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button 
            onClick={() => {
              setEvaluation(null);
              setEvaluationId(null);
            }}
            className="mb-6 text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            ← Voltar
          </button>
          <EvaluationResults evaluation={evaluation} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button 
            onClick={() => navigate('/')}
            className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            ← Voltar ao Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{competency.name}</h1>
          <p className="text-gray-600 mt-2">{competency.description}</p>
        </div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-8">
            {[
              { id: 'aprenda', label: '📚 Aprenda' },
              { id: 'pratique', label: '💪 Pratique' },
              { id: 'escreva', label: '✍️ Escreva' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 font-semibold border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary border-primary'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {activeTab === 'aprenda' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Revisão Rápida</h2>
              <p className="text-gray-700 leading-relaxed">
                {competency.learn.quickReview}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Foco do Estudo</h2>
              <p className="text-gray-700 leading-relaxed">
                {competency.learn.focus}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Tópicos Essenciais</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {competency.learn.topics.map((topic, idx) => (
                  <li key={idx}>{topic}</li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {activeTab === 'pratique' && (
          <div className="space-y-8">
            {competency.practice.map((exercise) => (
              <div key={exercise.id} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-3">{exercise.title}</h3>
                <p className="text-gray-700 mb-4">{exercise.description}</p>
                {exercise.text && (
                  <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                    {exercise.text}
                  </div>
                )}
                {exercise.phrases && (
                  <div className="space-y-3">
                    {exercise.phrases.map((phrase, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                        {phrase}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'escreva' && (
          <EssayEditor
            competencyId={competency.id}
            theme={competency.essayTheme}
            onEvaluationComplete={handleEvaluationComplete}
          />
        )}
      </div>
    </div>
  );
}
