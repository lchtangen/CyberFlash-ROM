
import React, { useState, useEffect } from 'react';
import { Cpu, CircuitBoard, Thermometer, ArrowUp, ArrowDown, Activity, Server, Zap } from 'lucide-react';
import { GlassCard } from './GlassCard';

// --- SUB-COMPONENTS ---

const CircularGauge: React.FC<{ 
  value: number; 
  label: string; 
  color: string; 
  icon: React.ReactNode 
}> = ({ value, label, color, icon }) => {
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  // Map color name to hex/classes
  const colorHexMap: Record<string, string> = {
    cyan: '#00FFFF',
    magenta: '#FF00FF',
    lime: '#00FF41',
    gold: '#FFD700',
    red: '#FF0055',
  };
  const hex = colorHexMap[color] || '#00FFFF';
  const shadowClass = `shadow-[0_0_20px_${hex}40]`;

  return (
    <div className="flex flex-col items-center justify-center relative group">
      <div className="relative">
        {/* Holographic BG */}
        <div className={`absolute inset-0 rounded-full blur-xl opacity-20 bg-${color === 'cyan' ? 'neon-cyan' : 'neon-magenta'}`} />
        
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={hex}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className={`drop-shadow-[0_0_8px_${hex}]`}
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <div className={`text-white/80 mb-1 transition-transform group-hover:scale-110 duration-300`}>
             {icon}
          </div>
          <span className="text-2xl font-black font-mono text-white text-glow">{Math.round(value)}%</span>
        </div>
      </div>
      <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">{label}</div>
    </div>
  );
};

