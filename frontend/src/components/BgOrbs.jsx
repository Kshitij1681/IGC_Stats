import React from 'react';

export default function BgOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div
        className="bg-orb w-96 h-96 bg-cricket-green"
        style={{ top: '-10%', left: '-5%', opacity: 0.07 }}
      />
      <div
        className="bg-orb w-80 h-80 bg-cricket-blue"
        style={{ top: '40%', right: '-8%', opacity: 0.06 }}
      />
      <div
        className="bg-orb w-64 h-64 bg-cricket-purple"
        style={{ bottom: '10%', left: '30%', opacity: 0.05 }}
      />
      <div
        className="bg-orb w-48 h-48 bg-cricket-teal"
        style={{ top: '60%', left: '10%', opacity: 0.06 }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,135,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,135,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}
