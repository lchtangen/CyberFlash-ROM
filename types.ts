
export type View = 'dashboard' | 'downloads' | 'phases' | 'terminal' | 'settings' | 'diagnostics' | 'recovery' | 'monitor' | 'backup' | 'visualizer';

export interface DeviceStatus {
  connected: boolean;
  model: string | null;
  deviceName: string | null;
  androidVersion: string | null;
  mode: 'adb' | 'fastboot' | 'recovery' | 'sideload' | null;
  battery: number | null;
  serial: string | null;
}

export interface AppSettings {
  adbPath: string;
  fastbootPath: string;
  downloadPath: string;
  autoVerify: boolean;
  verboseLogging: boolean;
  forceDark: boolean;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface NotificationAction {
  label: string;
  action: () => void;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: number;
  read: boolean;
  group: 'System' | 'Download' | 'Security';
  action?: NotificationAction;
}

export interface AppState {
  currentView: View;
  device: DeviceStatus;
  settings: AppSettings;
  notifications: AppNotification[];
  setView: (view: View) => void;
  updateDevice: (status: Partial<DeviceStatus>) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  toggleConnection: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

export type PhaseStatus = 'locked' | 'active' | 'completed';

export interface Command {
  label: string;
  cmd: string;
}

export interface InstallationPhase {
  id: number;
  title: string;
  description: string;
  estimatedTime: string;
  steps: string[];
  commands?: Command[];
  validation?: string; // Description of what is checked
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'error' | 'warning';
  message: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}