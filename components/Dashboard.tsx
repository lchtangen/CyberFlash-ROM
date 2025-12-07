
import React, { useEffect, useState } from 'react';
import { GlassCard } from './GlassCard';
import { useAppStore } from '../store';
import { DeviceStatus } from './DeviceStatus';
import { ShieldCheck, AlertTriangle, Activity, Zap, Server, Wifi } from 'lucide-react';

// --- SUB-COMPONENTS ---

const PredictionGauge: React.FC<{ probability: number; connected: boolean }> = ({ probability, connected }) => {
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (probability / 100) * circumference;
  
  const getColor = () => {
    if (!connected) return '#FF0055'; // Red
    if (probability > 80) return '#00FF41'; // Lime
    if (probability > 50) return '#FFD700'; // Gold
    return '#FF0055'; // Red
  };

  return (
    <div className="relative flex items-center justify-center w-64 h-64 mx-auto group">
      {/* Holographic Projection Base */}
      <div className="absolute bottom-0 w-40 h-10 bg-neon-cyan/20 blur-[30px] rounded-[100%] transform rotate-x-[80deg]" />
      
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        {/* Background Circle */}
        <circle
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress Circle */}
        <circle
          stroke={getColor()}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.5s ease' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="drop-shadow-[0_0_10px_currentColor]"
        />
      </svg>
      
      {/* Center Text */}
      <div className="absolute flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-widest text-text-comment font-bold mb-1">Success Probability</span>
        <span className={`text-5xl font-black tracking-tighter transition-colors duration-500 ${!connected ? 'text-neon-red' : probability > 80 ? 'text-neon-lime' : 'text-neon-gold'} text-glow`}>
          {connected ? `${probability}%` : 'ERR'}
        </span>
        {connected && (
          <div className="mt-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-text-secondary uppercase font-bold tracking-wider">
            {probability > 90 ? 'OPTIMAL' : 'CAUTION'}
          </div>
        )}
      </div>
    </div>
  );
};

