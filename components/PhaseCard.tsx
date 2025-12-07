import React, { useState } from 'react';
import { CheckCircle, Circle, Lock, ChevronDown, ChevronUp, Copy, Terminal } from 'lucide-react';
import { InstallationPhase, PhaseStatus } from '../types';
import { GlassCard } from './GlassCard';

interface PhaseCardProps {
  phase: InstallationPhase;
  status: PhaseStatus;
  onComplete: () => void;
  onReset: () => void;
}

export const PhaseCard: React.FC<PhaseCardProps> = ({ phase, status, onComplete, onReset }) => {
  const [expanded, setExpanded] = useState(status === 'active');
  
  React.useEffect(() => {
    if (status === 'active') setExpanded(true);
    if (status === 'locked') setExpanded(false);
  }, [status]);

  const toggleExpand = () => {
    if (status !== 'locked') setExpanded(!expanded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={`relative pl-10 group transition-all duration-500 ${status === 'locked' ? 'opacity-40 blur-[1px] hover:blur-0 hover:opacity-80' : 'opacity-100'}`}>
      
      {/* Timeline Node */}
      <div className={`
        absolute left-0 top-8 w-4 h-4 rounded-full border-2 z-20 transition-all duration-500
        ${status === 'completed' ? 'bg-neon-lime border-neon-lime shadow-[0_0_15px_#00FF41]' : 
          status === 'active' ? 'bg-deep border-neon-cyan shadow-[0_0_20px_#00FFFF] scale-125' : 
          'bg-deep border-text-comment'}
      `} />

      <GlassCard 
        glowColor={status === 'completed' ? 'lime' : status === 'active' ? 'cyan' : undefined}
        className={`
          transition-all duration-300
          ${status === 'active' ? 'border-neon-cyan/50 shadow-[0_0_40px_rgba(0,255,255,0.15)] ring-1 ring-neon-cyan/20' : ''}
          ${status === 'completed' ? 'border-neon-lime/30' : ''}
        `}
      >
        <div 
          className="flex items-center justify-between cursor-pointer" 
          onClick={toggleExpand}
        >
          <div className="flex items-center gap-6">
            <div className={`text-4xl font-black font-mono opacity-80 ${status === 'active' ? 'text-neon-cyan text-glow' : 'text-text-secondary'}`}>
              0{phase.id}
            </div>
            <div>
              <h3 className={`text-xl font-bold tracking-wide ${status === 'completed' ? 'text-neon-lime' : 'text-white'}`}>
                {phase.title}
              </h3>
              <p className="text-xs text-text-comment font-mono mt-1 flex items-center gap-2">
                <span className="text-neon-cyan">{phase.estimatedTime}</span> 
                <span className="opacity-50">|</span> 
                {phase.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {status === 'completed' && <CheckCircle className="text-neon-lime drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]" size={28} />}
            {status === 'active' && <Circle className="text-neon-cyan animate-pulse drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]" size={28} />}
            {status === 'locked' && <Lock className="text-text-comment" size={24} />}
            
            <button className="p-2 hover:bg-white/10 rounded-full text-text-secondary transition-colors">
              {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>

        <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${expanded ? 'grid-rows-[1fr] mt-8' : 'grid-rows-[0fr] mt-0'}`}>
          <div className="overflow-hidden">
            <div className="space-y-8">
              
              <div className="space-y-4">
                <div className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold border-b border-white/5 pb-2">Protocol Sequence</div>
                {phase.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 text-sm text-text-primary group/step">
                    <div className="min-w-[6px] h-[6px] mt-2 rounded-full bg-neon-magenta shadow-[0_0_5px_#FF00FF] group-hover/step:bg-neon-cyan group-hover/step:shadow-[0_0_5px_#00FFFF] transition-all" />
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>

              {phase.commands && (
                <div className="space-y-4">
                  <div className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold border-b border-white/5 pb-2">Terminal Injection</div>
                  {phase.commands.map((cmd, idx) => (
                    <div key={idx} className="group relative">
                      <div className="text-[10px] text-text-comment mb-1.5 ml-1 font-bold uppercase">{cmd.label}</div>
                      <div className="relative bg-deep border border-white/10 rounded-xl p-4 font-mono text-sm flex items-center justify-between group-hover:border-neon-cyan/50 group-hover:shadow-[0_0_20px_rgba(0,255,255,0.1)] transition-all duration-300">
                        <code className="text-neon-cyan flex-1 mr-4 drop-shadow-[0_0_5px_rgba(0,255,255,0.3)]">$ {cmd.cmd}</code>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(cmd.cmd); }}
                            className="p-2 hover:bg-white/10 rounded-lg text-text-secondary hover:text-white transition-colors" 
                            title="Copy Command"
                          >
                            <Copy size={16} />
                          </button>
                          <button 
                             onClick={(e) => { e.stopPropagation(); }}
                             className="p-2 hover:bg-neon-lime/10 rounded-lg text-text-secondary hover:text-neon-lime transition-colors" 
                             title="Execute"
                          >
                            <Terminal size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-6 flex justify-end gap-4 border-t border-white/5">
                {status === 'completed' ? (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onReset(); }}
                    className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-text-comment hover:text-white transition-colors"
                  >
                    Reset Phase
                  </button>
                ) : (
                  <button 
                    disabled={status === 'locked'}
                    onClick={(e) => { e.stopPropagation(); onComplete(); }}
                    className={`
                      px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all
                      ${status === 'locked' 
                        ? 'bg-white/5 text-text-comment cursor-not-allowed' 
                        : 'bg-gradient-to-r from-neon-cyan to-neon-blue text-deep hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:scale-105'}
                    `}
                  >
                    Mark Complete
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};