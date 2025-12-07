import { create } from 'zustand';
import { LogEntry } from '../types';

interface TerminalStore {
  logs: LogEntry[];
  addLog: (level: LogEntry['level'], message: string) => void;
  clearLogs: () => void;
  simulateBoot: () => void;
}

export const useTerminal = create<TerminalStore>((set) => ({
  logs: [],
  addLog: (level, message) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      level,
      message
    };
    set((state) => ({ logs: [...state.logs, newLog] }));
  },
  clearLogs: () => set({ logs: [] }),
  simulateBoot: () => {
    const bootSequence = [
      { delay: 100, level: 'info', msg: 'Initializing ADB bridge...' },
      { delay: 400, level: 'success', msg: 'ADB Server started successfully on port 5037' },
      { delay: 800, level: 'info', msg: 'Searching for connected devices...' },
      { delay: 1500, level: 'success', msg: 'Device detected: GM1917 (OnePlus 7 Pro)' },
      { delay: 1800, level: 'info', msg: 'Reading device properties [ro.build.product]...' },
      { delay: 2200, level: 'info', msg: 'Checking bootloader status...' },
      { delay: 2600, level: 'warning', msg: 'Bootloader is UNLOCKED' },
      { delay: 3000, level: 'success', msg: 'Ready for command input.' },
    ];

    let totalDelay = 0;
    bootSequence.forEach((step) => {
      totalDelay += step.delay;
      setTimeout(() => {
        set((state) => ({
          logs: [...state.logs, {
            id: Math.random().toString(36).substring(7),
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
            level: step.level as LogEntry['level'],
            message: step.msg
          }]
        }));
      }, totalDelay);
    });
  }
}));