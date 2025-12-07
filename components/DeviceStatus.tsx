import React from 'react';
import { RefreshCw, Smartphone, Battery, Cpu, Hash, Layers } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useDevice } from '../hooks/useDevice';

export const DeviceStatus: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { device, isRefreshing, refreshDevice } = useDevice();
  
  const statusColor = device.connected ? 'lime' : 'red';
  const glowClass = device.connected ? 'neon-intense' : 'shadow-[0_0_30px_rgba(255,0,85,0.2)]';

  return (
    <GlassCard 
      glowColor={statusColor} 
      className={`relative overflow-hidden transition-all duration-500 ${className}`}
    >
      {/* Dynamic Background */}
      <div className={`absolute top-0 right-0 w-96 h-96 bg-neon-${statusColor} opacity-5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none transition-colors duration-500`} />

      {/* Header */}
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="flex items-center gap-5">
          <div className={`p-4 rounded-2xl bg-deep border border-white/10 ${device.connected ? 'shadow-[0_0_30px_rgba(0,255,65,0.3)]' : ''} transition-shadow duration-500`}>
            <Smartphone className={`text-neon-${statusColor} transition-colors duration-300 drop-shadow-[0_0_8px_currentColor]`} size={32} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-widest flex items-center gap-3">
              DEVICE LINK
              <span className={`inline-block w-3 h-3 rounded-full bg-neon-${statusColor} shadow-[0_0_15px_currentColor] ${device.connected ? 'animate-pulse' : ''}`} />
            </h3>
            <p className="text-sm text-text-comment font-mono mt-1">
              {device.connected ? 'Protocol: ADB_BRIDGE_ESTABLISHED' : 'Status: NO_DEVICE_DETECTED'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={refreshDevice}
          disabled={isRefreshing}
          className={`
            p-3 rounded-xl transition-all duration-300 group
            hover:bg-white/5 active:scale-95 border border-white/5 hover:border-neon-cyan/50
            ${isRefreshing ? 'text-neon-cyan shadow-[0_0_20px_rgba(0,255,255,0.2)]' : 'text-text-secondary'}
          `}
        >
          <RefreshCw size={24} className={`${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
        </button>
      </div>

      {/* Main Status Grid */}
      <div className="grid grid-cols-2 gap-5 relative z-10">
        
        <div className="p-4 bg-deep/50 rounded-xl border border-white/5 hover:border-neon-cyan/40 transition-colors group backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2 text-text-secondary group-hover:text-neon-cyan transition-colors">
            <Cpu size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Model</span>
          </div>
          <div className={`font-mono text-lg truncate font-bold ${device.connected ? 'text-neon-cyan text-glow' : 'text-text-comment'}`}>
            {device.model || '---'}
          </div>
        </div>

        <div className="p-4 bg-deep/50 rounded-xl border border-white/5 hover:border-neon-lime/40 transition-colors group backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2 text-text-secondary group-hover:text-neon-lime transition-colors">
            <Battery size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Power</span>
          </div>
          <div className={`font-mono text-lg font-bold ${device.connected ? 'text-neon-lime text-glow' : 'text-text-comment'}`}>
            {device.battery ? `${device.battery}%` : '---'}
          </div>
        </div>

        <div className="p-4 bg-deep/50 rounded-xl border border-white/5 hover:border-neon-magenta/40 transition-colors group backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2 text-text-secondary group-hover:text-neon-magenta transition-colors">
            <Layers size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Android Ver</span>
          </div>
          <div className={`font-mono text-lg font-bold ${device.connected ? 'text-neon-magenta text-glow' : 'text-text-comment'}`}>
            {device.androidVersion || '---'}
          </div>
        </div>

        <div className="p-4 bg-deep/50 rounded-xl border border-white/5 hover:border-neon-violet/40 transition-colors group backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2 text-text-secondary group-hover:text-neon-violet transition-colors">
            <Hash size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Serial</span>
          </div>
          <div className="font-mono text-sm text-text-comment truncate pt-1" title={device.serial || ''}>
            {device.serial || 'WAITING...'}
          </div>
        </div>

      </div>

      {/* Signal Visual */}
      <div className="mt-8">
         <div className="flex justify-between text-[10px] text-text-secondary uppercase tracking-widest mb-2 font-bold">
           <span>Signal Integrity</span>
           <span className={device.connected ? 'text-neon-lime' : 'text-text-comment'}>{device.connected ? '100%' : '0%'}</span>
         </div>
         <div className="h-1.5 w-full bg-deep rounded-full overflow-hidden border border-white/5">
           <div 
             className={`h-full transition-all duration-1000 ease-out relative ${device.connected ? 'w-full bg-gradient-to-r from-neon-lime to-neon-cyan shadow-[0_0_20px_#00FF41]' : 'w-[5%] bg-neon-red shadow-[0_0_10px_#FF0055]'}`} 
           >
             {device.connected && <div className="absolute inset-0 bg-white/50 animate-[pulse_1s_infinite]" />}
           </div>
         </div>
      </div>
    </GlassCard>
  );
};