import React from 'react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-cricket-green/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cricket-green animate-spin" />
        <div className="absolute inset-3 rounded-full border-2 border-transparent border-t-cricket-teal animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
        <div className="absolute inset-0 flex items-center justify-center text-xl">🏏</div>
      </div>
      <p className="text-slate-500 font-display text-sm tracking-wider">{message}</p>
    </div>
  );
}
