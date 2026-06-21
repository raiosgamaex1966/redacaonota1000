import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMercadoPagoPreference } from '../utils/mercadopago';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Gratuito (Trial)',
    price: 0,
    period: '/7 dias',
    features: [
      'Acesso à Competência 1',
      '3 avaliações de redação',
      'Conteúdo básico',
    ],
  },
  {
    id: 'monthly',
    name: 'Mensal',
    price: 49.90,
    period: '/mês',
    features: [
      'Acesso a TODAS as 5 competências',
      '10 avaliações de redação por mês',
      'Banco completo de repertório',
      'Histórico de redações',
      'Suporte por email',
    ],
    popular: true,
  },
  {
    id: 'quarterly',
    name: 'Trimestral',
    price: 129.90,
    period: '/3 meses',
    features: [
      'Acesso a TODAS as 5 competências',
      '30 avaliações de redação (10/mês)',
      'Banco completo de repertório',
      'Histórico de redações',
      'Suporte por email e chat',
      '1 sessão de mentoria por mês',
    ],
  },
  {
    id: 'annual',
    name: 'Anual',
    price: 399.90,
    period: '/ano',
    features: [
      'Acesso a TODAS as 5 competências',
      '120 avaliações de redação (10/mês)',
      'Banco completo de repertório',
      'Histórico de redações',
      'Suporte prioritário',
      '2 sessões de mentoria por mês',
      'Acesso a materiais exclusivos',
    ],
  },
];

export default function SubscriptionPlans() {
  const [loading, setLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubscribe = async (plan: Plan) => {
    if (plan.id === 'free') {
      setLoading(plan.id);
      setTimeout(() => {
        setLoading(null);
        alert('Plano gratuito ativado!');
        navigate('/');
      }, 1000);
      return;
    }
    
    setLoading(plan.id);
    const success = await createMercadoPagoPreference(plan);
    if (success) {
      setLoading(null);
      navigate('/');
    } else {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Escolha o seu plano</h2>
          <p className="text-xl text-gray-600">
            Invista no seu futuro e conquiste a nota mil no ENEM!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular ? 'border-2 border-primary' : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-2 text-sm font-bold">
                  MAIS ESCOLHIDO
                </div>
              )}

              <div className="p-6 pt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-end mb-6">
                  <span className="text-4xl font-bold text-primary">R$ {plan.price.toFixed(2)}</span>
                  <span className="text-gray-600 ml-1 mb-1">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-primary text-lg mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading === plan.id}
                  className={`w-full py-3 rounded-lg font-bold transition ${
                    plan.popular
                      ? 'bg-primary text-white hover:bg-emerald-600'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {loading === plan.id ? 'Processando...' : 'Escolher Plano'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
