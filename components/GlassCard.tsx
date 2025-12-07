import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'magenta' | 'red' | 'lime' | 'violet' | 'gold' | 'blue';
  title?: string;
  icon?: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  glowColor = 'cyan',
  title,
  icon
}) => {
  const glowMap = {
    cyan: 'hover:shadow-[0_0_50px_rgba(0,255,255,0.25)] hover:border-neon-cyan/80',
    magenta: 'hover:shadow-[0_0_50px_rgba(255,0,255,0.25)] hover:border-neon-magenta/80',
    red: 'hover:shadow-[0_0_50px_rgba(255,0,85,0.25)] hover:border-neon-red/80',
    lime: 'hover:shadow-[0_0_50px_rgba(0,255,65,0.25)] hover:border-neon-lime/80',
    violet: 'hover:shadow-[0_0_50px_rgba(176,38,255,0.25)] hover:border-neon-violet/80',
    gold: 'hover:shadow-[0_0_50px_rgba(255,215,0,0.25)] hover:border-neon-gold/80',
    blue: 'hover:shadow-[0_0_50px_rgba(0,191,255,0.25)] hover:border-neon-blue/80',
  };

  const titleColorMap = {
    cyan: 'group-hover:text-neon-cyan',
    magenta: 'group-hover:text-neon-magenta',
    red: 'group-hover:text-neon-red',
    lime: 'group-hover:text-neon-lime',
    violet: 'group-hover:text-neon-violet',
    gold: 'group-hover:text-neon-gold',
    blue: 'group-hover:text-neon-blue',
  };

  const accentColorMap = {
    cyan: 'bg-neon-cyan shadow-[0_0_15px_#00FFFF]',
    magenta: 'bg-neon-magenta shadow-[0_0_15px_#FF00FF]',
    red: 'bg-neon-red shadow-[0_0_15px_#FF0055]',
    lime: 'bg-neon-lime shadow-[0_0_15px_#00FF41]',
    violet: 'bg-neon-violet shadow-[0_0_15px_#B026FF]',
    gold: 'bg-neon-gold shadow-[0_0_15px_#FFD700]',
    blue: 'bg-neon-blue shadow-[0_0_15px_#00BFFF]',
  };

  return (
    <div className={`
      glass-floating p-8 transition-all duration-500 group
      ${glowMap[glowColor]}
      ${className}
    `}>
      {(title || icon) && (
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <h3 className={`text-xl font-bold tracking-tight flex items-center gap-3 text-text-primary ${titleColorMap[glowColor]} transition-colors duration-300`}>
            {icon && <span className="opacity-80 group-hover:opacity-100 transition-opacity">{icon}</span>}
            {title}
          </h3>
          <div className={`h-1.5 w-1.5 rounded-full ${accentColorMap[glowColor]} opacity-80 group-hover:opacity-100 transition-opacity`} />
        </div>
      )}
      {children}
    </div>
  );
};