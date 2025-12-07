import { useState } from 'react';
import { INSTALLATION_PHASES } from '../data/phases';
import { PhaseStatus } from '../types';

export const useInstallation = () => {
  const [currentPhaseId, setCurrentPhaseId] = useState<number>(1);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);

  const getPhaseStatus = (phaseId: number): PhaseStatus => {
    if (completedPhases.includes(phaseId)) return 'completed';
    if (phaseId === currentPhaseId) return 'active';
    return 'locked';
  };

  const completePhase = (phaseId: number) => {
    if (!completedPhases.includes(phaseId)) {
      setCompletedPhases(prev => [...prev, phaseId]);
      
      // Auto-advance to next phase if it's the current one
      if (phaseId === currentPhaseId) {
        const nextId = phaseId + 1;
        if (nextId <= INSTALLATION_PHASES.length) {
          setCurrentPhaseId(nextId);
        }
      }
    }
  };

  const resetPhase = (phaseId: number) => {
    setCompletedPhases(prev => prev.filter(id => id !== phaseId));
    if (phaseId < currentPhaseId) {
      setCurrentPhaseId(phaseId);
    }
  };

  const totalProgress = Math.round((completedPhases.length / INSTALLATION_PHASES.length) * 100);

  return {
    phases: INSTALLATION_PHASES,
    currentPhaseId,
    getPhaseStatus,
    completePhase,
    resetPhase,
    totalProgress
  };
};