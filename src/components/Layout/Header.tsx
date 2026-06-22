import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { useDarkMode } from '../../hooks/useDarkMode';

export default function Header() {
  const { user, signOut } = useAuth();
  const { isDark, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <h1
            className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent cursor-pointer"
            onClick={() => navigate('/')}
          >
            RCS Prime Redação Nota Mil
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            {user && (
              <div className="flex items-center gap-4">
                <span className="text-gray-700 dark:text-gray-300">
                  Olá, {user.user_metadata?.full_name?.split(' ')[0] || 'Estudante'}
                </span>
                <Link
                  to="/my-account"
                  className="text-primary hover:text-emerald-600 font-semibold px-4 py-2 rounded-lg transition"
                >
                  Minha Conta
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
