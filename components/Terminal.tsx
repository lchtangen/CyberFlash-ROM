import React, { useEffect, useRef } from 'react';
import { Trash2, Copy, Save, Terminal as TerminalIcon, Play } from 'lucide-react';
import { useTerminal } from '../hooks/useTerminal';
import { LogEntry } from '../types';

export const Terminal: React.FC = () => {
  const { logs, clearLogs, simulateBoot, addLog } = useTerminal();
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  useEffect(() => {
    if (logs.length === 0) {
      simulateBoot();
    }
  }, []); 

  const copyLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    addLog('success', 'Logs copied to clipboard');
  };

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'success': return 'text-neon-lime drop-shadow-[0_0_5px_rgba(0,255,65,0.8)]';
      case 'error': return 'text-neon-red drop-shadow-[0_0_5px_rgba(255,0,85,0.8)]';
      case 'warning': return 'text-neon-magenta drop-shadow-[0_0_5px_rgba(255,0,255,0.8)]';
      default: return 'text-neon-cyan';
    }
  };

  return (
    <div className="h-full flex flex-col p-2 w-full max-w-7xl mx-auto">
      
      <div className="glass-floating flex-1 flex flex-col overflow-hidden relative border-neon-cyan/20">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-deep/50 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-neon-cyan/10 rounded-lg border border-neon-cyan/30 text-neon-cyan shadow-[0_0_15px_rgba(0,255,255,0.2)]">
              <TerminalIcon size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-widest flex items-center gap-2">
                TERMINAL_OUTPUT
                <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
              </h2>
              <p className="text-[10px] text-text-comment font-mono uppercase tracking-wider">/var/log/flasher_daemon.log</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button onClick={simulateBoot} className="p-2.5 text-text-secondary hover:text-neon-lime hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10" title="Re-run Diagnostics">
              <Play size={20} />
            </button>
            <button onClick={copyLogs} className="p-2.5 text-text-secondary hover:text-neon-cyan hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10" title="Copy All">
              <Copy size={20} />
            </button>
            <button onClick={() => addLog('info', 'Logs saved to local storage.')} className="p-2.5 text-text-secondary hover:text-neon-magenta hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10" title="Save Log File">
              <Save size={20} />
            </button>
            <button onClick={clearLogs} className="p-2.5 text-text-secondary hover:text-neon-red hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10" title="Clear Terminal">
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Terminal Window */}
        <div className="flex-1 relative bg-deep/80 overflow-hidden flex flex-col">
          
          <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 z-10" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent h-2 animate-[pulse_4s_linear_infinite] opacity-10 z-10" />

          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-6 font-mono text-sm space-y-2 custom-scrollbar relative z-10"
          >
            {logs.length === 0 && (
              <div className="text-text-comment italic opacity-50 text-center mt-32 flex flex-col items-center gap-4">
                <TerminalIcon size={48} className="opacity-20" />
                <span className="tracking-widest uppercase text-xs">Awaiting Input Stream...</span>
              </div>
            )}
            
            {logs.map((log) => (
              <div key={log.id} className="flex gap-4 hover:bg-white/5 p-2 rounded-lg transition-colors group border-b border-transparent hover:border-white/5">
                <span className="text-text-comment shrink-0 opacity-50 text-xs mt-0.5">[{log.timestamp}]</span>
                <span className={`font-bold shrink-0 w-24 text-xs mt-0.5 tracking-wider ${getLevelColor(log.level)}`}>
                  {log.level.toUpperCase()}
                </span>
                <span className="text-text-primary break-all group-hover:text-white transition-colors leading-relaxed">
                  {log.level === 'info' && <span className="text-neon-cyan mr-2 font-bold">$</span>}
                  {log.message}
                </span>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input Simulation */}
          <div className="p-4 bg-black/40 border-t border-white/10 flex items-center gap-3 backdrop-blur-sm">
             <span className="text-neon-cyan font-bold animate-pulse text-lg">{'>'}</span>
             <div className="h-5 w-3 bg-neon-cyan shadow-[0_0_10px_#00FFFF] animate-pulse" />
          </div>
        </div>
      </div>
      
    </div>
  );
};