
import React from 'react';
import { Download, Pause, Play, Server, Wifi, ShieldCheck, FileArchive, CheckCircle, RefreshCw } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useDownloads, AVAILABLE_MIRRORS, DownloadFile } from '../hooks/useDownloads';

// --- SUB-COMPONENTS ---

const SpeedGraph: React.FC<{ data: number[] }> = ({ data }) => {
  const max = Math.max(...data, 20); // Scale based on max value or min 20
  const height = 80;
  const width = 100;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (d / max) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative h-24 w-full overflow-hidden rounded-xl bg-deep/50 border border-white/5">
      {/* Grid Lines */}
      <div className="absolute inset-0 grid grid-cols-6 gap-0 opacity-10 pointer-events-none">
        {[...Array(6)].map((_, i) => <div key={i} className="border-r border-neon-cyan/30 h-full" />)}
      </div>

      <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="speedGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00FFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M0,${height} ${points} L${width},${height} Z`} fill="url(#speedGradient)" />
        <polyline points={points} fill="none" stroke="#00FFFF" strokeWidth="2" vectorEffect="non-scaling-stroke" className="drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]" />
      </svg>
      
      {/* Current Speed Overlay */}
      <div className="absolute top-2 right-4 text-right">
        <div className="text-[10px] uppercase tracking-widest text-text-comment font-bold">Total Bandwidth</div>
        <div className="text-2xl font-black font-mono text-neon-cyan text-glow">
          {data[data.length - 1].toFixed(1)} <span className="text-sm">MB/s</span>
        </div>
      </div>
    </div>
  );
};

const ChunkVisualizer: React.FC<{ chunks: boolean[]; color: string }> = ({ chunks, color }) => {
  const colorMap: Record<string, string> = {
    cyan: 'bg-neon-cyan shadow-[0_0_8px_#00FFFF]',
    magenta: 'bg-neon-magenta shadow-[0_0_8px_#FF00FF]',
    lime: 'bg-neon-lime shadow-[0_0_8px_#00FF41]',
    violet: 'bg-neon-violet shadow-[0_0_8px_#B026FF]',
  };
  
  return (
    <div className="flex gap-0.5 h-1.5 w-full mt-3 opacity-80">
      {chunks.map((active, i) => (
        <div 
          key={i} 
          className={`flex-1 rounded-sm transition-all duration-300 ${active ? colorMap[color] : 'bg-white/10'}`} 
        />
      ))}
    </div>
  );
};

const MirrorSelector: React.FC<{ 
  current: string; 
  onSelect: (id: string) => void;
  disabled: boolean 
}> = ({ current, onSelect, disabled }) => {
  return (
    <div className="relative group">
      <select 
        value={current}
        onChange={(e) => onSelect(e.target.value)}
        disabled={disabled}
        className="appearance-none bg-deep/50 border border-white/10 text-xs text-text-secondary pl-8 pr-8 py-1.5 rounded-lg focus:outline-none focus:border-neon-cyan/50 transition-colors disabled:opacity-50 cursor-pointer hover:bg-white/5"
      >
        {AVAILABLE_MIRRORS.map(m => (
          <option key={m.id} value={m.id}>{m.id} ({m.ping}ms)</option>
        ))}
      </select>
      <Server size={12} className="absolute left-2.5 top-2 text-text-comment pointer-events-none" />
      
      {/* Ping Indicator */}
      <div className="absolute right-2 top-2 flex gap-0.5 items-end h-3 pointer-events-none">
        {[1, 2, 3].map(i => (
          <div key={i} className={`w-0.5 rounded-full ${i === 3 ? 'h-3 bg-neon-lime' : i === 2 ? 'h-2 bg-neon-lime' : 'h-1 bg-neon-lime'}`} />
        ))}
      </div>
    </div>
  );
};

