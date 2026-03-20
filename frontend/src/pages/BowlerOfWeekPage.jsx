import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchBowlerOfWeek, fetchBowlerOfWeekHistory } from '../utils/api';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isSundayEvening() {
  const now = new Date();
  return now.getDay() === 0 && now.getHours() >= 18;
}

export default function BowlerOfWeekPage() {
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchBowlerOfWeek(), fetchBowlerOfWeekHistory()])
      .then(([curr, hist]) => {
        if (curr.success) setCurrent(curr.bowlerOfWeek);
        if (hist.success) setHistory(hist.history);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><LoadingSpinner message="Loading announcement..." /></div>;

  const bowler = current?.bowler;
  const roleColors = {
    'Fast': 'text-red-400', 'Medium': 'text-orange-400',
    'Medium-Fast': 'text-amber-400', 'Spin': 'text-cricket-teal',
    'Leg-Spin': 'text-purple-400', 'Off-Spin': 'text-cricket-blue',
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 page-enter">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 glass border border-cricket-gold/20 px-4 py-2 rounded-full text-xs font-mono text-cricket-gold mb-4 tracking-widest">
            ⭐ WEEKLY ANNOUNCEMENT
          </div>
          <h1 className="font-display font-700 text-4xl sm:text-5xl mb-3">
            <span className="gradient-text-gold">Bowler</span>{' '}
            <span className="text-white">of the Week</span>
          </h1>
          <p className="text-slate-500 text-sm">Announced every Sunday evening by the club management</p>
        </div>

        {/* Sunday Evening Indicator */}
        {isSundayEvening() && (
          <div className="glass-card border border-cricket-green/30 rounded-2xl p-4 mb-6 text-center">
            <div className="flex items-center justify-center gap-2 text-cricket-green font-display font-600">
              <span className="w-2 h-2 rounded-full bg-cricket-green animate-pulse" />
              It&apos;s Sunday Evening — A new announcement may drop soon!
            </div>
          </div>
        )}

        {/* Current Bowler of Week */}
        {current && bowler ? (
          <div className="relative glass-card rounded-3xl overflow-hidden mb-8 border border-cricket-gold/20">
            {/* Gold glow top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cricket-gold to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-cricket-gold/10 blur-3xl pointer-events-none" />

            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-cricket-gold/30 to-orange-500/20 flex items-center justify-center border border-cricket-gold/30 animate-pulse-glow">
                    {bowler.avatar ? (
                      <img src={bowler.avatar} alt={bowler.name} className="w-full h-full rounded-2xl object-cover" />
                    ) : (
                      <span className="font-display font-700 text-3xl text-cricket-gold">
                        {bowler.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl glass border border-cricket-gold/40 flex items-center justify-center animate-bounce-slow">
                    <span className="text-base">⭐</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="text-xs font-mono text-slate-500 tracking-widest uppercase mb-2">
                    {formatDate(current.weekStartDate)} — {formatDate(current.weekEndDate)}
                  </div>
                  <h2 className="font-display font-700 text-2xl sm:text-3xl text-white mb-1">{bowler.name}</h2>
                  <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                    <span className={`text-sm font-display font-600 ${roleColors[bowler.role] || 'text-slate-400'}`}>{bowler.role}</span>
                    <span className="text-slate-700">·</span>
                    <span className="text-sm font-mono text-slate-500">#{bowler.jerseyNumber}</span>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-3 justify-center sm:justify-start mb-4">
                    {current.highlights?.wicketsTaken > 0 && (
                      <div className="flex items-center gap-1.5 glass border border-cricket-green/25 px-3 py-1.5 rounded-xl">
                        <span className="text-cricket-green font-mono font-700 text-sm">{current.highlights.wicketsTaken}</span>
                        <span className="text-xs text-slate-400 font-display">wickets this week</span>
                      </div>
                    )}
                    {current.highlights?.economy > 0 && (
                      <div className="flex items-center gap-1.5 glass border border-cricket-gold/25 px-3 py-1.5 rounded-xl">
                        <span className="text-cricket-gold font-mono font-700 text-sm">{current.highlights.economy}</span>
                        <span className="text-xs text-slate-400 font-display">economy</span>
                      </div>
                    )}
                    {current.highlights?.matchesPlayed > 0 && (
                      <div className="flex items-center gap-1.5 glass border border-cricket-blue/25 px-3 py-1.5 rounded-xl">
                        <span className="text-cricket-blue font-mono font-700 text-sm">{current.highlights.matchesPlayed}</span>
                        <span className="text-xs text-slate-400 font-display">matches</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="stats-divider my-5" />
              <blockquote className="glass rounded-xl p-4 border border-white/8">
                <p className="text-slate-300 font-body text-sm leading-relaxed italic">
                  &ldquo;{current.reason}&rdquo;
                </p>
                <p className="text-xs text-slate-600 mt-2 font-mono">— IGNOU Cricket Club Management</p>
              </blockquote>

              <p className="text-xs text-slate-600 mt-4 text-center font-mono">
                Announced on {formatDate(current.announcedAt)}
              </p>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-12 text-center mb-8 border border-white/8">
            <div className="text-5xl mb-4 animate-bounce-slow">🏏</div>
            <h2 className="font-display font-700 text-xl text-white mb-2">No Announcement Yet</h2>
            <p className="text-slate-500 text-sm">
              The Bowler of the Week will be announced every Sunday evening.
            </p>
          </div>
        )}

        {/* History */}
        {history.length > 1 && (
          <div>
            <h2 className="font-display font-700 text-lg text-white mb-4 flex items-center gap-2">
              <span>📜</span> Past Winners
            </h2>
            <div className="space-y-3">
              {history.slice(1).map((item) => {
                const b = item.bowler;
                if (!b) return null;
                return (
                  <div key={item._id} className="glass-card rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700/60 to-slate-600/40 flex items-center justify-center border border-white/10 flex-shrink-0">
                      <span className="font-display font-700 text-sm text-slate-300">
                        {b.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-700 text-sm text-white">{b.name}</div>
                      <div className="text-xs text-slate-500 font-mono truncate">{item.reason?.slice(0, 60)}...</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-slate-600 font-mono">{formatDate(item.weekStartDate)}</div>
                      {item.highlights?.wicketsTaken > 0 && (
                        <div className="text-xs text-cricket-green font-mono font-700">{item.highlights.wicketsTaken} wkts</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
