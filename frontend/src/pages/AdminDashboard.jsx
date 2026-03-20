import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  adminFetchBowlers, adminAddBowler, adminUpdateBowler,
  adminUpdateStats, adminDeleteBowler,
  adminAnnounceBowlerOfWeek, fetchBowlerOfWeekHistory, adminDeleteBowlerOfWeek
} from '../utils/api';

const ROLES = ['Fast', 'Medium', 'Medium-Fast', 'Spin', 'Leg-Spin', 'Off-Spin'];
const EMPTY_STATS = { matches: 0, overs: 0, wickets: 0, runsConceded: 0, wicketHauls: 0 };
const EMPTY_BOWLER = { name: '', jerseyNumber: '', role: 'Fast', avatar: '', homeStats: { ...EMPTY_STATS }, awayStats: { ...EMPTY_STATS } };

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-[100] glass-strong border rounded-2xl px-5 py-3 font-display font-600 text-sm flex items-center gap-3 animate-slide-in
      ${type === 'success' ? 'border-cricket-green/30 text-cricket-green' : 'border-red-400/30 text-red-400'}`}>
      <span>{type === 'success' ? '✅' : '❌'}</span>
      {msg}
    </div>
  );
}

function StatsForm({ stats, onChange, prefix }) {
  const fields = [
    { key: 'matches', label: 'Matches', color: 'text-cricket-teal' },
    { key: 'overs', label: 'Overs', color: 'text-cricket-blue' },
    { key: 'wickets', label: 'Wickets', color: 'text-cricket-green' },
    { key: 'runsConceded', label: 'Runs', color: 'text-cricket-gold' },
    { key: 'wicketHauls', label: '3W+ Hauls', color: 'text-red-400' },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {fields.map(f => (
        <div key={f.key}>
          <label className={`block text-[10px] font-display font-600 uppercase tracking-wider mb-1 ${f.color}`}>{f.label}</label>
          <input
            type="number"
            min="0"
            value={stats[f.key] ?? 0}
            onChange={e => onChange(prefix, f.key, parseInt(e.target.value) || 0)}
            className="glass-input w-full px-3 py-2 rounded-xl text-sm font-mono"
          />
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const { token, user, logout } = useAuth();
  const [bowlers, setBowlers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('bowlers');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBowler, setNewBowler] = useState({ ...EMPTY_BOWLER });
  const [bowlerOfWeekForm, setBowlerOfWeekForm] = useState({ bowlerId: '', weekStartDate: '', weekEndDate: '', reason: '', highlights: { wicketsTaken: 0, economy: 0, matchesPlayed: 0 } });
  const [bowHistory, setBowHistory] = useState([]);

  const showToast = (msg, type = 'success') => setToast({ msg, type });
  const clearToast = () => setToast(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bd, bh] = await Promise.all([adminFetchBowlers(token), fetchBowlerOfWeekHistory()]);
      if (bd.success) setBowlers(bd.bowlers);
      if (bh.success) setBowHistory(bh.history);
    } catch { showToast('Failed to load data', 'error'); }
    setLoading(false);
  };

  const startEdit = (bowler) => {
    setEditingId(bowler._id);
    setEditForm({
      name: bowler.name, jerseyNumber: bowler.jerseyNumber, role: bowler.role, avatar: bowler.avatar || '',
      homeStats: { ...EMPTY_STATS, ...(bowler.homeStats || {}) },
      awayStats: { ...EMPTY_STATS, ...(bowler.awayStats || {}) },
    });
  };

  const handleStatChange = (form, setForm) => (prefix, key, val) => {
    setForm(p => ({ ...p, [`${prefix}Stats`]: { ...p[`${prefix}Stats`], [key]: val } }));
  };

  const saveEdit = async () => {
    const res = await adminUpdateBowler(token, editingId, editForm);
    if (res.success) {
      showToast('Bowler updated!');
      setEditingId(null);
      loadData();
    } else showToast(res.message || 'Update failed', 'error');
  };

  const handleAddBowler = async () => {
    if (!newBowler.name || !newBowler.jerseyNumber) return showToast('Name & jersey required', 'error');
    const res = await adminAddBowler(token, { ...newBowler, jerseyNumber: parseInt(newBowler.jerseyNumber) });
    if (res.success) {
      showToast('Bowler added!');
      setNewBowler({ ...EMPTY_BOWLER });
      setShowAddForm(false);
      loadData();
    } else showToast(res.message || 'Failed to add bowler', 'error');
  };

  const handleDeactivate = async (id, name) => {
    if (!confirm(`Deactivate ${name}?`)) return;
    const res = await adminDeleteBowler(token, id);
    if (res.success) { showToast('Bowler deactivated'); loadData(); }
    else showToast(res.message || 'Failed', 'error');
  };

  const handleReactivate = async (id) => {
    const res = await adminUpdateBowler(token, id, { isActive: true });
    if (res.success) { showToast('Bowler reactivated'); loadData(); }
    else showToast(res.message || 'Failed', 'error');
  };

  const handleAnnounceBOW = async () => {
    if (!bowlerOfWeekForm.bowlerId || !bowlerOfWeekForm.reason) return showToast('Select bowler and add reason', 'error');
    const res = await adminAnnounceBowlerOfWeek(token, { ...bowlerOfWeekForm, highlights: bowlerOfWeekForm.highlights });
    if (res.success) { showToast('Bowler of Week announced!'); loadData(); setBowlerOfWeekForm({ bowlerId: '', weekStartDate: '', weekEndDate: '', reason: '', highlights: { wicketsTaken: 0, economy: 0, matchesPlayed: 0 } }); }
    else showToast(res.message || 'Failed', 'error');
  };

  const handleDeleteBOW = async (id) => {
    if (!confirm('Remove this announcement?')) return;
    const res = await adminDeleteBowlerOfWeek(token, id);
    if (res.success) { showToast('Removed'); loadData(); }
    else showToast('Failed', 'error');
  };

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><LoadingSpinner message="Loading admin panel..." /></div>;

  const activeBowlers = bowlers.filter(b => b.isActive);
  const inactiveBowlers = bowlers.filter(b => !b.isActive);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 page-enter">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={clearToast} />}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 glass border border-cricket-green/20 px-3 py-1.5 rounded-full text-xs font-mono text-cricket-green mb-2 tracking-widest">
              <span className="w-2 h-2 rounded-full bg-cricket-green animate-pulse" />
              ADMIN PANEL
            </div>
            <h1 className="font-display font-700 text-3xl text-white">Management Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Welcome, <span className="text-cricket-green">{user?.username}</span></p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setShowAddForm(true); setActiveTab('bowlers'); }}
              className="btn-primary px-5 py-2.5 rounded-xl font-display font-700 text-sm flex items-center gap-2">
              <span>+</span> Add Bowler
            </button>
            <button onClick={logout} className="btn-secondary px-4 py-2.5 rounded-xl font-display font-600 text-sm border border-white/10">
              Logout
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Active Bowlers', value: activeBowlers.length, color: 'border-cricket-green/20 text-cricket-green' },
            { label: 'Inactive', value: inactiveBowlers.length, color: 'border-slate-600/30 text-slate-500' },
            { label: 'BOW Announcements', value: bowHistory.length, color: 'border-cricket-gold/20 text-cricket-gold' },
            { label: 'Total Wickets', value: activeBowlers.reduce((s, b) => s + ((b.homeStats?.wickets || 0) + (b.awayStats?.wickets || 0)), 0), color: 'border-cricket-teal/20 text-cricket-teal' },
          ].map((s, i) => (
            <div key={i} className={`glass-card rounded-xl p-4 border ${s.color.split(' ')[0]} text-center`}>
              <div className={`font-mono font-700 text-2xl ${s.color.split(' ')[1]}`}>{s.value}</div>
              <div className="text-xs text-slate-600 font-display uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tab Nav */}
        <div className="flex gap-2 mb-6 glass-card rounded-2xl p-2">
          {[
            { id: 'bowlers', label: '🏏 Bowlers', count: activeBowlers.length },
            { id: 'inactive', label: '⚪ Inactive', count: inactiveBowlers.length },
            { id: 'bow', label: '⭐ Bowler of Week', count: bowHistory.length },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-display font-600 transition-all flex items-center justify-center gap-2 ${
                activeTab === t.id ? 'glass border border-cricket-green/25 text-cricket-green' : 'text-slate-500 hover:text-slate-300'
              }`}>
              {t.label}
              <span className="glass px-1.5 py-0.5 rounded-lg text-xs font-mono">{t.count}</span>
            </button>
          ))}
        </div>

        {/* Add Bowler Modal */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setShowAddForm(false)}>
            <div className="glass-strong border border-white/15 rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-700 text-xl text-white">Add New Bowler</h2>
                <button onClick={() => setShowAddForm(false)} className="text-slate-500 hover:text-white text-xl">✕</button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-display font-600 uppercase tracking-wider text-slate-500 mb-1.5">Name *</label>
                    <input type="text" value={newBowler.name} onChange={e => setNewBowler(p => ({ ...p, name: e.target.value }))}
                      placeholder="Full name" className="glass-input w-full px-3 py-2.5 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-display font-600 uppercase tracking-wider text-slate-500 mb-1.5">Jersey # *</label>
                    <input type="number" value={newBowler.jerseyNumber} onChange={e => setNewBowler(p => ({ ...p, jerseyNumber: e.target.value }))}
                      placeholder="10" className="glass-input w-full px-3 py-2.5 rounded-xl text-sm font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-display font-600 uppercase tracking-wider text-slate-500 mb-1.5">Role *</label>
                  <select value={newBowler.role} onChange={e => setNewBowler(p => ({ ...p, role: e.target.value }))}
                    className="glass-input w-full px-3 py-2.5 rounded-xl text-sm cursor-pointer">
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-display font-600 uppercase tracking-wider text-slate-500 mb-1.5">Avatar URL (optional)</label>
                  <input type="url" value={newBowler.avatar} onChange={e => setNewBowler(p => ({ ...p, avatar: e.target.value }))}
                    placeholder="https://..." className="glass-input w-full px-3 py-2.5 rounded-xl text-sm" />
                </div>
                <div>
                  <div className="text-xs font-display font-600 uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5"><span>🏠</span> Home Stats (optional)</div>
                  <StatsForm stats={newBowler.homeStats} onChange={(prefix, key, val) => setNewBowler(p => ({ ...p, homeStats: { ...p.homeStats, [key]: val } }))} prefix="home" />
                </div>
                <div>
                  <div className="text-xs font-display font-600 uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5"><span>✈️</span> Away Stats (optional)</div>
                  <StatsForm stats={newBowler.awayStats} onChange={(prefix, key, val) => setNewBowler(p => ({ ...p, awayStats: { ...p.awayStats, [key]: val } }))} prefix="away" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleAddBowler} className="btn-primary flex-1 py-3 rounded-xl font-display font-700 text-sm">✓ Add Bowler</button>
                  <button onClick={() => setShowAddForm(false)} className="btn-secondary flex-1 py-3 rounded-xl font-display font-600 text-sm border border-white/10">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Bowler Modal */}
        {editingId && editForm && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setEditingId(null)}>
            <div className="glass-strong border border-white/15 rounded-3xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-700 text-xl text-white">Edit Bowler</h2>
                <button onClick={() => setEditingId(null)} className="text-slate-500 hover:text-white text-xl">✕</button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-display font-600 uppercase tracking-wider text-slate-500 mb-1.5">Name</label>
                    <input type="text" value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                      className="glass-input w-full px-3 py-2.5 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-display font-600 uppercase tracking-wider text-slate-500 mb-1.5">Jersey #</label>
                    <input type="number" value={editForm.jerseyNumber} onChange={e => setEditForm(p => ({ ...p, jerseyNumber: parseInt(e.target.value) || 0 }))}
                      className="glass-input w-full px-3 py-2.5 rounded-xl text-sm font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-display font-600 uppercase tracking-wider text-slate-500 mb-1.5">Role</label>
                  <select value={editForm.role} onChange={e => setEditForm(p => ({ ...p, role: e.target.value }))}
                    className="glass-input w-full px-3 py-2.5 rounded-xl text-sm cursor-pointer">
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-display font-600 uppercase tracking-wider text-slate-500 mb-1.5">Avatar URL</label>
                  <input type="url" value={editForm.avatar} onChange={e => setEditForm(p => ({ ...p, avatar: e.target.value }))}
                    placeholder="https://..." className="glass-input w-full px-3 py-2.5 rounded-xl text-sm" />
                </div>
                <div>
                  <div className="text-xs font-display font-600 uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5"><span>🏠</span> Home Stats</div>
                  <StatsForm stats={editForm.homeStats} onChange={(prefix, key, val) => setEditForm(p => ({ ...p, homeStats: { ...p.homeStats, [key]: val } }))} prefix="home" />
                </div>
                <div>
                  <div className="text-xs font-display font-600 uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5"><span>✈️</span> Away Stats</div>
                  <StatsForm stats={editForm.awayStats} onChange={(prefix, key, val) => setEditForm(p => ({ ...p, awayStats: { ...p.awayStats, [key]: val } }))} prefix="away" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={saveEdit} className="btn-primary flex-1 py-3 rounded-xl font-display font-700 text-sm">✓ Save Changes</button>
                  <button onClick={() => setEditingId(null)} className="btn-secondary flex-1 py-3 rounded-xl font-display font-600 text-sm border border-white/10">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOWLERS TAB */}
        {activeTab === 'bowlers' && (
          <div className="space-y-3">
            {activeBowlers.length === 0 ? (
              <div className="glass-card rounded-2xl p-10 text-center">
                <p className="text-slate-500 font-display">No active bowlers yet. Add one!</p>
              </div>
            ) : activeBowlers.map(b => (
              <div key={b._id} className="glass-card rounded-2xl p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cricket-green/20 to-cricket-teal/20 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-display font-700 text-sm text-white">
                        {b.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-display font-700 text-white text-sm">{b.name}</div>
                      <div className="text-xs text-slate-500 font-mono">#{b.jerseyNumber} · {b.role}</div>
                    </div>
                  </div>
                  {/* Quick stats */}
                  <div className="flex gap-4 text-center">
                    {[
                      { label: 'M', value: (b.homeStats?.matches || 0) + (b.awayStats?.matches || 0), color: 'text-cricket-teal' },
                      { label: 'W', value: (b.homeStats?.wickets || 0) + (b.awayStats?.wickets || 0), color: 'text-cricket-green' },
                      { label: 'Eco', value: (() => { const o = (b.homeStats?.overs||0)+(b.awayStats?.overs||0); const r = (b.homeStats?.runsConceded||0)+(b.awayStats?.runsConceded||0); return o > 0 ? (r/o).toFixed(2) : '0.00'; })(), color: 'text-cricket-gold' },
                    ].map(s => (
                      <div key={s.label}>
                        <div className={`font-mono font-700 text-base ${s.color}`}>{s.value}</div>
                        <div className="text-[9px] text-slate-600 uppercase font-display">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(b)}
                      className="px-3 py-2 rounded-xl glass border border-cricket-blue/25 text-cricket-blue text-xs font-display font-600 hover:bg-cricket-blue/10 transition-all">
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDeactivate(b._id, b.name)}
                      className="px-3 py-2 rounded-xl glass border border-red-400/20 text-red-400 text-xs font-display font-600 hover:bg-red-400/10 transition-all">
                      🗑 Deactivate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* INACTIVE TAB */}
        {activeTab === 'inactive' && (
          <div className="space-y-3">
            {inactiveBowlers.length === 0 ? (
              <div className="glass-card rounded-2xl p-10 text-center">
                <p className="text-slate-500 font-display">No inactive bowlers.</p>
              </div>
            ) : inactiveBowlers.map(b => (
              <div key={b._id} className="glass-card rounded-2xl p-4 opacity-60 hover:opacity-80 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0">
                    <span className="font-display font-700 text-sm text-slate-500">
                      {b.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-display font-600 text-slate-300 text-sm line-through">{b.name}</div>
                    <div className="text-xs text-slate-600 font-mono">#{b.jerseyNumber} · {b.role}</div>
                  </div>
                  <button onClick={() => handleReactivate(b._id)}
                    className="px-3 py-2 rounded-xl glass border border-cricket-green/25 text-cricket-green text-xs font-display font-600 hover:bg-cricket-green/10 transition-all">
                    ↩ Reactivate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOWLER OF WEEK TAB */}
        {activeTab === 'bow' && (
          <div className="space-y-5">
            {/* Announce Form */}
            <div className="glass-card rounded-2xl p-5 border border-cricket-gold/15">
              <h3 className="font-display font-700 text-base text-white mb-4 flex items-center gap-2"><span>⭐</span> Announce Bowler of the Week</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[10px] font-display uppercase tracking-wider text-slate-500 mb-1.5">Select Bowler *</label>
                  <select value={bowlerOfWeekForm.bowlerId} onChange={e => setBowlerOfWeekForm(p => ({ ...p, bowlerId: e.target.value }))}
                    className="glass-input w-full px-3 py-2.5 rounded-xl text-sm cursor-pointer">
                    <option value="">— Choose Bowler —</option>
                    {activeBowlers.map(b => <option key={b._id} value={b._id}>{b.name} (#{b.jerseyNumber})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-display uppercase tracking-wider text-slate-500 mb-1.5">Week Start Date</label>
                  <input type="date" value={bowlerOfWeekForm.weekStartDate} onChange={e => setBowlerOfWeekForm(p => ({ ...p, weekStartDate: e.target.value }))}
                    className="glass-input w-full px-3 py-2.5 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-display uppercase tracking-wider text-slate-500 mb-1.5">Week End Date</label>
                  <input type="date" value={bowlerOfWeekForm.weekEndDate} onChange={e => setBowlerOfWeekForm(p => ({ ...p, weekEndDate: e.target.value }))}
                    className="glass-input w-full px-3 py-2.5 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-display uppercase tracking-wider text-slate-500 mb-1.5">Wickets This Week</label>
                  <input type="number" min="0" value={bowlerOfWeekForm.highlights.wicketsTaken} onChange={e => setBowlerOfWeekForm(p => ({ ...p, highlights: { ...p.highlights, wicketsTaken: parseInt(e.target.value) || 0 } }))}
                    className="glass-input w-full px-3 py-2.5 rounded-xl text-sm font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] font-display uppercase tracking-wider text-slate-500 mb-1.5">Economy This Week</label>
                  <input type="number" step="0.01" min="0" value={bowlerOfWeekForm.highlights.economy} onChange={e => setBowlerOfWeekForm(p => ({ ...p, highlights: { ...p.highlights, economy: parseFloat(e.target.value) || 0 } }))}
                    className="glass-input w-full px-3 py-2.5 rounded-xl text-sm font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] font-display uppercase tracking-wider text-slate-500 mb-1.5">Matches Played</label>
                  <input type="number" min="0" value={bowlerOfWeekForm.highlights.matchesPlayed} onChange={e => setBowlerOfWeekForm(p => ({ ...p, highlights: { ...p.highlights, matchesPlayed: parseInt(e.target.value) || 0 } }))}
                    className="glass-input w-full px-3 py-2.5 rounded-xl text-sm font-mono" />
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-[10px] font-display uppercase tracking-wider text-slate-500 mb-1.5">Reason / Citation *</label>
                <textarea value={bowlerOfWeekForm.reason} onChange={e => setBowlerOfWeekForm(p => ({ ...p, reason: e.target.value }))}
                  rows={3} placeholder="Why this bowler deserves the award this week..."
                  className="glass-input w-full px-3 py-2.5 rounded-xl text-sm resize-none" />
              </div>
              <button onClick={handleAnnounceBOW} className="btn-primary px-6 py-2.5 rounded-xl font-display font-700 text-sm">
                ⭐ Announce Now
              </button>
            </div>

            {/* History */}
            {bowHistory.length > 0 && (
              <div>
                <h3 className="font-display font-700 text-base text-white mb-3">Announcement History</h3>
                <div className="space-y-3">
                  {bowHistory.map((item, i) => (
                    <div key={item._id} className={`glass-card rounded-2xl p-4 flex items-center gap-4 ${i === 0 ? 'border border-cricket-gold/20' : ''}`}>
                      {i === 0 && <span className="text-lg flex-shrink-0">⭐</span>}
                      <div className="flex-1 min-w-0">
                        <div className="font-display font-700 text-sm text-white">{item.bowler?.name || 'Unknown'}</div>
                        <div className="text-xs text-slate-500 font-mono truncate">
                          {new Date(item.weekStartDate).toLocaleDateString()} — {item.reason?.slice(0, 50)}...
                        </div>
                      </div>
                      <button onClick={() => handleDeleteBOW(item._id)}
                        className="flex-shrink-0 px-3 py-1.5 rounded-xl glass border border-red-400/20 text-red-400 text-xs hover:bg-red-400/10 transition-all">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
