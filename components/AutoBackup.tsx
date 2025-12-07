
import React, { useState, useEffect } from 'react';
import { Save, Cloud, Calendar, Clock, Database, CheckSquare, Square, Archive, RotateCcw, CheckCircle, HardDrive, RefreshCw } from 'lucide-react';
import { GlassCard } from './GlassCard';

// --- SUB-COMPONENTS ---

const BackupGauge: React.FC<{ progress: number; status: string }> = ({ progress, status }) => {
  const radius = 90;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-64 h-64 mx-auto my-6 group">
      {/* Outer Glow Ring */}
      <div className={`absolute inset-0 rounded-full border-2 border-neon-cyan/20 ${status === 'running' ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
      <div className={`absolute inset-4 rounded-full border border-neon-magenta/20 ${status === 'running' ? 'animate-[spin_3s_linear_infinite_reverse]' : ''}`} />

      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90 drop-shadow-[0_0_20px_rgba(0,255,255,0.3)] relative z-10">
        <circle
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={progress === 100 ? '#00FF41' : '#00FFFF'}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-out' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="drop-shadow-[0_0_10px_currentColor]"
        />
      </svg>
      
      <div className="absolute flex flex-col items-center z-20">
        <span className="text-[10px] uppercase tracking-widest text-text-comment font-bold mb-1">
          {status === 'idle' ? 'READY' : status === 'completed' ? 'SAVED' : 'BACKING UP'}
        </span>
        <span className={`text-4xl font-black tracking-tighter ${status === 'completed' ? 'text-neon-lime' : 'text-white'} text-glow`}>
          {Math.round(progress)}%
        </span>
        {status === 'running' && (
             <div className="text-[10px] text-neon-cyan animate-pulse mt-2 font-mono">
               Encrypting chunks...
             </div>
        )}
      </div>
    </div>
  );
};

interface RestorePoint {
  id: string;
  date: string;
  size: string;
  partitions: string[];
  type: 'manual' | 'auto';
}

const TimelineItem: React.FC<{ point: RestorePoint; onRestore: () => void }> = ({ point, onRestore }) => (
  <div className="relative pl-6 pb-6 border-l border-white/10 last:border-0 last:pb-0 group">
    <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-deep border border-neon-cyan group-hover:bg-neon-cyan group-hover:shadow-[0_0_10px_#00FFFF] transition-all" />
    
    <div className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 hover:border-neon-cyan/30 transition-all group-hover:translate-x-1">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-sm font-bold text-white tracking-wide">{point.date}</div>
          <div className="flex gap-2 mt-1">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 uppercase font-bold">
              {point.size}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-text-secondary border border-white/10 uppercase font-bold">
              {point.type}
            </span>
          </div>
        </div>
        <button 
          onClick={onRestore}
          className="p-2 rounded-lg bg-white/5 hover:bg-neon-magenta/20 text-text-secondary hover:text-neon-magenta transition-colors border border-transparent hover:border-neon-magenta/50"
          title="Restore this backup"
        >
          <RotateCcw size={16} />
        </button>
      </div>
      <div className="text-[10px] text-text-comment font-mono truncate">
        Included: {point.partitions.join(', ')}
      </div>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export const AutoBackup: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [partitions, setPartitions] = useState([
    { id: 'data', label: 'User Data (/data)', size: '12.4 GB', checked: true },
    { id: 'system', label: 'System Image', size: '4.2 GB', checked: true },
    { id: 'boot', label: 'Boot / Kernel', size: '64 MB', checked: true },
    { id: 'efs', label: 'EFS (IMEI/Modem)', size: '12 MB', checked: true, required: true },
    { id: 'recovery', label: 'Recovery Partition', size: '96 MB', checked: false },
  ]);

  const [restorePoints, setRestorePoints] = useState<RestorePoint[]>([
    { id: '1', date: 'Dec 05, 2025 - 14:30', size: '16.8 GB', partitions: ['Data', 'System', 'Boot'], type: 'manual' },
    { id: '2', date: 'Dec 01, 2025 - 03:00', size: '4.2 GB', partitions: ['System', 'Boot'], type: 'auto' },
  ]);

  const togglePartition = (id: string) => {
    setPartitions(prev => prev.map(p => 
      p.id === id && !p.required ? { ...p, checked: !p.checked } : p
    ));
  };

  const startBackup = () => {
    setStatus('running');
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('completed');
          // Add new restore point
          const newPoint: RestorePoint = {
            id: Math.random().toString(),
            date: 'Just now',
            size: '16.7 GB', // Simulated
            partitions: partitions.filter(p => p.checked).map(p => p.label.split(' ')[0]),
            type: 'manual'
          };
          setRestorePoints(prevRP => [newPoint, ...prevRP]);
          setTimeout(() => setStatus('idle'), 3000);
          return 100;
        }
        return prev + (Math.random() * 5);
      });
    }, 200);
  };

  return (
    <div className="h-full w-full p-2 overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto pb-20 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter mb-2 flex items-center gap-3">
              AUTO <span className="text-neon-cyan text-glow">BACKUP</span>
            </h2>
            <p className="text-text-comment font-mono text-xs uppercase tracking-widest flex items-center gap-2">
              <Database size={12} className="text-neon-magenta" />
              Partition Backup & Disaster Recovery
            </p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-deep/50 border border-white/5">
                <Cloud size={16} className="text-neon-lime" />
                <div className="text-left">
                  <div className="text-[10px] text-text-comment uppercase font-bold">Cloud Sync</div>
                  <div className="text-xs font-bold text-white">Active (120GB Free)</div>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Backup Controls */}
          <div className="lg:col-span-7 space-y-6">
            <GlassCard glowColor={status === 'running' ? 'magenta' : 'cyan'} className="relative overflow-hidden">
               <div className="flex flex-col md:flex-row gap-8 items-center">
                 
                 {/* Gauge Area */}
                 <div className="shrink-0">
                    <BackupGauge progress={progress} status={status} />
                 </div>

                 {/* Partition Tree */}
                 <div className="flex-1 w-full space-y-3">
                    <div className="text-xs font-bold text-white tracking-widest uppercase mb-4 pb-2 border-b border-white/10">
                      Partition Selection
                    </div>
                    {partitions.map(part => (
                      <div 
                        key={part.id} 
                        onClick={() => togglePartition(part.id)}
                        className={`
                          flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer group
                          ${part.checked ? 'bg-neon-cyan/10 border-neon-cyan/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          {part.checked ? <CheckSquare size={18} className="text-neon-cyan" /> : <Square size={18} className="text-text-comment" />}
                          <div>
                            <div className={`text-sm font-bold ${part.checked ? 'text-white' : 'text-text-secondary'}`}>{part.label}</div>
                            {part.required && <span className="text-[9px] text-neon-red uppercase font-bold">Required</span>}
                          </div>
                        </div>
                        <div className="font-mono text-xs text-text-comment">{part.size}</div>
                      </div>
                    ))}
                 </div>

               </div>

               <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                  <button 
                    onClick={startBackup}
                    disabled={status === 'running'}
                    className={`
                      w-full md:w-auto px-8 py-4 rounded-xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all
                      ${status === 'running' 
                        ? 'bg-deep border border-white/10 text-text-comment cursor-not-allowed' 
                        : 'bg-gradient-to-r from-neon-cyan to-neon-blue text-deep hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:scale-[1.02]'}
                    `}
                  >
                    {status === 'running' ? (
                      <>Processing <RefreshCw className="animate-spin" /></>
                    ) : status === 'completed' ? (
                      <>Backup Complete <CheckCircle /></>
                    ) : (
                      <>Initiate Backup <Archive /></>
                    )}
                  </button>
               </div>
            </GlassCard>

            {/* Schedule Settings */}
            <GlassCard title="AUTOMATION SCHEDULE" icon={<Calendar size={20} />} glowColor="violet">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-4 rounded-xl bg-deep/40 border border-white/5 hover:border-neon-violet/30 transition-all group cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-xs font-bold text-text-secondary uppercase">Frequency</span>
                       <Clock size={16} className="text-neon-violet group-hover:animate-pulse" />
                    </div>
                    <div className="text-lg font-bold text-white">Every Sunday</div>
                    <div className="text-[10px] text-text-comment mt-1">Next: Dec 08, 03:00 AM</div>
                 </div>

                 <div className="p-4 rounded-xl bg-deep/40 border border-white/5 hover:border-neon-violet/30 transition-all group cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-xs font-bold text-text-secondary uppercase">Retention</span>
                       <HardDrive size={16} className="text-neon-violet group-hover:animate-pulse" />
                    </div>
                    <div className="text-lg font-bold text-white">Keep Last 3</div>
                    <div className="text-[10px] text-text-comment mt-1">Auto-delete older archives</div>
                 </div>
               </div>
            </GlassCard>
          </div>

          {/* Right Column: Restore Timeline */}
          <div className="lg:col-span-5">
            <GlassCard title="RESTORE POINTS" icon={<RotateCcw size={20} />} glowColor="lime" className="h-full">
               <div className="space-y-2 mt-4">
                 {restorePoints.map(point => (
                   <TimelineItem key={point.id} point={point} onRestore={() => {}} />
                 ))}
                 
                 <div className="pt-8 text-center">
                   <p className="text-[10px] text-text-comment uppercase font-bold tracking-widest">End of History</p>
                 </div>
               </div>
            </GlassCard>
          </div>

        </div>
      </div>
    </div>
  );
};
