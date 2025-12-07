
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bot, RefreshCw, CheckCircle, XCircle, ArrowRight, Activity, ToggleLeft, ToggleRight, ShieldAlert } from 'lucide-react';
import { GlassCard } from './GlassCard';

export const ErrorRecovery: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(true);
  const [selectedSolution, setSelectedSolution] = useState<number | null>(null);
  const [recovering, setRecovering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [recoveryStatus, setRecoveryStatus] = useState<'idle' | 'success' | 'failure'>('idle');
  const [autoRecovery, setAutoRecovery] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Simulation: Initial AI Analysis
  useEffect(() => {
    const timer = setTimeout(() => setAnalyzing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Simulation: Recovery Process
  const startRecovery = () => {
    setRecovering(true);
    setProgress(0);
    setRecoveryStatus('idle');
    setCurrentStep(0);

    const steps = [20, 45, 70, 100];
    let stepIndex = 0;

    const interval = setInterval(() => {
      stepIndex++;
      setCurrentStep(stepIndex);
      setProgress(steps[stepIndex - 1] || 0);

      if (stepIndex >= 4) {
        clearInterval(interval);
        setTimeout(() => {
            setRecovering(false);
            setRecoveryStatus('success');
        }, 800);
      }
    }, 1200);
  };

  const solutions = [
    {
      id: 1,
      title: 'Restart ADB Server',
      description: 'Kill the current server instance and restart with elevated privileges.',
      confidence: 98,
      risk: 'low'
    },
    {
      id: 2,
      title: 'Reinstall Drivers',
      description: 'Force reinstall of OnePlus USB drivers via Windows Device Manager API.',
      confidence: 65,
      risk: 'medium'
    },
    {
      id: 3,
      title: 'Factory Reset',
      description: 'Wipe all user data to restore partition table integrity.',
      confidence: 40,
      risk: 'high'
    }
  ];

  const recoverySteps = [
    'Terminating stale threads...',
    'Flushing TCP/IP bridge...',
    'Re-initializing daemon...',
    'Verifying handshake...'
  ];

  return (
    <div className="h-full w-full flex items-center justify-center p-6 relative overflow-hidden">
        
      {/* Background Warning Ambience */}
      <div className="absolute inset-0 bg-neon-red/5 animate-pulse-slow pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-red to-transparent opacity-50" />

      {/* Main Glass Modal */}
      <div className="w-full max-w-2xl glass-floating relative z-10 border-neon-red/30 shadow-[0_0_100px_rgba(255,0,85,0.15)] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-start gap-6 bg-neon-red/5">
          <div className="p-4 bg-neon-red/10 rounded-2xl border border-neon-red/30 shadow-[0_0_30px_rgba(255,0,85,0.2)] animate-pulse">
            <ShieldAlert size={40} className="text-neon-red drop-shadow-[0_0_10px_currentColor]" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
              CRITICAL ERROR
              <span className="text-xs px-2 py-1 bg-neon-red/20 border border-neon-red/50 rounded text-neon-red font-mono tracking-widest">
                ERR_0x24_TIMEOUT
              </span>
            </h2>
            <p className="text-text-secondary text-lg">
              The communication bridge with the device has collapsed due to a protocol timeout.
            </p>
          </div>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
            
            {/* AI Analysis Section */}
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-neon-cyan mb-2">
                 <Bot size={20} className={analyzing ? 'animate-bounce' : ''} />
                 <span className="text-xs font-bold uppercase tracking-[0.2em]">Neural Engine Analysis</span>
               </div>

               {analyzing ? (
                 <div className="h-32 flex items-center justify-center border border-white/10 rounded-2xl bg-deep/50">
                    <div className="flex flex-col items-center gap-3">
                        <RefreshCw size={32} className="text-neon-cyan animate-spin" />
                        <span className="text-sm font-mono text-neon-cyan animate-pulse">Scanning error patterns...</span>
                    </div>
                 </div>
               ) : (
                 <div className="grid gap-4">
                    {solutions.map((sol) => (
                        <button
                          key={sol.id}
                          onClick={() => setSelectedSolution(sol.id)}
                          className={`
                            text-left p-5 rounded-xl border transition-all duration-300 relative group overflow-hidden
                            ${selectedSolution === sol.id 
                                ? 'bg-neon-cyan/10 border-neon-cyan shadow-[0_0_30px_rgba(0,255,255,0.1)]' 
                                : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'}
                          `}
                        >
                          <div className="flex justify-between items-start mb-2 relative z-10">
                             <h4 className={`font-bold text-lg ${selectedSolution === sol.id ? 'text-white' : 'text-text-primary'}`}>
                               {sol.title}
                             </h4>
                             <div className={`
                                px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border
                                ${sol.risk === 'low' ? 'border-neon-lime/50 text-neon-lime bg-neon-lime/10' : 
                                  sol.risk === 'medium' ? 'border-neon-gold/50 text-neon-gold bg-neon-gold/10' : 
                                  'border-neon-red/50 text-neon-red bg-neon-red/10'}
                             `}>
                               {sol.risk} risk
                             </div>
                          </div>
                          <p className="text-sm text-text-secondary relative z-10 pr-12">{sol.description}</p>
                          
                          {/* Confidence Meter */}
                          <div className="absolute bottom-4 right-4 flex flex-col items-end z-10">
                            <span className={`text-2xl font-black ${selectedSolution === sol.id ? 'text-neon-cyan text-glow' : 'text-white/20'}`}>
                                {sol.confidence}%
                            </span>
                            <span className="text-[8px] uppercase tracking-widest text-text-comment">Match</span>
                          </div>

                          {/* Selection Indicator */}
                          {selectedSolution === sol.id && (
                              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 to-transparent pointer-events-none" />
                          )}
                        </button>
                    ))}
                 </div>
               )}
            </div>

            {/* Recovery Wizard Area */}
            {selectedSolution && (
                <div className={`transition-all duration-500 ${recovering || recoveryStatus !== 'idle' ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}`}>
                    <div className="border-t border-white/10 pt-8">
                        
                        {/* Auto-Recovery Toggle */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <Activity size={20} className={autoRecovery ? 'text-neon-cyan' : 'text-text-comment'} />
                                <div>
                                    <div className="text-sm font-bold text-white">Automated Recovery Sequence</div>
                                    <div className="text-xs text-text-comment">Allow AI to execute corrective scripts automatically</div>
                                </div>
                            </div>
                            <button onClick={() => setAutoRecovery(!autoRecovery)} className="text-neon-cyan transition-transform hover:scale-110">
                                {autoRecovery ? <ToggleRight size={40} className="drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]" /> : <ToggleLeft size={40} className="text-text-comment" />}
                            </button>
                        </div>

                        {/* Action Area */}
                        {!recovering && recoveryStatus === 'idle' && (
                            <button 
                                onClick={startRecovery}
                                className="w-full py-4 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-xl font-black text-deep uppercase tracking-[0.2em] hover:shadow-[0_0_40px_rgba(0,255,255,0.4)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 group"
                            >
                                <RefreshCw className="group-hover:rotate-180 transition-transform duration-700" />
                                Initiate Fix
                            </button>
                        )}

                        {/* Progress UI */}
                        {(recovering || recoveryStatus !== 'idle') && (
                            <div className="bg-deep/50 rounded-xl p-6 border border-white/10 relative overflow-hidden">
                                
                                {recoveryStatus === 'success' ? (
                                    <div className="flex flex-col items-center justify-center py-4 animate-[scaleNeon_0.4s_ease-out]">
                                        <CheckCircle size={64} className="text-neon-lime drop-shadow-[0_0_20px_rgba(0,255,65,0.6)] mb-4" />
                                        <h3 className="text-2xl font-black text-white tracking-widest">RECOVERY COMPLETE</h3>
                                        <p className="text-neon-lime font-mono mt-2">System integrity restored.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">
                                            <span>{recoverySteps[currentStep] || 'Finalizing...'}</span>
                                            <span className="text-neon-cyan">{progress}%</span>
                                        </div>
                                        
                                        <div className="h-3 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                                            <div 
                                                className="h-full bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-cyan bg-[length:200%_100%] animate-[holographicShift_2s_linear_infinite] shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all duration-300"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>

                                        <div className="mt-6 space-y-2">
                                            {recoverySteps.map((step, idx) => (
                                                <div key={idx} className={`flex items-center gap-3 text-sm transition-all duration-300 ${idx < currentStep ? 'text-neon-lime opacity-100' : idx === currentStep ? 'text-neon-cyan opacity-100' : 'text-text-comment opacity-30'}`}>
                                                    {idx < currentStep ? <CheckCircle size={14} /> : idx === currentStep ? <RefreshCw size={14} className="animate-spin" /> : <div className="w-3.5 h-3.5 rounded-full border border-current" />}
                                                    <span className="font-mono">{step}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};
