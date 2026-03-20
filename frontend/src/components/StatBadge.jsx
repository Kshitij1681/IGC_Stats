import React from 'react';

const colorMap = {
  green: 'text-cricket-green border-cricket-green/20 bg-cricket-green/5',
  teal: 'text-cricket-teal border-cricket-teal/20 bg-cricket-teal/5',
  blue: 'text-cricket-blue border-cricket-blue/20 bg-cricket-blue/5',
  gold: 'text-cricket-gold border-cricket-gold/20 bg-cricket-gold/5',
  red: 'text-cricket-red border-cricket-red/20 bg-cricket-red/5',
  purple: 'text-purple-400 border-purple-400/20 bg-purple-400/5',
};

export default function StatBadge({ label, value, color = 'green', size = 'md' }) {
  const colorClass = colorMap[color] || colorMap.green;
  const isLg = size === 'lg';

  return (
    <div className={`flex flex-col items-center justify-center border rounded-xl p-2 ${colorClass} ${isLg ? 'py-3 px-4' : 'py-2 px-3'}`}>
      <span className={`stat-value font-mono font-700 leading-tight ${isLg ? 'text-2xl' : 'text-lg'}`}>
        {value ?? '—'}
      </span>
      <span className={`text-slate-500 font-display font-500 uppercase tracking-wider leading-tight mt-0.5 ${isLg ? 'text-xs' : 'text-[10px]'}`}>
        {label}
      </span>
    </div>
  );
}
