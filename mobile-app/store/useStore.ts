import { create } from 'zustand';
import type { ThemeMode, Summary, Profile } from '@/types';

interface AppState {
  // Theme
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;

  // Summary data (cached)
  summary: Summary | null;
  setSummary: (summary: Summary) => void;

  // Profile data (cached)
  profile: Profile | null;
  setProfile: (profile: Profile) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Error state
  error: string | null;
  setError: (error: string | null) => void;

  // Initialize app
  isInitialized: boolean;
  setInitialized: (initialized: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  // Theme - default to dark
  themeMode: 'dark',
  setThemeMode: (mode) => set({ themeMode: mode }),

  // Summary
  summary: null,
  setSummary: (summary) => set({ summary }),

  // Profile
  profile: null,
  setProfile: (profile) => set({ profile }),

  // Loading
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  // Error
  error: null,
  setError: (error) => set({ error }),

  // Initialized
  isInitialized: false,
  setInitialized: (isInitialized) => set({ isInitialized }),
}));

export default useStore;
