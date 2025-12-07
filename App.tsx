
import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { PhaseTimeline } from './components/PhaseTimeline';
import { Terminal } from './components/Terminal';
import { Settings } from './components/Settings';
import { SmartDiagnostics } from './components/SmartDiagnostics';
import { ErrorRecovery } from './components/ErrorRecovery';
import { SystemMonitor } from './components/SystemMonitor';
import { SmartDownloader } from './components/SmartDownloader';
import { AutoBackup } from './components/AutoBackup';
import { DeviceVisualizer } from './components/DeviceVisualizer';
import { useAppStore } from './store';
import { ContextualHelp } from './components/ContextualHelp';
import { NotificationCenter } from './components/NotificationCenter';
import { AIAssistant } from './components/AIAssistant';
import { FloatingActionMenu } from './components/FloatingActionMenu';

const App: React.FC = () => {
  const { currentView } = useAppStore();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'visualizer':
        return <DeviceVisualizer />;
      case 'downloads':
        return <SmartDownloader />;
      case 'phases':
        return <PhaseTimeline />;
      case 'diagnostics':
        return <SmartDiagnostics />;
      case 'monitor':
        return <SystemMonitor />;
      case 'terminal':
        return <Terminal />;
      case 'recovery':
        return <ErrorRecovery />;
      case 'settings':
        return <Settings />;
      case 'backup':
        return <AutoBackup />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-deep text-text-primary font-mono overflow-hidden selection:bg-neon-magenta selection:text-white p-6 gap-6 relative">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[80%] bg-neon-cyan/5 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] bg-neon-magenta/5 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
        <div className="absolute -bottom-[20%] left-[20%] w-[70%] h-[70%] bg-neon-violet/5 rounded-full blur-[120px] animate-pulse-slow delay-2000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
      </div>

      <Sidebar />
      
      <main className="flex-1 relative z-10 h-full overflow-hidden">
        {renderView()}
      </main>

      <ContextualHelp />
      <NotificationCenter />
      <AIAssistant />
      <FloatingActionMenu />
    </div>
  );
};

export default App;
