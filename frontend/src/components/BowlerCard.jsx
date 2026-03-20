import React, { useState } from 'react';
import StatBadge from './StatBadge';

const roleColors = {
  'Fast': 'text-red-400 border-red-400/30 bg-red-400/5',
  'Medium': 'text-orange-400 border-orange-400/30 bg-orange-400/5',
  'Medium-Fast': 'text-amber-400 border-amber-400/30 bg-amber-400/5',
  'Spin': 'text-cricket-teal border-cricket-teal/30 bg-cricket-teal/5',
  'Leg-Spin': 'text-purple-400 border-purple-400/30 bg-purple-400/5',
  'Off-Spin': 'text-cricket-blue border-cricket-blue/30 bg-cricket-blue/5',
};

const avatarColors = [
  'from-cricket-green/30 to-cricket-teal/30',
  'from-cricket-blue/30 to-purple-500/30',
  'from-cricket-gold/30 to-orange-500/30',
  'from-red-500/30 to-pink-500/30',
  'from-teal-400/30 to-cyan-500/30',
];

function computeStats(stats) {
  if (!stats) return { matches: 0, overs: 0, wickets: 0, runsConceded: 0, wicketHauls: 0, economy: 0, strikeRate: 0 };
  const economy = stats.overs > 0 ? (stats.runsConceded / stats.overs).toFixed(2) : '0.00';
  const strikeRate = stats.wickets > 0 ? ((stats.overs * 6) / stats.wickets).toFixed(2) : '0.00';
  return { ...stats, economy, strikeRate };
}

export default function BowlerCard({ bowler, index = 0 }) {
  const [activeTab, setActiveTab] = useState('overall');

  const home = computeStats(bowler.homeStats);
  const away = computeStats(bowler.awayStats);
  const overall = bowler.overallStats || computeStats({
    matches: (bowler.homeStats?.matches || 0) + (bowler.awayStats?.matches || 0),
    overs: (bowler.homeStats?.overs || 0) + (bowler.awayStats?.overs || 0),
    wickets: (bowler.homeStats?.wickets || 0) + (bowler.awayStats?.wickets || 0),
    runsConceded: (bowler.homeStats?.runsConceded || 0) + (bowler.awayStats?.runsConceded || 0),
    wicketHauls: (bowler.homeStats?.wicketHauls || 0) + (bowler.awayStats?.wicketHauls || 0),
  });

  const activeStats = activeTab === 'home' ? home : activeTab === 'away' ? away : overall;
  const roleColor = roleColors[bowler.role] || roleColors['Fast'];
  const avatarGrad = avatarColors[index % avatarColors.length];
  const initials = bowler.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-fade-in">
      {/* Card Header */}
      <div className="relative p-5 pb-4">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cricket-green/40 to-transparent" />

        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${avatarGrad} flex items-center justify-center border border-white/10 flex-shrink-0`}>
            {bowler.avatar ? (
              <img src={bowler.avatar} alt={bowler.name} className="w-full h-full rounded-xl object-cover" />
            ) : (
              <span className="font-display font-700 text-lg text-white">{initials}</span>
            )}
            {/* Jersey number badge */}
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-lg glass border border-white/20 flex items-center justify-center">
              <span className="text-[9px] font-mono font-700 text-cricket-green">#{bowler.jerseyNumber}</span>
            </div>
          </div>

          {/* Name & Role */}
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-700 text-white text-base leading-tight truncate">{bowler.name}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`role-badge px-2 py-0.5 rounded-lg border ${roleColor}`}>{bowler.role}</span>
            </div>
          </div>

          {/* Wickets highlight */}
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-mono font-700 neon-green leading-tight">{overall.wickets}</div>
            <div className="text-[9px] text-slate-500 font-display uppercase tracking-wider">wickets</div>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="px-5 pb-3">
        <div className="flex bg-black/20 rounded-xl p-1 gap-1">
          {['overall', 'home', 'away'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-display font-600 uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-cricket-green/15 text-cricket-green border border-cricket-green/25'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab === 'overall' ? '📊' : tab === 'home' ? '🏠' : '✈️'} {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-5 pb-5">
        <div className="grid grid-cols-3 gap-2 mb-2">
          <StatBadge label="Matches" value={activeStats.matches} color="teal" />
          <StatBadge label="Overs" value={activeStats.overs} color="blue" />
          <StatBadge label="Wickets" value={activeStats.wickets} color="green" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <StatBadge label="Economy" value={activeStats.economy} color="gold" />
          <StatBadge label="SR" value={activeStats.strikeRate} color="purple" />
          <StatBadge label="3W+" value={activeStats.wicketHauls} color="red" />
        </div>
      </div>
    </div>
  );
}
