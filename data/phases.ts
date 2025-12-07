import { InstallationPhase } from '../types';

export const INSTALLATION_PHASES: InstallationPhase[] = [
  {
    id: 1,
    title: 'PREREQUISITES CHECK',
    description: 'Verify device connectivity and required tools.',
    estimatedTime: '2 min',
    steps: [
      'Ensure "USB Debugging" is enabled in Developer Options',
      'Verify ADB detection of OnePlus 7 Pro',
      'Check battery level is above 50%'
    ],
    commands: [
      { label: 'Check ADB Connection', cmd: 'adb devices' },
      { label: 'Verify Battery Level', cmd: 'adb shell dumpsys battery | grep level' }
    ],
    validation: 'Device must be connected via ADB'
  },
  {
    id: 2,
    title: 'BACKUP DATA',
    description: 'Create a backup of essential partitions (Optional but Recommended).',
    estimatedTime: '15 min',
    steps: [
      'Backup photos, contacts, and messages manually',
      'Backup EFS/Persist partitions if rooted',
      'Copy internal storage to PC'
    ],
    commands: [
      { label: 'Pull Internal Storage', cmd: 'adb pull /sdcard/ ./backup/' }
    ]
  },
  {
    id: 3,
    title: 'ACQUIRE ASSETS',
    description: 'Download required ROM, Recovery, and Firmware files.',
    estimatedTime: 'Network Dependent',
    steps: [
      'Download crDroid 12.0 ZIP',
      'Download TWRP Recovery Image',
      'Download Firmware H.41 (if on OOS 10)'
    ],
    validation: 'All files must pass SHA256 checksum'
  },
  {
    id: 4,
    title: 'UNLOCK BOOTLOADER',
    description: 'Unlock the device bootloader to allow custom flashing.',
    estimatedTime: '5 min',
    steps: [
      'Reboot into Fastboot Mode',
      'Execute unlock command',
      'Confirm on device screen (Volume keys + Power)'
    ],
    commands: [
      { label: 'Reboot to Bootloader', cmd: 'adb reboot bootloader' },
      { label: 'Unlock Command', cmd: 'fastboot oem unlock' }
    ],
    validation: 'Device state must be "unlocked"'
  },
  {
    id: 5,
    title: 'FLASH RECOVERY',
    description: 'Install custom recovery (TWRP) to flash the ROM.',
    estimatedTime: '3 min',
    steps: [
      'Boot into Fastboot Mode',
      'Flash recovery image to boot partition',
      'Reboot into Recovery Mode'
    ],
    commands: [
      { label: 'Flash Recovery', cmd: 'fastboot flash boot twrp.img' },
      { label: 'Reboot to Recovery', cmd: 'fastboot reboot recovery' }
    ]
  },
  {
    id: 6,
    title: 'FLASH FIRMWARE',
    description: 'Ensure device firmware matches the ROM requirements.',
    estimatedTime: '5 min',
    steps: [
      'In TWRP, go to Install',
      'Select Firmware H.41 zip',
      'Swipe to flash'
    ],
    validation: 'Skip if already on Android 11 firmware'
  },
  {
    id: 7,
    title: 'INSTALL CRDROID',
    description: 'Format data and install the main OS.',
    estimatedTime: '10 min',
    steps: [
      'In TWRP: Wipe > Format Data > type "yes"',
      'Reboot to Recovery again',
      'ADB Sideload the ROM zip'
    ],
    commands: [
      { label: 'Sideload ROM', cmd: 'adb sideload crdroid-12.0-guacamole.zip' }
    ]
  },
  {
    id: 8,
    title: 'ROOT & FIRST BOOT',
    description: 'Optional Magisk installation and first boot setup.',
    estimatedTime: '10 min',
    steps: [
      '(Optional) Reboot to Recovery',
      '(Optional) ADB Sideload Magisk.apk',
      'Reboot System',
      'Wait for first boot (can take 5-10 mins)'
    ]
  }
];