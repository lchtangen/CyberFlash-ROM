
import React from 'react';
import { LayoutDashboard, Download, Zap, Terminal, Settings, Smartphone, AlertTriangle, Activity, Cpu, Save, Box } from 'lucide-react';
import { useAppStore } from '../store';
import { View } from '../types';

interface NavItemProps {
  view: View;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-4 px-5 py-4 mb-3 rounded-2xl transition-all duration-300 group relative overflow-hidden
      ${active 
        ? 'text-white shadow-[0_0_20px_rgba(0,255,255,0.3)] bg-white/5 border border-neon-cyan/30' 
        : 'text-text-secondary hover:text-text-primary hover:bg-white/5 border border-transparent'}
    `}
  >
    {active && (
      <div className="absolute inset-0 holographic opacity-20 pointer-events-none" />
    )}
    
    <div className={`relative z-10 transition-transform duration-300 ${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] text-neon-cyan' : 'group-hover:scale-110'}`}>
      {icon}
    </div>
    <span className={`relative z-10 font-bold tracking-wide text-sm ${active ? 'text-glow' : ''}`}>
      {label}
    </span>
    
    {active && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_10px_#00FFFF]" />}
  </button>
);

export const Sidebar: React.FC = () => {
  const { currentView, setView, device } = useAppStore();

  return (
    <div className="h-full w-72 glass-floating flex flex-col p-6 relative overflow-hidden shrink-0">
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-neon-cyan/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neon-magenta/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="mb-10 mt-2 relative z-10 text-center">
        <h1 className="text-3xl font-black text-white tracking-tighter text-glow flex items-center justify-center gap-2">
          <Zap size={28} className="text-neon-cyan drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-magenta">CYBER</span>
        </h1>
        <div className="text-lg font-bold tracking-[0.2em] text-neon-magenta text-opacity-80 -mt-1 text-shadow-sm">FLASH</div>
        <p className="text-[10px] text-text-comment font-mono mt-3 px-3 py-1 rounded-full bg-white/5 inline-block border border-white/5">
          v2.0.0 // PROTOCOL_READY
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 z-10 space-y-1 overflow-y-auto custom-scrollbar pr-2">
        <NavItem 
          view="dashboard" 
          label="DASHBOARD" 
          icon={<LayoutDashboard size={22} />} 
          active={currentView === 'dashboard'} 
          onClick={() => setView('dashboard')} 
        />
        <NavItem 
          view="visualizer" 
          label="DEVICE 3D" 
          icon={<Box size={22} />} 
          active={currentView === 'visualizer'} 
          onClick={() => setView('visualizer')} 
        />
        <NavItem 
          view="downloads" 
          label="RESOURCES" 
          icon={<Download size={22} />} 
          active={currentView === 'downloads'} 
          onClick={() => setView('downloads')} 
        />
        <NavItem 
          view="phases" 
          label="INSTALLER" 
          icon={<Zap size={22} />} 
          active={currentView === 'phases'} 
          onClick={() => setView('phases')} 
        />
        <NavItem 
          view="diagnostics" 
          label="DIAGNOSTICS" 
          icon={<Activity size={22} />} 
          active={currentView === 'diagnostics'} 
          onClick={() => setView('diagnostics')} 
        />
        <NavItem 
          view="monitor" 
          label="MONITOR" 
          icon={<Cpu size={22} />} 
          active={currentView === 'monitor'} 
          onClick={() => setView('monitor')} 
        />
        <NavItem 
          view="backup" 
          label="BACKUP" 
          icon={<Save size={22} />} 
          active={currentView === 'backup'} 
          onClick={() => setView('backup')} 
        />
        <NavItem 
          view="terminal" 
          label="TERMINAL" 
          icon={<Terminal size={22} />} 
          active={currentView === 'terminal'} 
          onClick={() => setView('terminal')} 
        />
        <NavItem 
          view="recovery" 
          label="RECOVERY" 
          icon={<AlertTriangle size={22} />} 
          active={currentView === 'recovery'} 
          onClick={() => setView('recovery')} 
        />
        <NavItem 
          view="settings" 
          label="SYSTEM" 
          icon={<Settings size={22} />} 
          active={currentView === 'settings'} 
          onClick={() => setView('settings')} 
        />
      </nav>

      {/* Device Status Pill */}
      <div className={`
        mt-auto p-4 rounded-2xl border transition-all duration-500 z-10 backdrop-blur-md relative overflow-hidden group
        ${device.connected 
          ? 'bg-neon-cyan/10 border-neon-cyan/40 shadow-[0_0_30px_rgba(0,255,255,0.15)]' 
          : 'bg-neon-red/5 border-neon-red/30 grayscale'}
      `}>
        {device.connected && <div className="absolute inset-0 bg-neon-cyan/5 animate-pulse-slow" />}
        
        <div className="flex items-center gap-3 relative z-10">
          <div className={`p-2.5 rounded-xl shadow-lg ${device.connected ? 'bg-gradient-to-br from-neon-cyan to-neon-blue text-deep' : 'bg-neon-red/20 text-neon-red'}`}>
            <Smartphone size={20} />
          </div>
          <div>
            <div className="text-[10px] text-text-comment uppercase tracking-wider font-bold">Uplink Status</div>
            <div className={`text-sm font-black tracking-wide ${device.connected ? 'text-neon-cyan text-glow' : 'text-neon-red'}`}>
              {device.connected ? 'CONNECTED' : 'OFFLINE'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};