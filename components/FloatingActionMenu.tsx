
import React, { useState } from 'react';
import { Plus, LayoutDashboard, Terminal, Settings, Download, X } from 'lucide-react';
import { useAppStore } from '../store';
import { View } from '../types';

export const FloatingActionMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setView } = useAppStore();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNavigate = (view: View) => {
    setView(view);
    setIsOpen(false);
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', view: 'dashboard', color: 'cyan', delay: '0ms' },
    { icon: <Download size={20} />, label: 'Downloads', view: 'downloads', color: 'lime', delay: '50ms' },
    { icon: <Terminal size={20} />, label: 'Terminal', view: 'terminal', color: 'magenta', delay: '100ms' },
    { icon: <Settings size={20} />, label: 'Settings', view: 'settings', color: 'violet', delay: '150ms' },
  ];

  return (
    <div className="fixed bottom-8 right-28 z-40 flex flex-col items-end">
      
      {/* Menu Items */}
      <div className={`flex flex-col-reverse gap-4 mb-4 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        {menuItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3 group">
             <div className="bg-deep/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg translate-x-2 group-hover:translate-x-0 transform duration-200">
               {item.label}
             </div>
             <button
               // @ts-ignore
               onClick={() => handleNavigate(item.view)}
               className={`
                 p-3 rounded-full bg-deep/80 backdrop-blur-md border border-white/10 text-white 
                 shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:scale-110 transition-all duration-300
                 hover:border-neon-${item.color} hover:text-neon-${item.color} hover:shadow-[0_0_20px_currentColor]
               `}
               style={{ transitionDelay: isOpen ? item.delay : '0ms' }}
             >
               {item.icon}
             </button>
          </div>
        ))}
      </div>

      {/* Main Trigger Button */}
      <button
        onClick={toggleMenu}
        className={`
          p-4 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-500 relative group
          ${isOpen 
            ? 'bg-neon-red rotate-45 hover:bg-neon-red/80' 
            : 'bg-deep border border-neon-cyan/50 hover:border-neon-cyan hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]'}
        `}
      >
        <div className={`absolute inset-0 rounded-full border border-white/10 ${!isOpen && 'animate-ping opacity-20'}`} />
        {isOpen ? (
          <Plus size={24} className="text-white" />
        ) : (
          <Plus size={24} className="text-neon-cyan" />
        )}
      </button>
    </div>
  );
};
