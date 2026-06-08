import { create } from 'zustand';

interface AppState {
  xp: number;
  streak: number;
  activeRoadmap: any | null;
  activeAnalysis: any | null;
  
  setXp: (xp: number) => void;
  addXp: (points: number) => void;
  setStreak: (count: number) => void;
  setActiveRoadmap: (roadmap: any) => void;
  setActiveAnalysis: (analysis: any) => void;
  resetAll: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  xp: 0,
  streak: 0,
  activeRoadmap: null,
  activeAnalysis: null,

  setXp: (xp) => set({ xp }),
  addXp: (points) => set((state) => ({ xp: state.xp + points })),
  setStreak: (count) => set({ streak: count }),
  setActiveRoadmap: (roadmap) => set({ activeRoadmap: roadmap }),
  setActiveAnalysis: (analysis) => set({ activeAnalysis: analysis }),
  resetAll: () => set({ xp: 0, streak: 0, activeRoadmap: null, activeAnalysis: null }),
}));

export default useAppStore;
