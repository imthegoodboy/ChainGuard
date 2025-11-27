import { Shield, Menu, X, SunMedium, Moon } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

type NavbarProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};

export const Navbar = ({ currentPage, onNavigate, theme, onToggleTheme }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const navItems = user
    ? [
        { label: 'Home', value: 'home' },
        { label: 'Dashboard', value: 'dashboard' },
        { label: 'Scanner', value: 'scanner' },
        { label: 'Wallet', value: 'wallet' },
      ]
    : [{ label: 'Home', value: 'home' }];

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              ChainGuard AI
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => onNavigate(item.value)}
                className={`text-sm font-medium transition-colors ${
                  currentPage === item.value
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle color theme"
              className="p-2 rounded-full border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-gray-700" />
              ) : (
                <SunMedium className="w-4 h-4 text-yellow-300" />
              )}
            </button>
            {user ? (
              <div className="flex items-center space-x-4">
                {profile && (
                  <span className="text-sm text-gray-600">
                    {profile.free_scans_used}/5 free scans
                  </span>
                )}
                <button
                  onClick={signOut}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('auth')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            )}
          </div>

          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  onNavigate(item.value);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium ${
                  currentPage === item.value
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            {user ? (
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  onNavigate('auth');
                  setMobileMenuOpen(false);
                }}
                className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
              >
                Get Started
              </button>
            )}
            <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between px-1">
              <span className="text-xs text-gray-500 dark:text-slate-400">Theme</span>
              <button
                onClick={() => {
                  onToggleTheme();
                }}
                aria-label="Toggle color theme"
                className="p-2 rounded-full border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4 text-gray-700" />
                ) : (
                  <SunMedium className="w-4 h-4 text-yellow-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
