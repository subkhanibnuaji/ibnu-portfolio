import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useStore } from '@/store/useStore';

export function useColorScheme() {
  const nativeColorScheme = useNativeColorScheme();
  const themeMode = useStore((state) => state.themeMode);

  if (themeMode === 'system') {
    return nativeColorScheme ?? 'dark';
  }

  return themeMode;
}