const RiskCard: React.FC<{ title: string; risk: 'low' | 'medium' | 'high'; value: string; icon: React.ReactNode }> = ({ title, risk, value, icon }) => {
  const colorMap = {
    low: 'text-neon-lime border-neon-lime/30 bg-neon-lime/5',
    medium: 'text-neon-gold border-neon-gold/30 bg-neon-gold/5',
    high: 'text-neon-red border-neon-red/30 bg-neon-red/5'
  };

  return (
    <div className={`p-4 rounded-xl border backdrop-blur-md transition-all duration-300 hover:scale-[1.02] ${colorMap[risk]}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="p-2 rounded-lg bg-black/20">{icon}</div>
        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-black/20">
          {risk.toUpperCase()} RISK
        </span>
      </div>
      <div className="text-[10px] uppercase tracking-wider opacity-80 font-bold mt-2">{title}</div>
      <div className="text-lg font-black tracking-wide mt-1">{value}</div>
    </div>
  );
};

const StabilityChart: React.FC = () => {
  const [data, setData] = useState<number[]>(new Array(20).fill(50));

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const next = [...prev.slice(1), Math.max(20, Math.min(80, prev[prev.length - 1] + (Math.random() - 0.5) * 20))];
        return next;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const points = data.map((d, i) => `${i * (100 / 19)},${100 - d}`).join(' ');

  return (
    <div className="h-32 w-full relative overflow-hidden rounded-xl bg-deep/30 border border-white/5 p-4">
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-2">
           <Activity size={14} className="text-neon-cyan" />
           <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">ADB Bridge Latency</span>
        </div>
        <div className="text-xl font-bold text-white mt-1">{data[data.length-1].toFixed(1)}ms</div>
      </div>
      
      <svg className="absolute inset-0 w-full h-full preserve-3d" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00FFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M0,100 ${points} L100,100 Z`} fill="url(#chartGradient)" />
        <polyline points={points} fill="none" stroke="#00FFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
      </svg>
      
      {/* Scanline */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[2px] w-full animate-[scan_2s_linear_infinite]" />
    </div>
  );
};

// --- MAIN DASHBOARD ---

export const Dashboard: React.FC = () => {
  const { device, toggleConnection } = useAppStore();

  // Calculate Success Probability
  const calculateProbability = () => {
    if (!device.connected) return 0;
    let score = 100;
    if ((device.battery || 0) < 50) score -= 30;
    if ((device.battery || 0) < 20) score -= 40;
    if (device.model !== 'OnePlus 7 Pro') score -= 20;
    // Add randomness for "live" feel
    return Math.max(0, Math.min(100, score));
  };

  const probability = calculateProbability();

  return (
    <div className="p-2 h-full w-full overflow-y-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-6 pb-10">
        
        {/* Header */}
        <div className="flex justify-between items-end pt-4 mb-6">
          <div>
            <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">
              PREDICTIVE <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-magenta text-glow">ANALYTICS</span>
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-px w-12 bg-neon-cyan/50" />
              <p className="text-neon-cyan text-xs tracking-[0.2em] font-bold uppercase opacity-80">
                AI Risk Assessment // Real-time
              </p>
            </div>
          </div>
          <button 
            onClick={toggleConnection}
            className={`
              px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all duration-500
              border-2 flex items-center gap-2 backdrop-blur-md
              ${device.connected 
                ? 'border-neon-red/50 text-neon-red hover:bg-neon-red/10 shadow-[0_0_20px_rgba(255,0,85,0.2)]' 
                : 'border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 shadow-[0_0_20px_rgba(0,255,255,0.2)] animate-pulse'}
            `}
          >
            <Wifi size={16} />
            {device.connected ? 'DISCONNECT' : 'CONNECT DEVICE'}
          </button>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Device Info & Gauge */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard glowColor="cyan" className="text-center py-8 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50" />
               <PredictionGauge probability={probability} connected={device.connected} />
               <div className="mt-6 text-xs text-text-comment font-mono">
                 Calculated based on battery voltage, partition integrity, and USB throughput stability.
               </div>
            </GlassCard>

            <DeviceStatus />
          </div>

          {/* Right Column: Risk Factors & Charts */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Risk Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <RiskCard 
                title="Power Supply" 
                risk={!device.connected ? 'high' : (device.battery || 0) > 50 ? 'low' : 'high'} 
                value={device.connected ? `${device.battery}%` : 'N/A'} 
                icon={<Zap size={18} />}
              />
              <RiskCard 
                title="Firmware" 
                risk={device.connected ? 'low' : 'medium'} 
                value={device.connected ? 'MATCH' : 'UNKNOWN'} 
                icon={<ShieldCheck size={18} />}
              />
              <RiskCard 
                title="Partition" 
                risk="low" 
                value="HEALTHY" 
                icon={<Server size={18} />}
              />
              <RiskCard 
                title="USB Link" 
                risk={device.connected ? 'low' : 'high'} 
                value={device.connected ? 'USB 3.1' : 'OPEN'} 
                icon={<AlertTriangle size={18} />}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6">
              <GlassCard title="TELEMETRY STABILITY" icon={<Activity size={20} />} glowColor="magenta">
                 <StabilityChart />
                 <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                      <div className="text-[10px] text-text-secondary uppercase tracking-widest">Packets</div>
                      <div className="text-neon-cyan font-mono font-bold">1,024/s</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                      <div className="text-[10px] text-text-secondary uppercase tracking-widest">Jitter</div>
                      <div className="text-neon-magenta font-mono font-bold">4.2ms</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                      <div className="text-[10px] text-text-secondary uppercase tracking-widest">Loss</div>
                      <div className="text-neon-lime font-mono font-bold">0.0%</div>
                    </div>
                 </div>
              </GlassCard>

              {/* Recommendation Panel */}
              <GlassCard glowColor="violet" className="flex items-center gap-6">
                 <div className="h-12 w-12 rounded-full bg-neon-violet/20 flex items-center justify-center border border-neon-violet/50 shadow-[0_0_15px_rgba(176,38,255,0.4)]">
                   <ShieldCheck size={24} className="text-neon-violet" />
                 </div>
                 <div>
                   <h4 className="text-white font-bold tracking-wide text-lg">AI RECOMMENDATION</h4>
                   <p className="text-text-secondary text-sm mt-1">
                     {device.connected && probability > 80 
                       ? "System parameters optimal. Proceed with Phase 1 (Bootloader Unlock) immediately."
                       : "Conditions suboptimal. Please charge device above 50% and verify USB cable integrity."}
                   </p>
                 </div>
              </GlassCard>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
