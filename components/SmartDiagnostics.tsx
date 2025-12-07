
import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, AlertTriangle, Smartphone, Zap, RefreshCw, Cpu, HardDrive, Shield } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useAppStore } from '../store';

// --- SUB-COMPONENTS ---

const HealthGauge: React.FC<{ score: number; scanning: boolean }> = ({ score, scanning }) => {
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getColor = () => {
    if (scanning) return '#00FFFF';
    if (score > 80) return '#00FF41';
    if (score > 50) return '#FFD700';
    return '#FF0055';
  };

  return (
    <div className="relative flex items-center justify-center w-64 h-64 mx-auto my-8">
      {/* Scanning Effect Overlay */}
      {scanning && (
        <div className="absolute inset-0 rounded-full border-4 border-neon-cyan/30 animate-[spin_3s_linear_infinite]" />
      )}
      {scanning && (
        <div className="absolute inset-0 rounded-full border-4 border-t-neon-cyan border-r-transparent border-b-transparent border-l-transparent animate-[spin_1.5s_linear_infinite]" />
      )}

      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] relative z-10">
        <circle
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={getColor()}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ 
            strokeDashoffset: scanning ? circumference : strokeDashoffset, 
            transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.5s ease' 
          }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={`drop-shadow-[0_0_10px_currentColor]`}
        />
      </svg>
      
      <div className="absolute flex flex-col items-center z-20">
        <span className="text-[10px] uppercase tracking-widest text-text-comment font-bold mb-1">
          {scanning ? 'ANALYZING' : 'HEALTH SCORE'}
        </span>
        <span className={`text-5xl font-black tracking-tighter ${scanning ? 'text-neon-cyan animate-pulse' : 'text-white'} text-glow`}>
          {scanning ? '--' : score}
        </span>
      </div>
    </div>
  );
};

