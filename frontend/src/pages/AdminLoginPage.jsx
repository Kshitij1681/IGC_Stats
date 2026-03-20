import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user?.role === 'admin') return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(form.username, form.password);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center page-enter">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl glass border border-cricket-green/30 items-center justify-center text-3xl mb-4 mx-auto">
            🔐
          </div>
          <h1 className="font-display font-700 text-3xl text-white mb-1">Admin Access</h1>
          <p className="text-slate-500 text-sm">IGNOU Cricket Club — Management Portal</p>
        </div>

        {/* Login Form */}
        <div className="glass-strong rounded-3xl p-8 border border-white/10">
          {error && (
            <div className="glass border border-red-400/30 bg-red-400/5 rounded-xl p-3 mb-6 text-red-400 text-sm font-display flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-display font-600 uppercase tracking-wider text-slate-500 mb-2">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                placeholder="admin"
                required
                className="glass-input w-full px-4 py-3 rounded-xl font-body text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-display font-600 uppercase tracking-wider text-slate-500 mb-2">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                required
                className="glass-input w-full px-4 py-3 rounded-xl font-body text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 rounded-xl font-display font-700 text-sm tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                '→ Login to Admin Panel'
              )}
            </button>
          </form>

          <div className="stats-divider my-6" />
          <p className="text-center text-xs text-slate-600 font-mono">
            Protected route · IGNOU Cricket Club {new Date().getFullYear()}
          </p>
        </div>

        {/* Register Admin hint */}
        <div className="mt-6 glass-card rounded-2xl p-4 border border-white/8">
          <p className="text-xs text-slate-600 text-center font-mono">
            First time setup? Use <code className="text-cricket-green">POST /api/auth/register-admin</code> with setup key.
          </p>
        </div>
      </div>
    </div>
  );
}