const DownloadCard: React.FC<{ 
  file: DownloadFile; 
  onToggle: (id: string) => void; 
  onMirrorSelect: (id: string, mirror: string) => void;
}> = ({ file, onToggle, onMirrorSelect }) => {
  
  const statusColors: Record<string, string> = {
    idle: 'text-text-secondary',
    downloading: 'text-neon-cyan',
    paused: 'text-neon-gold',
    verifying: 'text-neon-violet',
    completed: 'text-neon-lime',
    error: 'text-neon-red'
  };

  const glowMap: Record<string, any> = {
    cyan: 'cyan',
    magenta: 'magenta',
    lime: 'lime',
    violet: 'violet'
  };

  return (
    <GlassCard glowColor={file.status === 'completed' ? 'lime' : glowMap[file.color]} className="relative overflow-hidden p-6">
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className={`
            p-3 rounded-xl border transition-all duration-300
            ${file.status === 'downloading' ? `bg-neon-${file.color}/10 border-neon-${file.color} shadow-[0_0_20px_currentColor]` : 'bg-white/5 border-white/10'}
          `}>
            {file.status === 'completed' ? (
              <CheckCircle className="text-neon-lime" size={24} />
            ) : file.status === 'verifying' ? (
              <ShieldCheck className="text-neon-violet animate-pulse" size={24} />
            ) : (
              <FileArchive className={`text-neon-${file.color}`} size={24} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h4 className="text-white font-bold tracking-wide text-sm">{file.name}</h4>
              <span className="text-[10px] font-mono text-text-comment bg-white/5 px-2 py-0.5 rounded border border-white/5">{file.size}</span>
            </div>
            <div className="flex items-center gap-4 mt-1">
              <div className={`text-xs font-bold uppercase tracking-wider ${statusColors[file.status]} flex items-center gap-2`}>
                {file.status}
                {file.status === 'downloading' && <span className="text-white/50 text-[10px] font-mono">running process...</span>}
              </div>
              
              {file.status !== 'completed' && (
                <MirrorSelector 
                  current={file.mirror} 
                  onSelect={(m) => onMirrorSelect(file.id, m)} 
                  disabled={file.status === 'downloading'}
                />
              )}
            </div>
          </div>
        </div>

        <button 
          onClick={() => onToggle(file.id)}
          disabled={file.status === 'verifying' || file.status === 'completed'}
          className={`
            p-3 rounded-xl transition-all duration-300 border
            ${file.status === 'downloading' 
              ? 'bg-neon-gold/10 border-neon-gold/50 text-neon-gold hover:bg-neon-gold/20' 
              : file.status === 'completed'
                ? 'opacity-0 cursor-default'
                : 'bg-neon-cyan/10 border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/20 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]'}
          `}
        >
          {file.status === 'downloading' ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
        </button>
      </div>

      {/* Progress Section */}
      <div className="relative z-10">
        <div className="flex justify-between text-xs font-mono text-text-secondary mb-1">
          <span>{ (file.downloadedBytes / 1024 / 1024).toFixed(1) } MB</span>
          <span className={file.status === 'downloading' ? 'text-neon-cyan font-bold' : ''}>
            {file.speed > 0 ? `${file.speed.toFixed(1)} MB/s` : '--'}
          </span>
          <span>{Math.round(file.progress)}%</span>
        </div>

        <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
          <div 
            className={`h-full transition-all duration-300 ease-out relative overflow-hidden`}
            style={{ 
              width: `${file.progress}%`,
              background: file.status === 'completed' ? '#00FF41' : file.status === 'verifying' ? '#B026FF' : 'linear-gradient(90deg, #00FFFF, #FF00FF)'
            }}
          >
            {/* Striped Animation */}
            {file.status === 'downloading' && (
               <div className="absolute inset-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9InN0cmlwZXMiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMODAgMEgwTDQwIDQwVjB6IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9"100%" fill="url(#stripes)" />')] animate-[shimmer_1s_linear_infinite]" />
            )}
          </div>
        </div>

        <ChunkVisualizer chunks={file.chunks} color={file.color} />
      </div>

    </GlassCard>
  );
};

// --- MAIN COMPONENT ---

export const SmartDownloader: React.FC = () => {
  const { files, totalSpeed, speedHistory, toggleDownload, setMirror, startAll, pauseAll } = useDownloads();

  const activeDownloads = files.filter(f => f.status === 'downloading').length;
  const completedDownloads = files.filter(f => f.status === 'completed').length;
  const totalFiles = files.length;

  return (
    <div className="h-full w-full p-2 overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto pb-20 space-y-6">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-4">
          <div>
             <h2 className="text-3xl font-black text-white tracking-tighter mb-2 flex items-center gap-3">
               SMART <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-magenta text-glow">DOWNLOADER</span>
             </h2>
             <p className="text-text-comment font-mono text-xs uppercase tracking-widest flex items-center gap-2">
               <Wifi size={12} className="text-neon-lime" />
               Network Optimization Active
             </p>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={pauseAll}
              disabled={activeDownloads === 0}
              className="px-6 py-3 rounded-xl border border-neon-gold/30 bg-neon-gold/5 text-neon-gold font-bold uppercase tracking-widest text-xs hover:bg-neon-gold/20 hover:shadow-[0_0_20px_rgba(255,215,0,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Pause size={16} /> Pause All
            </button>
            <button 
              onClick={startAll}
              disabled={completedDownloads === totalFiles}
              className="px-6 py-3 rounded-xl border border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan font-bold uppercase tracking-widest text-xs hover:bg-neon-cyan hover:text-deep hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Download size={16} /> {activeDownloads > 0 ? 'Resume All' : 'Start All'}
            </button>
          </div>
        </div>

        {/* Global Stats */}
        <GlassCard glowColor="cyan" className="p-0 overflow-hidden bg-deep/30">
           <div className="p-6 pb-2">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-white font-bold tracking-wide">NETWORK THROUGHPUT</h3>
               <div className="flex gap-2">
                 <div className="px-3 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-text-secondary">
                   Active: <span className="text-white font-bold">{activeDownloads}</span>
                 </div>
                 <div className="px-3 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-text-secondary">
                   Done: <span className="text-neon-lime font-bold">{completedDownloads}/{totalFiles}</span>
                 </div>
               </div>
             </div>
             <SpeedGraph data={speedHistory} />
           </div>
        </GlassCard>

        {/* File Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {files.map(file => (
            <DownloadCard 
              key={file.id} 
              file={file} 
              onToggle={toggleDownload} 
              onMirrorSelect={setMirror}
            />
          ))}
        </div>

        {/* Global Footer Progress */}
        <div className="fixed bottom-0 left-72 right-0 p-1 pointer-events-none">
           <div className="h-0.5 w-full bg-deep">
             <div 
               className="h-full bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-lime transition-all duration-500"
               style={{ width: `${(files.reduce((acc, f) => acc + f.progress, 0) / (files.length * 100)) * 100}%` }}
             />
           </div>
        </div>

      </div>
    </div>
  );
};