const IssueRow: React.FC<{ 
  title: string; 
  desc: string; 
  severity: 'low' | 'medium' | 'high'; 
  fixed: boolean;
  onFix: () => void;
}> = ({ title, desc, severity, fixed, onFix }) => {
  const [fixing, setFixing] = useState(false);

  const handleFix = () => {
    setFixing(true);
    setTimeout(() => {
      setFixing(false);
      onFix();
    }, 1500);
  };

  if (fixed) return null;

  const severityColor = {
    low: 'text-neon-cyan border-neon-cyan/30',
    medium: 'text-neon-gold border-neon-gold/30',
    high: 'text-neon-red border-neon-red/30',
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border bg-deep/40 mb-3 animate-[slideUpNeon_0.3s_ease-out] ${severityColor[severity]}`}>
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg border ${severity === 'high' ? 'bg-neon-red/10 border-neon-red' : 'bg-black/20 border-white/10'}`}>
          <AlertTriangle size={20} />
        </div>
        <div>
          <h4 className="font-bold text-sm tracking-wide text-white">{title}</h4>
          <p className="text-xs opacity-70 font-mono mt-0.5">{desc}</p>
        </div>
      </div>
      <button 
        onClick={handleFix}
        disabled={fixing}
        className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${fixing ? 'bg-white/10 text-white cursor-wait' : 'bg-white/5 hover:bg-neon-lime/20 text-neon-lime hover:shadow-[0_0_15px_rgba(0,255,65,0.3)]'}`}
      >
        {fixing ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
        {fixing ? 'PATCHING...' : 'AUTO-FIX'}
      </button>
    </div>
  );
};

// --- MAIN COMPONENT ---

export const SmartDiagnostics: React.FC = () => {
  const { device } = useAppStore();
  const [scanning, setScanning] = useState(true);
  const [score, setScore] = useState(0);
  const [issues, setIssues] = useState([
    { id: 1, title: 'Outdated USB Drivers', desc: 'OnePlus drivers version 1.0.0 detected. Recommended: 2.1+', severity: 'medium', fixed: false },
    { id: 2, title: 'ADB Daemon Conflict', desc: 'Multiple ADB instances running in background.', severity: 'low', fixed: false },
    { id: 3, title: 'Battery Optimization', desc: 'Background restrictions may kill flash process.', severity: 'high', fixed: false },
  ]);

  useEffect(() => {
    // Simulate scan
    setTimeout(() => {
      setScanning(false);
      calculateScore();
    }, 2500);
  }, []);

  const calculateScore = () => {
    const activeIssues = issues.filter(i => !i.fixed);
    let base = 100;
    activeIssues.forEach(i => {
      if (i.severity === 'high') base -= 25;
      if (i.severity === 'medium') base -= 15;
      if (i.severity === 'low') base -= 5;
    });
    setScore(Math.max(0, base));
  };

  const handleFix = (id: number) => {
    setIssues(prev => prev.map(i => i.id === id ? { ...i, fixed: true } : i));
    setTimeout(calculateScore, 100); // Recalculate after fix
  };

  const allFixed = issues.every(i => i.fixed);

  return (
    <div className="h-full w-full p-2 overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto pb-20 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter mb-2 flex items-center gap-3">
              SMART <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-lime text-glow">DIAGNOSTICS</span>
            </h2>
            <p className="text-text-comment font-mono text-xs uppercase tracking-widest flex items-center gap-2">
              <Activity size={12} className="text-neon-cyan" />
              Deep System Analysis // Hardware & Software
            </p>
          </div>
          {!scanning && (
            <button 
              onClick={() => { setScanning(true); setTimeout(() => setScanning(false), 2000); }}
              className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-text-secondary hover:text-neon-cyan hover:border-neon-cyan/50 transition-all font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]"
            >
              <RefreshCw size={16} /> Re-Scan System
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Score & Scan */}
          <div className="lg:col-span-4">
            <GlassCard glowColor={scanning ? 'cyan' : score > 80 ? 'lime' : 'red'} className="text-center h-full relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              <HealthGauge score={score} scanning={scanning} />

              <div className="mt-8 space-y-4">
                 <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                   <span className="text-xs font-bold text-text-secondary uppercase">Last Scan</span>
                   <span className="text-xs font-mono text-neon-cyan">Just now</span>
                 </div>
                 <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                   <span className="text-xs font-bold text-text-secondary uppercase">Device</span>
                   <span className="text-xs font-mono text-white">{device.model || 'Unknown'}</span>
                 </div>
              </div>
            </GlassCard>
          </div>

          {/* Right: Issues & Matrix */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Issue Tracker */}
            <GlassCard title="DETECTED ANOMALIES" icon={<AlertTriangle size={20} />} glowColor="gold" className="min-h-[300px]">
              {scanning ? (
                 <div className="h-48 flex flex-col items-center justify-center text-text-comment space-y-4">
                   <Activity size={48} className="animate-bounce opacity-50" />
                   <span className="text-xs font-mono tracking-widest animate-pulse">SCANNING KERNEL MODULES...</span>
                 </div>
              ) : allFixed ? (
                 <div className="h-48 flex flex-col items-center justify-center text-neon-lime space-y-4 animate-[fadeIn_0.5s_ease-out]">
                   <CheckCircle size={64} className="drop-shadow-[0_0_20px_rgba(0,255,65,0.5)]" />
                   <h3 className="text-xl font-black tracking-widest text-white">SYSTEM OPTIMAL</h3>
                   <p className="text-xs font-mono opacity-80">No active issues detected. Ready for flashing.</p>
                 </div>
              ) : (
                <div>
                   <div className="flex justify-between items-center mb-4 px-2">
                     <span className="text-[10px] uppercase font-bold text-text-comment tracking-widest">{issues.filter(i => !i.fixed).length} Issues Found</span>
                     <div className="h-px flex-1 bg-white/10 mx-4" />
                   </div>
                   {issues.map((issue) => (
                     <IssueRow 
                       key={issue.id} 
                       {...issue} 
                       severity={issue.severity as any} 
                       onFix={() => handleFix(issue.id)} 
                     />
                   ))}
                </div>
              )}
            </GlassCard>

            {/* Hardware Matrix */}
            <GlassCard title="HARDWARE COMPATIBILITY MATRIX" icon={<Cpu size={20} />} glowColor="violet">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="p-3 rounded-xl bg-deep/50 border border-white/5 text-center group hover:border-neon-cyan/30 transition-all">
                   <Smartphone className="mx-auto mb-2 text-text-secondary group-hover:text-neon-cyan transition-colors" size={20} />
                   <div className="text-[10px] font-bold text-text-comment uppercase">Model</div>
                   <div className="text-sm font-bold text-white">GM1917</div>
                   <div className="text-[10px] text-neon-lime mt-1">SUPPORTED</div>
                 </div>
                 <div className="p-3 rounded-xl bg-deep/50 border border-white/5 text-center group hover:border-neon-magenta/30 transition-all">
                   <HardDrive className="mx-auto mb-2 text-text-secondary group-hover:text-neon-magenta transition-colors" size={20} />
                   <div className="text-[10px] font-bold text-text-comment uppercase">Storage</div>
                   <div className="text-sm font-bold text-white">UFS 3.0</div>
                   <div className="text-[10px] text-neon-lime mt-1">HEALTHY</div>
                 </div>
                 <div className="p-3 rounded-xl bg-deep/50 border border-white/5 text-center group hover:border-neon-violet/30 transition-all">
                   <Shield className="mx-auto mb-2 text-text-secondary group-hover:text-neon-violet transition-colors" size={20} />
                   <div className="text-[10px] font-bold text-text-comment uppercase">Bootloader</div>
                   <div className="text-sm font-bold text-white">UNLOCKED</div>
                   <div className="text-[10px] text-neon-lime mt-1">READY</div>
                 </div>
                 <div className="p-3 rounded-xl bg-deep/50 border border-white/5 text-center group hover:border-neon-gold/30 transition-all">
                   <Zap className="mx-auto mb-2 text-text-secondary group-hover:text-neon-gold transition-colors" size={20} />
                   <div className="text-[10px] font-bold text-text-comment uppercase">Battery</div>
                   <div className="text-sm font-bold text-white">GOOD</div>
                   <div className="text-[10px] text-neon-lime mt-1">{'>'} 80%</div>
                 </div>
               </div>
            </GlassCard>

          </div>

        </div>
      </div>
    </div>
  );
};