const LineGraph: React.FC<{ data: number[]; color: string; label: string }> = ({ data, color, label }) => {
  const height = 60;
  const width = 100;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (d / 100) * height;
    return `${x},${y}`;
  }).join(' ');

  const colorHexMap: Record<string, string> = {
    cyan: '#00FFFF',
    magenta: '#FF00FF',
    lime: '#00FF41',
  };
  const hex = colorHexMap[color] || '#00FFFF';

  return (
    <div className="w-full relative group">
      <div className="flex justify-between items-end mb-2 px-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-comment">{label}</span>
        <span className="font-mono text-xs font-bold" style={{ color: hex }}>{Math.round(data[data.length - 1])}%</span>
      </div>
      <div className="h-16 w-full bg-deep/30 rounded-lg border border-white/5 overflow-hidden relative">
        <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
           <defs>
            <linearGradient id={`grad-${color}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={hex} stopOpacity="0.4" />
              <stop offset="100%" stopColor={hex} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`M0,${height} ${points} L${width},${height} Z`} fill={`url(#grad-${color})`} />
          <polyline points={points} fill="none" stroke={hex} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        {/* Scanline */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full h-full animate-[shimmer_2s_infinite] pointer-events-none" />
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export const SystemMonitor: React.FC = () => {
  // Real-time metrics simulation
  const [metrics, setMetrics] = useState({
    cpu: 0,
    ram: 0,
    temp: 35,
    netUp: 0,
    netDown: 0
  });

  const [history, setHistory] = useState({
    cpu: new Array(20).fill(0),
    ram: new Array(20).fill(0)
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        const newCpu = Math.min(100, Math.max(0, prev.cpu + (Math.random() - 0.5) * 20));
        const newRam = Math.min(100, Math.max(20, prev.ram + (Math.random() - 0.5) * 5));
        const newTemp = Math.min(90, Math.max(30, prev.temp + (Math.random() - 0.5) * 2));
        const newUp = Math.max(0, prev.netUp + (Math.random() - 0.5) * 50);
        const newDown = Math.max(0, prev.netDown + (Math.random() - 0.5) * 100);

        return {
          cpu: newCpu,
          ram: newRam,
          temp: newTemp,
          netUp: newUp,
          netDown: newDown
        };
      });

      setHistory(prev => ({
        cpu: [...prev.cpu.slice(1), metrics.cpu],
        ram: [...prev.ram.slice(1), metrics.ram]
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [metrics.cpu, metrics.ram]); // Depend on previous frame for smoothness

  const tempColor = metrics.temp < 45 ? 'bg-neon-lime' : metrics.temp < 70 ? 'bg-neon-gold' : 'bg-neon-red';

  return (
    <div className="h-full w-full p-2 overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto pb-20 space-y-6">
        
        <div className="mb-8">
          <h2 className="text-3xl font-black text-white tracking-tighter mb-2 flex items-center gap-3">
             <Activity className="text-neon-cyan" />
             SYSTEM <span className="text-neon-lime text-glow">TELEMETRY</span>
          </h2>
          <p className="text-text-comment font-mono text-xs uppercase tracking-widest">Real-time resource monitoring daemon</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Main Gauges */}
          <GlassCard glowColor="cyan" className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                <Cpu size={18} className="text-neon-cyan" />
                CORE RESOURCES
              </h3>
              <div className="flex gap-2">
                 <div className="h-2 w-2 rounded-full bg-neon-cyan animate-pulse" />
                 <div className="h-2 w-2 rounded-full bg-neon-magenta animate-pulse delay-75" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 justify-items-center">
              <CircularGauge value={metrics.cpu} label="CPU Load" color="cyan" icon={<Cpu size={20} />} />
              <CircularGauge value={metrics.ram} label="RAM Usage" color="magenta" icon={<CircuitBoard size={20} />} />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-8">
               <LineGraph data={history.cpu} color="cyan" label="CPU History" />
               <LineGraph data={history.ram} color="magenta" label="RAM History" />
            </div>
          </GlassCard>

          {/* Side Metrics */}
          <div className="space-y-6">
            
            {/* Thermal Status */}
            <GlassCard glowColor="red" className="relative overflow-hidden">
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2 text-white font-bold tracking-wide">
                   <Thermometer size={18} className="text-neon-red" />
                   THERMAL
                 </div>
                 <span className="font-mono text-neon-red font-bold text-xl">{Math.round(metrics.temp)}°C</span>
               </div>
               
               <div className="h-4 w-full bg-black/40 rounded-full p-1 border border-white/10 relative">
                 <div 
                   className={`h-full rounded-full transition-all duration-500 ${tempColor} shadow-[0_0_15px_currentColor]`} 
                   style={{ width: `${(metrics.temp / 100) * 100}%` }}
                 />
               </div>
               
               <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] text-text-comment font-mono uppercase">
                 <div className="p-2 rounded bg-white/5 border border-white/5">
                   <div className="mb-1">Zone 1</div>
                   <div className="text-white font-bold">{Math.round(metrics.temp - 2)}°</div>
                 </div>
                 <div className="p-2 rounded bg-white/5 border border-white/5">
                   <div className="mb-1">Zone 2</div>
                   <div className="text-white font-bold">{Math.round(metrics.temp)}°</div>
                 </div>
                 <div className="p-2 rounded bg-white/5 border border-white/5">
                   <div className="mb-1">Batt</div>
                   <div className="text-white font-bold">{Math.round(metrics.temp - 5)}°</div>
                 </div>
               </div>
            </GlassCard>

            {/* Network IO */}
            <GlassCard glowColor="lime">
              <div className="flex items-center gap-2 text-white font-bold tracking-wide mb-6">
                 <Server size={18} className="text-neon-lime" />
                 NETWORK I/O
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-deep/40 border border-white/5 group hover:border-neon-lime/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-neon-lime/10 text-neon-lime">
                      <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform" />
                    </div>
                    <div className="text-xs text-text-secondary font-bold uppercase tracking-wider">Download</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-lg font-bold text-white">{Math.round(metrics.netDown)} <span className="text-xs text-text-comment">KB/s</span></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-deep/40 border border-white/5 group hover:border-neon-blue/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-neon-blue/10 text-neon-blue">
                      <ArrowUp size={18} className="group-hover:-translate-y-1 transition-transform" />
                    </div>
                    <div className="text-xs text-text-secondary font-bold uppercase tracking-wider">Upload</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-lg font-bold text-white">{Math.round(metrics.netUp)} <span className="text-xs text-text-comment">KB/s</span></div>
                  </div>
                </div>
              </div>

              {/* Activity Sparkline */}
              <div className="mt-4 pt-4 border-t border-white/5">
                 <div className="flex justify-between items-center text-[10px] text-text-comment uppercase tracking-widest mb-2">
                    <span>Active Threads</span>
                    <span className="text-neon-lime animate-pulse">Running</span>
                 </div>
                 <div className="flex gap-0.5 items-end h-8">
                    {new Array(20).fill(0).map((_, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-neon-lime/20 rounded-t-sm transition-all duration-300 hover:bg-neon-lime"
                        style={{ height: `${Math.random() * 100}%` }}
                      />
                    ))}
                 </div>
              </div>
            </GlassCard>

          </div>
        </div>

        {/* Process List */}
        <GlassCard glowColor="violet" title="ACTIVE PROCESSES" icon={<Zap size={20} />}>
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm font-mono">
               <thead>
                 <tr className="text-[10px] text-text-comment uppercase tracking-widest border-b border-white/10">
                   <th className="pb-3 pl-2">PID</th>
                   <th className="pb-3">Name</th>
                   <th className="pb-3">User</th>
                   <th className="pb-3 text-right">CPU%</th>
                   <th className="pb-3 text-right pr-2">Mem</th>
                 </tr>
               </thead>
               <tbody className="text-text-secondary">
                 {[
                   { pid: 1024, name: 'adb_server', user: 'root', cpu: 12.5, mem: '45MB' },
                   { pid: 2048, name: 'electron_renderer', user: 'user', cpu: 8.2, mem: '128MB' },
                   { pid: 4096, name: 'node_process', user: 'user', cpu: 4.1, mem: '64MB' },
                   { pid: 8192, name: 'system_monitor', user: 'root', cpu: 1.2, mem: '24MB' },
                 ].map((proc, i) => (
                   <tr key={proc.pid} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                     <td className="py-3 pl-2 text-neon-violet group-hover:text-white transition-colors">{proc.pid}</td>
                     <td className="py-3 font-bold text-white">{proc.name}</td>
                     <td className="py-3">{proc.user}</td>
                     <td className="py-3 text-right text-neon-cyan">{proc.cpu}%</td>
                     <td className="py-3 text-right pr-2 text-neon-magenta">{proc.mem}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </GlassCard>

      </div>
    </div>
  );
};
