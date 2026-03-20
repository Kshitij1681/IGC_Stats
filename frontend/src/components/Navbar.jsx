import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Bowlers', icon: '🏏' },
  { to: '/rankings', label: 'Rankings', icon: '🏆' },
  { to: '/bowler-of-week', label: 'Bowler of Week', icon: '⭐' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass border-b border-white/10 py-3' : 'py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl glass flex items-center justify-center border border-cricket-green/30 group-hover:border-cricket-green/60 transition-all">
            <span className="text-xl">🏏</span>
          </div>
          <div className="hidden sm:block">
            <div className="font-display font-700 text-sm leading-tight gradient-text">IGNOU CRICKET CLUB</div>
            <div className="text-xs text-slate-500 font-mono tracking-widest">BOWLING STATS</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-display font-600 text-sm transition-all duration-200 ${
                pathname === to
                  ? 'glass border border-cricket-green/30 text-cricket-green'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-display font-600 transition-all ${
                  pathname.startsWith('/admin')
                    ? 'btn-primary'
                    : 'glass border border-white/10 text-slate-300 hover:border-cricket-green/30 hover:text-cricket-green'
                }`}
              >
                <span>⚙️</span>
                <span>Admin</span>
              </Link>
              <button
                onClick={logout}
                className="px-3 py-2 rounded-xl glass border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-400/30 text-sm font-display transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/admin/login"
              className="px-4 py-2 rounded-xl glass border border-white/10 text-slate-400 hover:text-cricket-green hover:border-cricket-green/30 text-sm font-display transition-all"
            >
              Admin
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden glass border border-white/10 p-2 rounded-xl text-slate-400"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden glass-strong border-t border-white/10 mt-2 mx-4 rounded-2xl p-4 space-y-1">
          {navLinks.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-display font-600 transition-all ${
                pathname === to
                  ? 'bg-cricket-green/10 border border-cricket-green/20 text-cricket-green'
                  : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
          {user && (
            <>
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-display font-600 text-slate-400 hover:bg-white/5 transition-all"
              >
                <span>⚙️</span>
                <span>Admin Dashboard</span>
              </Link>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl font-display font-600 text-red-400 hover:bg-red-400/10 transition-all"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
