import React from 'react';
import { Folder, Save, Terminal, Shield, Info, ToggleLeft, ToggleRight, FileCode } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useAppStore } from '../store';

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useAppStore();

  const handleToggle = (key: keyof typeof settings) => {
    if (typeof settings[key] === 'boolean') {
      updateSettings({ [key]: !settings[key] });
    }
  };

  const handleTextChange = (key: keyof typeof settings, value: string) => {
    updateSettings({ [key]: value });
  };

  return (
    <div className="h-full overflow-y-auto w-full custom-scrollbar p-2">
      <div className="max-w-4xl mx-auto pb-20">
        
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">
            SYSTEM <span className="text-neon-cyan text-glow">CONFIG</span>
          </h2>
          <div className="h-1 w-24 bg-neon-cyan mx-auto rounded-full shadow-[0_0_10px_#00FFFF]" />
        </div>

        <div className="space-y-8">
          
          <GlassCard title="ENVIRONMENT VARIABLES" icon={<Terminal size={24} />} glowColor="cyan">
            <div className="space-y-6">
              
              <div className="group">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-3 block group-hover:text-neon-cyan transition-colors">
                  ADB Binary Path
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Terminal size={18} className="absolute left-4 top-3.5 text-text-comment group-focus-within:text-neon-cyan transition-colors" />
                    <input 
                      type="text" 
                      value={settings.adbPath}
                      onChange={(e) => handleTextChange('adbPath', e.target.value)}
                      className="w-full bg-deep border border-white/10 rounded-xl px-4 py-3 pl-12 text-sm font-mono text-neon-cyan focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all placeholder-white/20"
                    />
                  </div>
                  <button className="px-5 py-3 bg-white/5 hover:bg-neon-cyan/20 border border-white/10 hover:border-neon-cyan/50 rounded-xl text-text-secondary hover:text-neon-cyan transition-all">
                    <Folder size={20} />
                  </button>
                </div>
              </div>

              <div className="group">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-3 block group-hover:text-neon-magenta transition-colors">
                  Fastboot Binary Path
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <FileCode size={18} className="absolute left-4 top-3.5 text-text-comment group-focus-within:text-neon-magenta transition-colors" />
                    <input 
                      type="text" 
                      value={settings.fastbootPath}
                      onChange={(e) => handleTextChange('fastbootPath', e.target.value)}
                      className="w-full bg-deep border border-white/10 rounded-xl px-4 py-3 pl-12 text-sm font-mono text-neon-magenta focus:outline-none focus:border-neon-magenta focus:shadow-[0_0_20px_rgba(255,0,255,0.2)] transition-all"
                    />
                  </div>
                  <button className="px-5 py-3 bg-white/5 hover:bg-neon-magenta/20 border border-white/10 hover:border-neon-magenta/50 rounded-xl text-text-secondary hover:text-neon-magenta transition-all">
                    <Folder size={20} />
                  </button>
                </div>
              </div>

              <div className="group">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-3 block group-hover:text-neon-lime transition-colors">
                  Asset Repository
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Folder size={18} className="absolute left-4 top-3.5 text-text-comment group-focus-within:text-neon-lime transition-colors" />
                    <input 
                      type="text" 
                      value={settings.downloadPath}
                      onChange={(e) => handleTextChange('downloadPath', e.target.value)}
                      className="w-full bg-deep border border-white/10 rounded-xl px-4 py-3 pl-12 text-sm font-mono text-neon-lime focus:outline-none focus:border-neon-lime focus:shadow-[0_0_20px_rgba(0,255,65,0.2)] transition-all"
                    />
                  </div>
                  <button className="px-5 py-3 bg-white/5 hover:bg-neon-lime/20 border border-white/10 hover:border-neon-lime/50 rounded-xl text-text-secondary hover:text-neon-lime transition-all">
                    <Folder size={20} />
                  </button>
                </div>
              </div>

            </div>
          </GlassCard>

          <GlassCard title="PROTOCOL BEHAVIOR" icon={<Shield size={24} />} glowColor="magenta">
            <div className="space-y-4">
              
              <div className="flex items-center justify-between p-4 rounded-xl bg-deep/30 border border-white/5 hover:border-neon-cyan/30 transition-all">
                <div>
                  <div className="text-sm font-bold text-white tracking-wide">Auto-Verify Checksums</div>
                  <div className="text-xs text-text-comment mt-1">Validate SHA256 hash immediately after download</div>
                </div>
                <button onClick={() => handleToggle('autoVerify')} className={`transition-all duration-300 transform hover:scale-110 ${settings.autoVerify ? 'text-neon-cyan drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]' : 'text-text-comment'}`}>
                  {settings.autoVerify ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-deep/30 border border-white/5 hover:border-neon-magenta/30 transition-all">
                <div>
                  <div className="text-sm font-bold text-white tracking-wide">Verbose Logging</div>
                  <div className="text-xs text-text-comment mt-1">Output detailed ADB debug information to terminal</div>
                </div>
                <button onClick={() => handleToggle('verboseLogging')} className={`transition-all duration-300 transform hover:scale-110 ${settings.verboseLogging ? 'text-neon-magenta drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]' : 'text-text-comment'}`}>
                  {settings.verboseLogging ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-deep/30 border border-white/5 opacity-50 cursor-not-allowed">
                <div>
                  <div className="text-sm font-bold text-white tracking-wide">Force Dark Mode</div>
                  <div className="text-xs text-text-comment mt-1">Cyberpunk theme requires dark mode (Locked)</div>
                </div>
                <button className="text-neon-cyan cursor-not-allowed opacity-50">
                  <ToggleRight size={40} />
                </button>
              </div>

            </div>
          </GlassCard>

          <GlassCard title="ABOUT MODULE" icon={<Info size={24} />} glowColor="violet">
            <div className="flex gap-8 items-start">
              <div className="w-24 h-24 bg-gradient-to-br from-neon-cyan to-neon-magenta rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,0,255,0.3)] shrink-0">
                <Terminal size={40} className="text-white drop-shadow-md" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-white tracking-wide mb-1">OnePlus 7 Pro // Flasher</h3>
                <p className="text-neon-cyan font-mono text-sm mb-4 font-bold tracking-widest">v2.0.0-cyberpunk-alpha</p>
                <p className="text-text-secondary text-sm leading-relaxed mb-6">
                  Specialized utility for guiding the transition from OxygenOS to crDroid Android 12+. 
                  Built with React, Electron, and Neon Dreams.
                </p>
                <div className="flex gap-6 border-t border-white/10 pt-4">
                   <a href="#" className="text-xs font-bold uppercase tracking-wider text-text-comment hover:text-neon-cyan transition-colors">Documentation</a>
                   <a href="#" className="text-xs font-bold uppercase tracking-wider text-text-comment hover:text-neon-magenta transition-colors">GitHub</a>
                   <a href="#" className="text-xs font-bold uppercase tracking-wider text-text-comment hover:text-neon-lime transition-colors">Donate</a>
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="flex justify-end pt-6">
             <button className="px-10 py-4 bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan hover:text-deep font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_30px_rgba(0,255,255,0.2)] hover:shadow-[0_0_50px_rgba(0,255,255,0.6)] flex items-center gap-3 hover:scale-105">
               <Save size={20} />
               Save Configuration
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};