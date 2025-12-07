
import { useState, useEffect, useCallback } from 'react';

export interface DownloadFile {
  id: string;
  name: string;
  size: string;
  totalBytes: number;
  downloadedBytes: number;
  progress: number;
  speed: number; // MB/s
  status: 'idle' | 'downloading' | 'paused' | 'verifying' | 'completed' | 'error';
  mirror: string;
  chunks: boolean[]; // Visual representation of chunks (true = downloaded)
  color: 'cyan' | 'magenta' | 'lime' | 'violet';
}

export interface Mirror {
  id: string;
  region: string;
  ping: number;
  health: number;
}

const INITIAL_FILES: DownloadFile[] = [
  {
    id: 'rom',
    name: 'crDroidAndroid-12.0-guacamole.zip',
    size: '1.2 GB',
    totalBytes: 1200 * 1024 * 1024,
    downloadedBytes: 0,
    progress: 0,
    speed: 0,
    status: 'idle',
    mirror: 'US-West',
    chunks: new Array(20).fill(false),
    color: 'cyan'
  },
  {
    id: 'recovery',
    name: 'twrp-3.7.0_12-0-guacamole.img',
    size: '96 MB',
    totalBytes: 96 * 1024 * 1024,
    downloadedBytes: 0,
    progress: 0,
    speed: 0,
    status: 'idle',
    mirror: 'US-West',
    chunks: new Array(20).fill(false),
    color: 'lime'
  },
  {
    id: 'firmware',
    name: 'OnePlus7Pro_OOS_11_Firmware.zip',
    size: '850 MB',
    totalBytes: 850 * 1024 * 1024,
    downloadedBytes: 0,
    progress: 0,
    speed: 0,
    status: 'idle',
    mirror: 'EU-Central',
    chunks: new Array(20).fill(false),
    color: 'magenta'
  },
  {
    id: 'magisk',
    name: 'Magisk-v26.1.apk',
    size: '11 MB',
    totalBytes: 11 * 1024 * 1024,
    downloadedBytes: 0,
    progress: 0,
    speed: 0,
    status: 'idle',
    mirror: 'Global',
    chunks: new Array(20).fill(false),
    color: 'violet'
  }
];

export const AVAILABLE_MIRRORS: Mirror[] = [
  { id: 'US-West', region: 'San Francisco, US', ping: 24, health: 98 },
  { id: 'US-East', region: 'New York, US', ping: 65, health: 95 },
  { id: 'EU-Central', region: 'Frankfurt, DE', ping: 142, health: 99 },
  { id: 'Asia-South', region: 'Singapore, SG', ping: 210, health: 88 },
];

export const useDownloads = () => {
  const [files, setFiles] = useState<DownloadFile[]>(INITIAL_FILES);
  const [totalSpeed, setTotalSpeed] = useState(0);
  const [speedHistory, setSpeedHistory] = useState<number[]>(new Array(30).fill(0));

  const toggleDownload = (id: string) => {
    setFiles(prev => prev.map(file => {
      if (file.id === id) {
        return {
          ...file,
          status: file.status === 'downloading' ? 'paused' : file.status === 'completed' ? 'completed' : 'downloading'
        };
      }
      return file;
    }));
  };

  const setMirror = (id: string, mirrorId: string) => {
    setFiles(prev => prev.map(file => file.id === id ? { ...file, mirror: mirrorId } : file));
  };

  const startAll = () => {
    setFiles(prev => prev.map(f => f.status !== 'completed' ? { ...f, status: 'downloading' } : f));
  };

  const pauseAll = () => {
    setFiles(prev => prev.map(f => f.status === 'downloading' ? { ...f, status: 'paused' } : f));
  };

  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      let currentTotalSpeed = 0;

      setFiles(prevFiles => prevFiles.map(file => {
        if (file.status !== 'downloading') {
          return { ...file, speed: 0 };
        }

        // Simulate speed fluctuation (5 - 15 MB/s base)
        const speedFluctuation = Math.random() * 5 + 5;
        // Adjust based on file size (smaller files download faster relative to size in this demo)
        const speed = speedFluctuation; 
        currentTotalSpeed += speed;

        const newDownloaded = Math.min(file.totalBytes, file.downloadedBytes + speed * 1024 * 1024 * 0.5); // 0.5s interval
        const progress = (newDownloaded / file.totalBytes) * 100;
        
        // Update chunks visual
        const chunksCount = file.chunks.length;
        const filledChunks = Math.floor((progress / 100) * chunksCount);
        const newChunks = file.chunks.map((_, idx) => idx < filledChunks);

        // Check completion
        if (progress >= 100) {
          return {
            ...file,
            downloadedBytes: file.totalBytes,
            progress: 100,
            speed: 0,
            status: 'verifying', // Transition to verifying
            chunks: newChunks
          };
        }

        return {
          ...file,
          downloadedBytes: newDownloaded,
          progress,
          speed,
          chunks: newChunks
        };
      }));

      setTotalSpeed(currentTotalSpeed);
      setSpeedHistory(prev => [...prev.slice(1), currentTotalSpeed]);

    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Verification Simulation
  useEffect(() => {
    const verifyingFiles = files.filter(f => f.status === 'verifying');
    if (verifyingFiles.length > 0) {
      const timers = verifyingFiles.map(f => 
        setTimeout(() => {
          setFiles(prev => prev.map(file => file.id === f.id ? { ...file, status: 'completed' } : file));
        }, 2000)
      );
      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [files]);

  return {
    files,
    totalSpeed,
    speedHistory,
    toggleDownload,
    setMirror,
    startAll,
    pauseAll
  };
};
