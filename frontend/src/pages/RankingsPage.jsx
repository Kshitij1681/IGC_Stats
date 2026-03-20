import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchRankings } from '../utils/api';

const medals = ['🥇', '🥈', '🥉'];
const rankColors = [
  'border-cricket-gold/40 bg-cricket-gold/5',
  'border-slate-400/30 bg-slate-400/5',
  'border-orange-600/30 bg-orange-600/5',
];

export default function RankingsPage() {
  const [bowlers, setBowlers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [highlight, setHighlight] = useState('wickets');

  useEffect(() => {
    fetchRankings()
      .then(d => { if (d.success) setBowlers(d.bowlers); else setError('Failed'); })
      .catch(() => setError('Server error'))
      .finally(() => setLoading(false));
  }, []);

  const roleColors = {
    'Fast': 'text-red-400', 'Medium': 'text-orange-400',
    'Medium-Fast': 'text-amber-400', 'Spin': 'text-cricket-teal',
    'Leg-Spin': 'text-purple-400', 'Off-Spin': 'text-cricket-blue',
  };

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><LoadingSpinner message="Computing rankings..." /></div>;
  if (error) return <div className="min-h-screen pt-24 flex items-center justify-center text-red-400">{error}</div>;

  const top3 = bowlers.slice(0, 3);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 page-enter">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 glass border border-cricket-gold/20 px-4 py-2 rounded-full text-xs font-mono text-cricket-gold mb-4 tracking-widest">
            🏆 BOWLING RANKINGS
          </div>
          <h1 className="font-display font-700 text-4xl sm:text-5xl mb-3">
            <span className="gradient-text-gold">Leaderboard</span>
          </h1>
          <p className="text-slate-500 text-sm">Ranked by Wickets → Economy → Strike Rate</p>
        </div>

        {/* Priority Info */}
        <div className="glass-card rounded-2xl p-4 mb-8 flex flex-wrap gap-3 justify-center">
          {[
            { label: 'Wickets', priority: 'Highest', color: 'text-cricket-green border-cricket-green/30 bg-cricket-green/5', icon: '🎯' },
            { label: 'Economy', priority: 'Medium', color: 'text-cricket-gold border-cricket-gold/30 bg-cricket-gold/5', icon: '📈' },
            { label: 'Strike Rate', priority: 'Lowest', color: 'text-cricket-blue border-cricket-blue/30 bg-cricket-blue/5', icon: '⚡' },
          ].map(p => (
            <div key={p.label} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-display font-600 ${p.color}`}>
              <span>{p.icon}</span>
              <span>{p.label}</span>
              <span className="text-xs opacity-60">({p.priority})</span>
            </div>
          ))}
        </div>

        {/* Top 3 Podium */}
        {top3.length >= 3 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[top3[1], top3[0], top3[2]].map((b, idx) => {
              const podiumIndex = idx === 1 ? 0 : idx === 0 ? 1 : 2;
              const isFirst = podiumIndex === 0;
              return (
                <div key={b._id} className={`glass-card rounded-2xl p-4 text-center border ${rankColors[podiumIndex]} ${isFirst ? 'scale-105 ring-1 ring-cricket-gold/30' : ''}`}>
                  <div className="text-3xl mb-2">{medals[podiumIndex]}</div>
                  <div className={`text-3xl font-mono font-700 ${isFirst ? 'neon-gold' : 'text-white'}`}>
                    #{b.rank}
                  </div>
                  <div className="font-display font-700 text-sm mt-1 text-white leading-tight">{b.name}</div>
                  <div className={`text-xs mt-1 ${roleColors[b.role] || 'text-slate-400'}`}>{b.role}</div>
                  <div className="stats-divider my-3" />
                  <div className="text-2xl font-mono font-700 neon-green">{b.overallStats?.wickets || 0}</div>
                  <div className="text-xs text-slate-500 font-display uppercase tracking-wider">wickets</div>
                  <div className="grid grid-cols-2 gap-1 mt-3">
                    <div className="glass rounded-lg p-1.5 text-center">
                      <div className="text-xs font-mono font-700 text-cricket-gold">{b.overallStats?.economy || '0.00'}</div>
                      <div className="text-[9px] text-slate-600 uppercase">Eco</div>
                    </div>
                    <div className="glass rounded-lg p-1.5 text-center">
                      <div className="text-xs font-mono font-700 text-cricket-blue">{b.overallStats?.strikeRate || '0.00'}</div>
                      <div className="text-[9px] text-slate-600 uppercase">SR</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full Rankings Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/8 flex items-center justify-between">
            <h2 className="font-display font-700 text-lg text-white">Full Rankings</h2>
            <span className="text-xs text-slate-500 font-mono">{bowlers.length} bowlers</span>
          </div>

          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-[2rem_1fr_5rem_5rem_5rem_5rem_5rem_5rem] gap-3 px-5 py-3 text-xs font-display uppercase tracking-wider text-slate-600 border-b border-white/5">
            <div>#</div>
            <div>Bowler</div>
            <div className="text-center">Matches</div>
            <div className="text-center">Overs</div>
            <div className="text-center text-cricket-green">Wickets</div>
            <div className="text-center text-cricket-gold">Economy</div>
            <div className="text-center text-cricket-blue">SR</div>
            <div className="text-center text-red-400">3W+</div>
          </div>

          <div className="divide-y divide-white/5">
            {bowlers.map((b, i) => {
              const s = b.overallStats || {};
              return (
                <div
                  key={b._id}
                  className={`rank-row px-5 py-4 transition-all
                    ${i < 3 ? 'bg-gradient-to-r from-cricket-gold/3 to-transparent' : ''}
                  `}
                >
                  {/* Mobile view */}
                  <div className="sm:hidden flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-700 text-sm
                      ${i === 0 ? 'bg-cricket-gold/20 text-cricket-gold' : i === 1 ? 'bg-slate-400/10 text-slate-300' : i === 2 ? 'bg-orange-600/15 text-orange-400' : 'bg-white/5 text-slate-500'}
                    `}>
                      {i < 3 ? medals[i] : b.rank}
                    </div>
                    <div className="flex-1">
                      <div className="font-display font-700 text-sm text-white">{b.name}</div>
                      <div className={`text-xs ${roleColors[b.role] || 'text-slate-400'}`}>{b.role} · #{b.jerseyNumber}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-700 text-lg neon-green">{s.wickets || 0}</div>
                      <div className="text-xs text-slate-500">wkts</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm text-cricket-gold">{s.economy || '0.00'}</div>
                      <div className="text-xs text-slate-500">eco</div>
                    </div>
                  </div>

                  {/* Desktop view */}
                  <div className="hidden sm:grid grid-cols-[2rem_1fr_5rem_5rem_5rem_5rem_5rem_5rem] gap-3 items-center">
                    <div className={`font-mono font-700 text-sm ${i === 0 ? 'text-cricket-gold' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-orange-400' : 'text-slate-600'}`}>
                      {i < 3 ? medals[i] : b.rank}
                    </div>
                    <div>
                      <div className="font-display font-700 text-sm text-white">{b.name}</div>
                      <div className={`text-xs ${roleColors[b.role] || 'text-slate-400'}`}>{b.role} · #{b.jerseyNumber}</div>
                    </div>
                    <div className="text-center font-mono text-sm text-slate-300">{s.matches || 0}</div>
                    <div className="text-center font-mono text-sm text-slate-300">{s.overs || 0}</div>
                    <div className="text-center font-mono font-700 text-base neon-green">{s.wickets || 0}</div>
                    <div className="text-center font-mono text-sm text-cricket-gold">{s.economy || '0.00'}</div>
                    <div className="text-center font-mono text-sm text-cricket-blue">{s.strikeRate || '0.00'}</div>
                    <div className="text-center font-mono text-sm text-red-400">{s.wicketHauls || 0}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
