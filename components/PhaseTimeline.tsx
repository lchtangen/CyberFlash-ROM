import React from 'react';
import { useInstallation } from '../hooks/useInstallation';
import { PhaseCard } from './PhaseCard';

export const PhaseTimeline: React.FC = () => {
  const { 
    phases, 
    getPhaseStatus, 
    completePhase, 
    resetPhase, 
    totalProgress 
  } = useInstallation();

  return (
    <div className="h-full w-full overflow-y-auto px-4 lg:px-12 py-8 custom-scrollbar">
      
      {/* Header & Progress */}
      <div className="glass-floating mb-10 p-8 sticky top-0 z-30">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter">
              INSTALLATION <span className="text-neon-magenta text-glow">PROTOCOL</span>
            </h2>
            <div className="flex items-center gap-2 mt-2">
               <div className="w-2 h-2 rounded-full bg-neon-magenta animate-pulse" />
               <p className="text-text-comment text-xs font-mono uppercase">Sequence verification required</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black font-mono text-neon-cyan text-glow">{totalProgress}%</div>
            <div className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold">Completion</div>
          </div>
        </div>
        
        {/* Holographic Progress Bar */}
        <div className="h-2 w-full bg-deep rounded-full overflow-hidden border border-white/5 relative">
          <div 
            className="h-full holographic shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all duration-700 ease-out"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative pl-6 pb-20 max-w-4xl mx-auto">
        {/* Connecting Laser */}
        <div className="absolute left-[7px] top-8 bottom-0 w-[2px] bg-gradient-to-b from-neon-cyan via-neon-magenta to-transparent opacity-50 shadow-[0_0_10px_rgba(0,255,255,0.5)]" />

        {/* Phases */}
        <div className="space-y-6">
          {phases.map((phase) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              status={getPhaseStatus(phase.id)}
              onComplete={() => completePhase(phase.id)}
              onReset={() => resetPhase(phase.id)}
            />
          ))}
        </div>
      </div>
      
    </div>
  );
};