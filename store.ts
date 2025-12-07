import { create } from 'zustand';
import { AppState } from './types';

export const useAppStore = create<AppState>((set) => ({
  currentView: 'dashboard',
  device: {
    connected: false,
    model: null,
    deviceName: null,
    androidVersion: null,
    mode: null,
    battery: null,
    serial: null,
  },
  settings: {
    adbPath: '/usr/bin/adb',
    fastbootPath: '/usr/bin/fastboot',
    downloadPath: '~/Downloads/crDroid',
    autoVerify: true,
    verboseLogging: false,
    forceDark: true,
  },
  notifications: [
    {
      id: '1',
      title: 'Update Available',
      message: 'crDroid v12.4 is now available for download.',
      type: 'info',
      timestamp: Date.now() - 1000 * 60 * 30,
      read: false,
      group: 'System',
      action: { label: 'Download', action: () => console.log('Download') }
    },
    {
      id: '2',
      title: 'ADB Connection Unstable',
      message: 'Packet loss detected on USB interface.',
      type: 'warning',
      timestamp: Date.now() - 1000 * 60 * 5,
      read: false,
      group: 'System'
    },
    {
      id: '3',
      title: 'Download Complete',
      message: 'Magisk-v26.1.apk has been verified.',
      type: 'success',
      timestamp: Date.now() - 1000 * 60 * 2,
      read: true,
      group: 'Download'
    }
  ],
  setView: (view) => set({ currentView: view }),
  updateDevice: (status) => set((state) => ({
    device: { ...state.device, ...status }
  })),
  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),
  toggleConnection: () => set((state) => ({
    device: {
      ...state.device,
      connected: !state.device.connected,
      mode: !state.device.connected ? 'adb' : null,
      model: !state.device.connected ? 'OnePlus 7 Pro' : null,
      deviceName: !state.device.connected ? 'guacamole' : null,
      androidVersion: !state.device.connected ? '11' : null,
      battery: !state.device.connected ? 85 : null,
      serial: !state.device.connected ? 'GM1917_CYBER_01' : null,
    }
  })),
  addNotification: (notification) => set((state) => ({
    notifications: [
      {
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        read: false
      },
      ...state.notifications
    ]
  })),
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    )
  })),
  dismissNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  clearAllNotifications: () => set({ notifications: [] })
}));