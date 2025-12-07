
import React, { useState } from 'react';
import { Bell, X, Check, AlertTriangle, Info, Shield, Download, Trash2, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store';
import { AppNotification } from '../types';

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markNotificationRead, dismissNotification, clearAllNotifications } = useAppStore();

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleOpen = () => setIsOpen(!isOpen);

  const getTypeStyles = (type: AppNotification['type']) => {
    switch (type) {
      case 'success': return 'border-neon-lime text-neon-lime bg-neon-lime/5';
      case 'warning': return 'border-neon-gold text-neon-gold bg-neon-gold/5';
      case 'error': return 'border-neon-red text-neon-red bg-neon-red/5';
      default: return 'border-neon-cyan text-neon-cyan bg-neon-cyan/5';
    }
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'success': return <Check size={16} />;
      case 'warning': return <AlertTriangle size={16} />;
      case 'error': return <Shield size={16} />;
      default: return <Info size={16} />;
    }
  };

  // Group notifications
  const groupedNotifications = {
    System: notifications.filter(n => n.group === 'System'),
    Download: notifications.filter(n => n.group === 'Download'),
    Security: notifications.filter(n => n.group === 'Security'),
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={toggleOpen}
        className={`
          fixed top-6 right-6 z-50 p-3 rounded-xl transition-all duration-300 border
          ${isOpen 
            ? 'bg-deep border-neon-cyan text-neon-cyan shadow-[0_0_20px_rgba(0,255,255,0.3)]' 
            : 'bg-white/5 border-white/10 text-text-secondary hover:text-white hover:bg-white/10 hover:border-white/20'}
        `}
      >
        <div className="relative">
          <Bell size={24} className={unreadCount > 0 && !isOpen ? 'animate-swing' : ''} />
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-neon-red rounded-full flex items-center justify-center text-[10px] font-black text-deep shadow-[0_0_10px_#FF0055]">
              {unreadCount}
            </div>
          )}
        </div>
      </button>

      {/* Slide-in Panel */}
      <>
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
          onClick={() => setIsOpen(false)}
        />

        {/* Panel */}
        <div className={`
          fixed top-0 right-0 h-full w-96 glass-floating z-50 flex flex-col transition-transform duration-500 ease-out border-l border-neon-cyan/20
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-deep/80 backdrop-blur-xl rounded-t-[24px]">
            <div>
              <h2 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
                NOTIFICATIONS
                {unreadCount > 0 && <span className="text-neon-cyan text-glow text-xs px-2 py-0.5 border border-neon-cyan/50 rounded">{unreadCount} NEW</span>}
              </h2>
            </div>
            <div className="flex gap-2">
              {notifications.length > 0 && (
                <button 
                  onClick={clearAllNotifications}
                  className="p-2 text-text-comment hover:text-neon-red transition-colors rounded-lg hover:bg-white/5"
                  title="Clear All"
                >
                  <Trash2 size={18} />
                </button>
              )}
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-text-comment hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6 bg-deep/90">
            {notifications.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-text-comment opacity-50 space-y-4">
                <Bell size={48} className="stroke-1" />
                <p className="text-sm font-mono uppercase tracking-widest">No new alerts</p>
              </div>
            ) : (
              Object.entries(groupedNotifications).map(([group, items]) => {
                if (items.length === 0) return null;
                return (
                  <div key={group} className="space-y-3">
                    <div className="flex items-center gap-3 px-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">{group}</span>
                      <div className="h-px flex-1 bg-white/5" />
                      <span className="text-[10px] font-mono text-text-comment bg-white/5 px-2 rounded-full">{items.length}</span>
                    </div>

                    {items.map(notification => (
                      <div 
                        key={notification.id}
                        className={`
                          relative group overflow-hidden rounded-xl border p-4 transition-all duration-300
                          ${notification.read ? 'border-white/5 bg-white/5 opacity-80' : `bg-deep ${getTypeStyles(notification.type)} border-opacity-50 shadow-[0_0_15px_rgba(0,0,0,0.2)]`}
                          hover:translate-x-[-4px]
                        `}
                        onMouseEnter={() => !notification.read && markNotificationRead(notification.id)}
                      >
                        {/* Neon line indicator for unread */}
                        {!notification.read && (
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${notification.type === 'error' ? 'bg-neon-red' : notification.type === 'warning' ? 'bg-neon-gold' : notification.type === 'success' ? 'bg-neon-lime' : 'bg-neon-cyan'} shadow-[0_0_10px_currentColor]`} />
                        )}

                        <div className="flex justify-between items-start mb-1 pl-2">
                           <div className="flex items-center gap-2">
                             <div className={`p-1 rounded ${notification.read ? 'text-text-comment' : ''}`}>
                               {getIcon(notification.type)}
                             </div>
                             <h4 className={`font-bold text-sm ${notification.read ? 'text-text-secondary' : 'text-white'}`}>
                               {notification.title}
                             </h4>
                           </div>
                           <button 
                             onClick={() => dismissNotification(notification.id)}
                             className="opacity-0 group-hover:opacity-100 text-text-comment hover:text-white transition-opacity p-1"
                           >
                             <X size={14} />
                           </button>
                        </div>
                        
                        <p className="text-xs text-text-secondary pl-3 mb-2 leading-relaxed">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between pl-3 mt-3">
                           <span className="text-[10px] text-text-comment font-mono">
                             {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </span>
                           
                           {notification.action && (
                             <button 
                               onClick={notification.action.action}
                               className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:text-white transition-colors"
                             >
                               {notification.action.label} <ArrowRight size={10} />
                             </button>
                           )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-white/5 bg-deep/90 text-center">
            <span className="text-[10px] text-text-comment uppercase tracking-widest flex items-center justify-center gap-2">
               <Shield size={10} /> System Monitoring Active
            </span>
          </div>
        </div>
      </>
    </>
  );
};
