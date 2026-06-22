import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Header from './components/Layout/Header';
import LoginForm from './components/Auth/LoginForm';
import SignUpForm from './components/Auth/SignUpForm';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import CompetencyPage from './pages/CompetencyPage';
import SubscriptionPlans from './pages/SubscriptionPlans';
import AdminDashboard from './pages/AdminDashboard';
import MyAccount from './pages/MyAccount';
import Repertoire from './pages/Repertoire';
import AdminRepertoire from './pages/AdminRepertoire';

function App() {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-800">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    if (authMode === 'login') {
      return <LoginForm onToggleMode={() => setAuthMode('signup')} />;
    } else {
      return <SignUpForm onToggleMode={() => setAuthMode('login')} />;
    }
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/competency/:id" element={<CompetencyPage />} />
          <Route path="/plans" element={<SubscriptionPlans />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/repertoire" element={<Repertoire />} />
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/repertoire" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminRepertoire />
            </ProtectedRoute>
          } />
        </Routes>

        {/* Floating button for admin (temporary, for easy access) */}
        {user.email === 'robsoncordeiro1966@gmail.com' && (
          <Link
            to="/admin"
            className="fixed bottom-8 right-8 bg-accent text-white p-4 rounded-full shadow-lg hover:bg-purple-600 transition z-50"
          >
            🛠️ Admin
          </Link>
        )}

        {/* Floating button for plans */}
        <Link
          to="/plans"
          className="fixed bottom-8 left-8 bg-secondary text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition z-50"
        >
          💳 Planos
        </Link>
      </div>
    </Router>
  );
}

export default App;
