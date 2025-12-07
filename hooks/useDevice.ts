import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store';
import { DeviceStatus } from '../types';

// Mock responses to simulate adb output
const MOCK_ADB_DEVICES = `List of devices attached
GM1917_CYBER_01	device`;

const MOCK_GETPROP = `
[ro.product.model]: [OnePlus 7 Pro]
[ro.product.name]: [guacamole]
[ro.build.version.release]: [11]
`;

const MOCK_BATTERY = `level: 85`;

export const useDevice = () => {
  const { device, updateDevice } = useAppStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulation of running a shell command (child_process.exec)
  const runAdbCommand = async (command: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real Electron app, this would use window.electron.ipcRenderer.invoke('adb-command', command)
        if (command === 'adb devices') resolve(Math.random() > 0.1 ? MOCK_ADB_DEVICES : 'List of devices attached\n');
        if (command === 'adb shell getprop') resolve(MOCK_GETPROP);
        if (command.includes('dumpsys battery')) resolve(MOCK_BATTERY);
        resolve('');
      }, 300 + Math.random() * 500); // Random latency
    });
  };

  const refreshDevice = useCallback(async () => {
    setIsRefreshing(true);
    
    try {
      // 1. Check connectivity
      const devicesOutput = await runAdbCommand('adb devices');
      const isConnected = devicesOutput.includes('\tdevice');
      
      if (!isConnected) {
        updateDevice({
          connected: false,
          model: null,
          deviceName: null,
          androidVersion: null,
          mode: null,
          battery: null,
          serial: null
        });
        setIsRefreshing(false);
        return;
      }

      // 2. Parse Serial
      const serial = devicesOutput.split('\n')[1].split('\t')[0];

      // 3. Get Properties
      const propsOutput = await runAdbCommand('adb shell getprop');
      const modelMatch = propsOutput.match(/\[ro\.product\.model\]: \[(.*?)\]/);
      const nameMatch = propsOutput.match(/\[ro\.product\.name\]: \[(.*?)\]/);
      const versionMatch = propsOutput.match(/\[ro\.build\.version\.release\]: \[(.*?)\]/);

      // 4. Get Battery
      const batteryOutput = await runAdbCommand('adb shell dumpsys battery | grep level');
      const batteryMatch = batteryOutput.match(/level: (\d+)/);

      updateDevice({
        connected: true,
        mode: 'adb',
        serial: serial,
        model: modelMatch ? modelMatch[1] : 'Unknown',
        deviceName: nameMatch ? nameMatch[1] : 'Unknown',
        androidVersion: versionMatch ? versionMatch[1] : 'Unknown',
        battery: batteryMatch ? parseInt(batteryMatch[1]) : null
      });

    } catch (error) {
      console.error('ADB Protocol Failed:', error);
      updateDevice({ connected: false });
    } finally {
      setIsRefreshing(false);
    }
  }, [updateDevice]);

  // Initial poll
  useEffect(() => {
    // We don't auto-poll in this demo to allow the "Connect" button to control state for demo purposes,
    // but in production this would be:
    // const interval = setInterval(refreshDevice, 5000);
    // return () => clearInterval(interval);
  }, [refreshDevice]);

  return {
    device,
    isRefreshing,
    refreshDevice
  };
};